import { type RecipeDetail, scaleRecipe } from "@cookscorner/shared";
import { Lock } from "lucide-react";
import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IngredientListProps {
  ingredients: RecipeDetail["ingredients"];
  /** Servings the amounts were written for. */
  baseServings: number;
  /** Servings the reader wants to cook. */
  servings: number;
  className?: string;
}

/**
 * The ingredient list, recalculated for the chosen number of people.
 *
 * The maths runs through the same shared engine the API uses, so the printed
 * page and the screen can never disagree. Recalculation happens in the
 * browser: it is pure arithmetic, and a round trip per click would make the
 * stepper feel broken.
 */
export function IngredientList({ ingredients, baseServings, servings, className }: IngredientListProps) {
  const scaled = useMemo(
    () => scaleRecipe(ingredients, { from: baseServings, to: servings }),
    [ingredients, baseServings, servings],
  );

  const isScaled = servings !== baseServings;

  return (
    <TooltipProvider delayDuration={200}>
      <ul className={cn("divide-y", className)}>
        {scaled.map((ingredient, index) => (
          <li
            key={ingredient.id ?? index}
            className="flex items-baseline gap-3 py-2.5"
          >
            <span
              className={cn(
                "min-w-[5.5rem] shrink-0 text-right font-semibold tabular-nums",
                // Highlight only what actually changed, so the eye lands on
                // the numbers the reader needs to re-check.
                isScaled && ingredient.wasScaled ? "text-primary" : "text-foreground",
              )}
            >
              {[ingredient.displayAmount, ingredient.displayUnit].filter(Boolean).join(" ") || "—"}
            </span>

            <span className="flex-1">
              {ingredient.name}
              {ingredient.note && (
                <span className="ml-1.5 text-sm text-muted-foreground">({ingredient.note})</span>
              )}
            </span>

            {isScaled && !ingredient.wasScaled && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="shrink-0 text-muted-foreground" aria-label="Niet meegeschaald">
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[15rem] text-sm">
                    Deze hoeveelheid schaalt niet mee. Voeg toe naar smaak.
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </li>
        ))}
      </ul>
    </TooltipProvider>
  );
}
