import { UNITS, clampServings, formatIngredientLine, parseAmount, scaleRecipe } from "@cookscorner/shared";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServingsStepper } from "./ServingsStepper";
import type { RecipeFormValues } from "../recipeForm.schema";

interface ScalingPreviewProps {
  ingredients: RecipeFormValues["ingredients"];
  baseServings: number;
}

/**
 * Shows the author what their recipe looks like at another serving size,
 * while they are still writing it.
 *
 * This is the part that makes the feature trustworthy: you enter the amounts
 * once, for the number of people you actually cook for, and immediately see
 * that doubling produces "1 kg" and not "1000 g" or "2 ei". Catching a badly
 * chosen unit here is far cheaper than discovering it in the kitchen.
 */
export function ScalingPreview({ ingredients, baseServings }: ScalingPreviewProps) {
  const safeBase = clampServings(baseServings || 1);
  // Default to something different from the base, or the preview shows nothing.
  const [preview, setPreview] = useState(() => clampServings(safeBase * 2));

  const lines = useMemo(() => {
    const usable = ingredients
      .filter((ingredient) => ingredient.name.trim() !== "")
      .map((ingredient) => ({
        name: ingredient.name.trim(),
        amount: ingredient.amount === "" ? null : parseAmount(ingredient.amount),
        unit: ingredient.unit.trim() || null,
        scalable: ingredient.scalable,
        note: ingredient.note.trim() || null,
      }));

    return scaleRecipe(usable, { from: safeBase, to: preview });
  }, [ingredients, safeBase, preview]);

  if (lines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Voorbeeld</CardTitle>
          <CardDescription>
            Vul hierboven ingrediënten in. Je ziet hier meteen hoe je recept omgerekend wordt naar
            een ander aantal personen.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const converted = lines.filter((line) => line.converted);
  const locked = lines.filter((line) => !line.wasScaled);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Voorbeeld</CardTitle>
        <CardDescription>
          Je vult de hoeveelheden één keer in, voor {safeBase}{" "}
          {safeBase === 1 ? "persoon" : "personen"}. De rest rekenen we uit.
        </CardDescription>
        <ServingsStepper
          baseServings={safeBase}
          value={preview}
          onChange={setPreview}
          className="pt-2"
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-1.5 text-sm">
          {lines.map((line, index) => (
            <li key={index} className="tabular-nums">
              {formatIngredientLine(line) || line.name}
            </li>
          ))}
        </ul>

        {(converted.length > 0 || locked.length > 0) && (
          <div className="flex gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-1">
              {converted.length > 0 && (
                <p>
                  Eenheid omgerekend voor{" "}
                  <span className="font-medium text-foreground">
                    {converted.map((line) => line.name).join(", ")}
                  </span>
                  , zodat het leesbaar blijft.
                </p>
              )}
              {locked.length > 0 && (
                <p>
                  <span className="font-medium text-foreground">
                    {locked.map((line) => line.name).join(", ")}
                  </span>{" "}
                  {locked.length === 1 ? "schaalt" : "schalen"} niet mee.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Suggestions for the unit field. Free text is still allowed and still scales. */
export const UNIT_SUGGESTIONS = UNITS.map((unit) => unit.label);
