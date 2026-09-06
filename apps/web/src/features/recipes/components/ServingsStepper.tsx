import { MAX_SERVINGS, MIN_SERVINGS, clampServings } from "@cookscorner/shared";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServingsStepperProps {
  /** The servings the recipe was written for. */
  baseServings: number;
  value: number;
  onChange: (servings: number) => void;
  className?: string;
}

/**
 * The one control that makes a recipe work for any number of people.
 *
 * Everything else on the page derives from this number, so it is deliberately
 * large, keyboard-accessible and reversible: one click back to the amounts the
 * author actually wrote down.
 */
export function ServingsStepper({ baseServings, value, onChange, className }: ServingsStepperProps) {
  const inputId = useId();
  const changed = value !== baseServings;

  const step = (delta: number) => onChange(clampServings(value + delta));

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <label htmlFor={inputId} className="text-sm font-medium">
        Voor hoeveel personen?
      </label>

      <div className="flex items-center rounded-lg border bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-r-none"
          onClick={() => step(-1)}
          disabled={value <= MIN_SERVINGS}
          aria-label="Eén persoon minder"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={MIN_SERVINGS}
          max={MAX_SERVINGS}
          value={value}
          onChange={(event) => {
            // Let the field go empty while typing; only commit real numbers.
            const parsed = Number.parseInt(event.target.value, 10);
            if (!Number.isNaN(parsed)) onChange(clampServings(parsed));
          }}
          className="h-11 w-14 border-x bg-transparent text-center text-lg font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label="Aantal personen"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-l-none"
          onClick={() => step(1)}
          disabled={value >= MAX_SERVINGS}
          aria-label="Eén persoon meer"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {changed && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => onChange(baseServings)}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Terug naar {baseServings}
        </Button>
      )}
    </div>
  );
}
