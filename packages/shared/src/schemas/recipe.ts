import { z } from "zod";
import { MAX_SERVINGS, MIN_SERVINGS } from "../scaling";

/**
 * The contract for a recipe, shared by the form, the API and the database
 * mapper. Validation lives here once so the client cannot accept something the
 * server rejects, or the other way round.
 */

export const RECIPE_STATUSES = ["draft", "active", "archived"] as const;
export type RecipeStatus = (typeof RECIPE_STATUSES)[number];

export const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vul een ingrediënt in")
    .max(100, "Naam is te lang"),
  // Nullable so "peper, naar smaak" can exist without a number.
  amount: z
    .number({ invalid_type_error: "Vul een getal in" })
    .positive("Hoeveelheid moet groter dan 0 zijn")
    .max(100_000, "Dat lijkt me te veel")
    .nullable(),
  unit: z.string().trim().max(30).nullable(),
  /** Author's override: never rescale this line. */
  scalable: z.boolean().default(true),
  note: z.string().trim().max(200).nullable().default(null),
});

export const stepSchema = z.object({
  content: z.string().trim().min(1, "Beschrijf deze stap").max(2000, "Stap is te lang"),
});

export const recipeInputSchema = z.object({
  title: z.string().trim().min(1, "Geef je recept een titel").max(150),
  description: z.string().trim().max(2000).nullable().default(null),
  tips: z.string().trim().max(2000).nullable().default(null),
  sourceUrl: z.string().trim().url("Dat is geen geldige URL").nullable().default(null),

  status: z.enum(RECIPE_STATUSES).default("draft"),
  categories: z.array(z.string().trim().min(1)).min(1, "Kies minstens één categorie").max(10),

  /**
   * The servings the amounts below were written for. Everything the reader
   * sees is derived from this, so it may never be 0.
   */
  servings: z
    .number({ invalid_type_error: "Vul een aantal personen in" })
    .int("Gebruik een heel getal")
    .min(MIN_SERVINGS, `Minimaal ${MIN_SERVINGS} persoon`)
    .max(MAX_SERVINGS, `Maximaal ${MAX_SERVINGS} personen`),

  preparationTime: z.number().int().min(0).max(10_000).default(0),
  cookTime: z.number().int().min(0).max(10_000).nullable().default(null),

  ingredients: z.array(ingredientSchema).min(1, "Voeg minstens één ingrediënt toe").max(100),
  approachSteps: z.array(stepSchema).min(1, "Voeg minstens één stap toe").max(100),
});

export type RecipeInput = z.input<typeof recipeInputSchema>;
export type RecipeInputParsed = z.output<typeof recipeInputSchema>;
export type IngredientInput = z.output<typeof ingredientSchema>;

/** Total time is always derived, never stored as user input. */
export function totalTimeOf(input: { preparationTime?: number | null; cookTime?: number | null }): number {
  return (input.preparationTime ?? 0) + (input.cookTime ?? 0);
}

// --- What the API sends back ------------------------------------------------

export interface RecipeSummary {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  status: RecipeStatus;
  servings: number;
  preparationTime: number;
  cookTime: number | null;
  totalTime: number;
  createdAt: string;
  categories: Array<{ id: string; title: string; slug: string }>;
  author: { id: string; username: string; avatar: string | null };
}

export interface RecipeDetail extends RecipeSummary {
  description: string | null;
  tips: string | null;
  sourceUrl: string | null;
  ingredients: Array<{
    id: string;
    name: string;
    amount: number | null;
    unit: string | null;
    scalable: boolean;
    note: string | null;
    position: number;
  }>;
  approachSteps: Array<{ id: string; content: string; position: number }>;
}
