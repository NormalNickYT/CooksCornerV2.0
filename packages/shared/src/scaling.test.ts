import { describe, expect, it } from "vitest";
import {
  clampServings,
  formatIngredientLine,
  scaleFactor,
  scaleIngredient,
  scaleRecipe,
  type ScalableIngredient,
} from "./scaling";

const ingredient = (over: Partial<ScalableIngredient> = {}): ScalableIngredient => ({
  name: "bloem",
  amount: 100,
  unit: "g",
  scalable: true,
  note: null,
  ...over,
});

describe("scaleFactor", () => {
  it("doubles from 1 to 2 servings", () => {
    expect(scaleFactor(1, 2)).toBe(2);
  });

  it("halves from 4 to 2 servings", () => {
    expect(scaleFactor(4, 2)).toBe(0.5);
  });

  it("survives a corrupt base of 0 instead of dividing by zero", () => {
    expect(Number.isFinite(scaleFactor(0, 4))).toBe(true);
    expect(scaleFactor(0, 4)).toBe(4);
  });
});

describe("clampServings", () => {
  it("never drops below one person", () => {
    expect(clampServings(0)).toBe(1);
    expect(clampServings(-5)).toBe(1);
  });

  it("caps absurd values and rounds fractions", () => {
    expect(clampServings(1000)).toBe(100);
    expect(clampServings(2.4)).toBe(2);
  });

  it("falls back to the minimum for NaN", () => {
    expect(clampServings(Number.NaN)).toBe(1);
  });
});

describe("scaleIngredient", () => {
  it("scales a plain weight", () => {
    const result = scaleIngredient(ingredient({ amount: 100, unit: "g" }), 2);
    expect(result.displayAmount).toBe("200");
    expect(result.displayUnit).toBe("g");
    expect(result.wasScaled).toBe(true);
  });

  it("steps grams up to kilos once the number gets silly", () => {
    const result = scaleIngredient(ingredient({ amount: 500, unit: "g" }), 3);
    expect(result.displayUnit).toBe("kg");
    expect(result.displayAmount).toBe("1,5");
    expect(result.converted).toBe(true);
  });

  it("steps millilitres up to litres", () => {
    const result = scaleIngredient(ingredient({ name: "melk", amount: 250, unit: "ml" }), 6);
    expect(result.displayUnit).toBe("l");
    expect(result.displayAmount).toBe("1,5");
  });

  it("rolls three teaspoons up into a tablespoon", () => {
    const result = scaleIngredient(ingredient({ name: "suiker", amount: 1, unit: "tl" }), 3);
    expect(result.displayUnit).toBe("el");
    expect(result.displayAmount).toBe("1");
    expect(result.converted).toBe(true);
  });

  it("keeps tablespoons as tablespoons rather than converting to millilitres", () => {
    const result = scaleIngredient(ingredient({ name: "olie", amount: 1, unit: "el" }), 0.5);
    expect(result.displayUnit).toBe("el");
    expect(result.displayAmount).toBe("½");
  });

  it("shows a readable fraction instead of a decimal", () => {
    const result = scaleIngredient(ingredient({ name: "boter", amount: 1, unit: "el" }), 2 / 3);
    expect(result.displayAmount).toBe("⅔");
  });

  it("never scales a pinch", () => {
    const result = scaleIngredient(ingredient({ name: "zout", amount: 1, unit: "snufje" }), 4);
    expect(result.wasScaled).toBe(false);
    expect(result.displayUnit).toBe("snufje");
    expect(result.displayAmount).toBe("1");
  });

  it("respects an author who locked a line", () => {
    const result = scaleIngredient(ingredient({ name: "peper", amount: 2, unit: "g", scalable: false }), 10);
    expect(result.wasScaled).toBe(false);
    expect(result.displayAmount).toBe("2");
  });

  it("handles an ingredient with no amount at all", () => {
    const result = scaleIngredient(ingredient({ name: "peper", amount: null, unit: null }), 3);
    expect(result.displayAmount).toBe("");
    expect(formatIngredientLine(result)).toBe("peper");
  });

  it("rounds countable things to halves so you never get a third of an egg", () => {
    const result = scaleIngredient(ingredient({ name: "ei", amount: 3, unit: "stuk" }), 1 / 3);
    expect(result.displayAmount).toBe("1");
    expect(result.displayUnit).toBe("stuk");
  });

  it("keeps at least half of a countable ingredient rather than rounding it away", () => {
    const result = scaleIngredient(ingredient({ name: "ei", amount: 1, unit: "stuk" }), 0.1);
    expect(result.displayAmount).toBe("½");
  });

  it("pluralises count units", () => {
    const result = scaleIngredient(ingredient({ name: "knoflook", amount: 1, unit: "teen" }), 3);
    expect(formatIngredientLine(result)).toBe("3 teentjes knoflook");
  });

  it("still scales a unit it does not recognise, leaving the text alone", () => {
    const result = scaleIngredient(ingredient({ name: "kruiden", amount: 2, unit: "handjes" }), 2);
    expect(result.displayAmount).toBe("4");
    expect(result.displayUnit).toBe("handjes");
    expect(result.wasScaled).toBe(true);
  });
});

describe("scaleRecipe", () => {
  const recipe: ScalableIngredient[] = [
    { name: "bloem", amount: 250, unit: "g", scalable: true, note: null },
    { name: "ei", amount: 2, unit: "stuk", scalable: true, note: null },
    { name: "melk", amount: 300, unit: "ml", scalable: true, note: null },
    { name: "zout", amount: 1, unit: "snufje", scalable: true, note: null },
  ];

  it("is the identity when the servings do not change", () => {
    const lines = scaleRecipe(recipe, { from: 4, to: 4 }).map(formatIngredientLine);
    expect(lines).toEqual(["250 g bloem", "2 stuks ei", "300 ml melk", "1 snufje zout"]);
  });

  it("scales the whole list from 4 to 6 people", () => {
    const lines = scaleRecipe(recipe, { from: 4, to: 6 }).map(formatIngredientLine);
    expect(lines).toEqual(["375 g bloem", "3 stuks ei", "450 ml melk", "1 snufje zout"]);
  });

  it("scales down to a single portion without producing nonsense", () => {
    const lines = scaleRecipe(recipe, { from: 4, to: 1 }).map(formatIngredientLine);
    expect(lines).toEqual(["63 g bloem", "½ stuks ei", "75 ml melk", "1 snufje zout"]);
  });

  it("clamps a request for zero servings to one", () => {
    const scaled = scaleRecipe(recipe, { from: 4, to: 0 });
    expect(scaled[0]!.rawAmount).toBe(62.5);
  });
});

describe("unit labels agree with the rounded amount", () => {
  it("says 'stuk', not 'stuks', when half a lettuce rounds up to one", () => {
    const result = scaleIngredient(ingredient({ name: "ijsbergsla", amount: 0.5, unit: "stuk" }), 1.5);
    expect(formatIngredientLine(result)).toBe("1 stuk ijsbergsla");
  });

  it("pluralises once the rounded amount really is more than one", () => {
    const result = scaleIngredient(ingredient({ name: "ui", amount: 1, unit: "stuk" }), 1.5);
    expect(formatIngredientLine(result)).toBe("1½ stuks ui");
  });
});
