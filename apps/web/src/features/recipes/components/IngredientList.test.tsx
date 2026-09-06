import type { RecipeDetail } from "@cookscorner/shared";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { IngredientList } from "./IngredientList";
import { ServingsStepper } from "./ServingsStepper";

const ingredients: RecipeDetail["ingredients"] = [
  { id: "1", name: "bloem", amount: 250, unit: "g", scalable: true, note: null, position: 0 },
  { id: "2", name: "melk", amount: 500, unit: "ml", scalable: true, note: null, position: 1 },
  { id: "3", name: "ei", amount: 2, unit: "stuk", scalable: true, note: null, position: 2 },
  { id: "4", name: "zout", amount: 1, unit: "snufje", scalable: true, note: null, position: 3 },
];

describe("IngredientList", () => {
  it("shows the author's amounts when the servings are unchanged", () => {
    render(<IngredientList ingredients={ingredients} baseServings={2} servings={2} />);

    expect(screen.getByText("250 g")).toBeInTheDocument();
    expect(screen.getByText("500 ml")).toBeInTheDocument();
    expect(screen.getByText("2 stuks")).toBeInTheDocument();
  });

  it("doubles the amounts for twice the people", () => {
    render(<IngredientList ingredients={ingredients} baseServings={2} servings={4} />);

    expect(screen.getByText("500 g")).toBeInTheDocument();
    // 1000 ml is shown as 1 l.
    expect(screen.getByText("1 l")).toBeInTheDocument();
    expect(screen.getByText("4 stuks")).toBeInTheDocument();
  });

  it("halves the amounts for half the people", () => {
    render(<IngredientList ingredients={ingredients} baseServings={2} servings={1} />);

    expect(screen.getByText("125 g")).toBeInTheDocument();
    expect(screen.getByText("250 ml")).toBeInTheDocument();
    expect(screen.getByText("1 stuk")).toBeInTheDocument();
  });

  it("leaves a pinch of salt untouched however far it is scaled", () => {
    render(<IngredientList ingredients={ingredients} baseServings={2} servings={12} />);
    expect(screen.getByText("1 snufje")).toBeInTheDocument();
  });

  it("renders an ingredient without an amount as just its name", () => {
    render(
      <IngredientList
        ingredients={[
          { id: "1", name: "peper", amount: null, unit: null, scalable: true, note: null, position: 0 },
        ]}
        baseServings={4}
        servings={8}
      />,
    );

    expect(screen.getByText("peper")).toBeInTheDocument();
  });
});

/** The two components together, the way the recipe page wires them up. */
function ScalableRecipe({ base }: { base: number }) {
  const [servings, setServings] = useState(base);
  return (
    <>
      <ServingsStepper baseServings={base} value={servings} onChange={setServings} />
      <IngredientList ingredients={ingredients} baseServings={base} servings={servings} />
    </>
  );
}

describe("ServingsStepper driving the list", () => {
  it("recalculates the amounts when the reader asks for one more person", async () => {
    const user = userEvent.setup();
    render(<ScalableRecipe base={2} />);

    expect(screen.getByText("250 g")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Eén persoon meer" }));

    expect(screen.getByText("375 g")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Aantal personen" })).toHaveValue(3);
  });

  it("cannot go below one person", async () => {
    const user = userEvent.setup();
    render(<ScalableRecipe base={1} />);

    const decrement = screen.getByRole("button", { name: "Eén persoon minder" });
    expect(decrement).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Eén persoon meer" }));
    expect(decrement).toBeEnabled();
  });

  it("offers a way back to the amounts the author wrote", async () => {
    const user = userEvent.setup();
    render(<ScalableRecipe base={2} />);

    // Only offered once something has changed.
    expect(screen.queryByRole("button", { name: /Terug naar/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Eén persoon meer" }));
    await user.click(screen.getByRole("button", { name: "Terug naar 2" }));

    expect(screen.getByText("250 g")).toBeInTheDocument();
  });
});
