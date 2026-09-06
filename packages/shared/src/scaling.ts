/**
 * Scaling a recipe from the servings it was written for to the servings you
 * want to cook tonight.
 *
 * This module is the single source of truth for that maths. The form preview,
 * the recipe page and the API all call `scaleRecipe`, so a number can never
 * mean two different things in two different places.
 */

import { formatAmount } from "./quantity";
import { findUnit, ladderFor, unitLabel, type UnitDef } from "./units";

export interface ScalableIngredient {
  id?: string;
  name: string;
  /** Amount as written by the author, for `baseServings` people. */
  amount: number | null;
  /** Unit id or free text. Unknown units are kept verbatim and still scale. */
  unit: string | null;
  /** Author's override: keep this line exactly as written at any serving size. */
  scalable?: boolean;
  note?: string | null;
}

export interface ScaledIngredient extends ScalableIngredient {
  /** Exact scaled amount, before rounding. Useful for shopping lists. */
  rawAmount: number | null;
  /** Ready to render: "1½", "250", "". */
  displayAmount: string;
  /** Ready to render: "kg", "teentjes", "". */
  displayUnit: string;
  /** True when the unit was swapped, e.g. 1500 g shown as 1,5 kg. */
  converted: boolean;
  /** False when this line was deliberately left alone. */
  wasScaled: boolean;
}

export interface ScaleOptions {
  /** Servings the recipe was written for. */
  from: number;
  /** Servings to cook. */
  to: number;
  locale?: string;
}

/** Servings a recipe can be scaled to. Guards against 0 and absurd values. */
export const MIN_SERVINGS = 1;
export const MAX_SERVINGS = 100;

export function clampServings(value: number): number {
  if (!Number.isFinite(value)) return MIN_SERVINGS;
  return Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, Math.round(value)));
}

/** The multiplier, guarded so a corrupt `baseServings` cannot divide by zero. */
export function scaleFactor(from: number, to: number): number {
  const base = Math.max(1, Math.round(from || 1));
  return clampServings(to) / base;
}

/**
 * Pick the nicest unit for an amount.
 *
 * Only ladder units convert (g <-> kg, ml <-> l): a tablespoon stays a
 * tablespoon, because "0.75 el" reads fine as "¾ el" and "11,25 ml" does not.
 * The one exception is teaspoons, which roll up into tablespoons at 3.
 */
function normalise(amount: number, unit: UnitDef): { amount: number; unit: UnitDef; converted: boolean } {
  // 3 tl is 1 el, and every cook knows it.
  if (unit.id === "tl" && amount >= 3) {
    const el = findUnit("el");
    if (el) return { amount: (amount * unit.factor) / el.factor, unit: el, converted: true };
  }

  const ladder = ladderFor(unit);
  if (ladder.length === 0) return { amount, unit, converted: false };

  const inBase = amount * unit.factor;
  // Largest unit that still leaves a number of at least 1.
  let best = ladder[0];
  for (const candidate of ladder) {
    if (inBase / candidate.factor >= 1) best = candidate;
  }

  if (best.id === unit.id) return { amount, unit, converted: false };
  return { amount: inBase / best.factor, unit: best, converted: true };
}

/** Scale one ingredient line. */
export function scaleIngredient(
  ingredient: ScalableIngredient,
  factor: number,
  locale = "nl-NL",
): ScaledIngredient {
  const unit = findUnit(ingredient.unit);

  // "Snufje zout" times four is still a snufje.
  const locked =
    ingredient.scalable === false ||
    unit?.kind === "free" ||
    ingredient.amount === null ||
    ingredient.amount === undefined;

  if (locked) {
    return {
      ...ingredient,
      rawAmount: ingredient.amount ?? null,
      displayAmount: formatAmount(ingredient.amount, {
        locale,
        discrete: unit?.discrete,
        fractions: !unit?.ladder,
      }),
      displayUnit: unit ? unitLabel(unit, ingredient.amount ?? 1) : (ingredient.unit ?? ""),
      converted: false,
      wasScaled: false,
    };
  }

  const raw = ingredient.amount * factor;

  if (!unit) {
    // Unknown unit: still scale the number, leave the text alone.
    return {
      ...ingredient,
      rawAmount: raw,
      displayAmount: formatAmount(raw, { locale }),
      displayUnit: ingredient.unit ?? "",
      converted: false,
      wasScaled: true,
    };
  }

  const { amount, unit: finalUnit, converted } = normalise(raw, unit);

  return {
    ...ingredient,
    rawAmount: raw,
    displayAmount: formatAmount(amount, {
      locale,
      discrete: finalUnit.discrete,
      // Metric units are decimal by design: "1,5 kg", not "1½ kg".
      fractions: !finalUnit.ladder,
    }),
    displayUnit: unitLabel(finalUnit, amount),
    converted,
    wasScaled: true,
  };
}

/** Scale a whole ingredient list. */
export function scaleRecipe(
  ingredients: readonly ScalableIngredient[],
  { from, to, locale = "nl-NL" }: ScaleOptions,
): ScaledIngredient[] {
  const factor = scaleFactor(from, to);
  return ingredients.map((ingredient) => scaleIngredient(ingredient, factor, locale));
}

/** One line ready to render or copy: "250 g bloem". */
export function formatIngredientLine(ingredient: ScaledIngredient): string {
  return [ingredient.displayAmount, ingredient.displayUnit, ingredient.name]
    .filter(Boolean)
    .join(" ")
    .trim();
}
