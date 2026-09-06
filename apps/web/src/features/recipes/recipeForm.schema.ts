import {
  MAX_SERVINGS,
  MIN_SERVINGS,
  RECIPE_STATUSES,
  type RecipeDetail,
  type RecipeInputParsed,
  parseAmount,
} from "@cookscorner/shared";
import { z } from "zod";

/**
 * The form's own shape.
 *
 * Every text input hands back a string, so amounts stay strings here and are
 * parsed on the way out. That is also what lets someone type "1 1/2" or "½"
 * instead of hunting for the decimal equivalent.
 */
export const recipeFormSchema = z.object({
  title: z.string().trim().min(1, "Geef je recept een titel").max(150, "Titel is te lang"),
  description: z.string().trim().max(2000, "Beschrijving is te lang"),
  tips: z.string().trim().max(2000, "Tips zijn te lang"),
  sourceUrl: z
    .string()
    .trim()
    .refine((value) => value === "" || z.string().url().safeParse(value).success, "Dat is geen geldige URL"),

  status: z.enum(RECIPE_STATUSES),
  categories: z.array(z.string().trim().min(1)).min(1, "Kies minstens één categorie"),

  servings: z
    .number({ invalid_type_error: "Vul een aantal personen in" })
    .int("Gebruik een heel getal")
    .min(MIN_SERVINGS, `Minimaal ${MIN_SERVINGS} persoon`)
    .max(MAX_SERVINGS, `Maximaal ${MAX_SERVINGS} personen`),

  preparationTime: z.number({ invalid_type_error: "Vul een getal in" }).int().min(0).max(10_000),
  cookTime: z.number({ invalid_type_error: "Vul een getal in" }).int().min(0).max(10_000),

  ingredients: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Vul een ingrediënt in").max(100),
        // A string, so "naar smaak" ingredients can simply be left blank.
        amount: z
          .string()
          .trim()
          .refine(
            (value) => value === "" || (parseAmount(value) ?? 0) > 0,
            "Vul een getal in, bijvoorbeeld 250, 1,5 of 1 1/2",
          ),
        unit: z.string().trim().max(30),
        scalable: z.boolean(),
        note: z.string().trim().max(200),
      }),
    )
    .min(1, "Voeg minstens één ingrediënt toe"),

  approachSteps: z
    .array(z.object({ content: z.string().trim().min(1, "Beschrijf deze stap").max(2000) }))
    .min(1, "Voeg minstens één stap toe"),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export const emptyIngredient = { name: "", amount: "", unit: "", scalable: true, note: "" };
export const emptyStep = { content: "" };

export const defaultRecipeFormValues: RecipeFormValues = {
  title: "",
  description: "",
  tips: "",
  sourceUrl: "",
  status: "draft",
  categories: [],
  servings: 4,
  preparationTime: 0,
  cookTime: 0,
  ingredients: [{ ...emptyIngredient }],
  approachSteps: [{ ...emptyStep }],
};

/** Turns form values into the payload the API validates against. */
export function toRecipeInput(values: RecipeFormValues): RecipeInputParsed {
  return {
    title: values.title,
    description: values.description || null,
    tips: values.tips || null,
    sourceUrl: values.sourceUrl || null,
    status: values.status,
    categories: values.categories,
    servings: values.servings,
    preparationTime: values.preparationTime,
    cookTime: values.cookTime || null,
    ingredients: values.ingredients.map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.amount === "" ? null : parseAmount(ingredient.amount),
      unit: ingredient.unit || null,
      scalable: ingredient.scalable,
      note: ingredient.note || null,
    })),
    approachSteps: values.approachSteps.map((step) => ({ content: step.content })),
  };
}

/** Fills the form when editing an existing recipe. */
export function toFormValues(recipe: RecipeDetail): RecipeFormValues {
  return {
    title: recipe.title,
    description: recipe.description ?? "",
    tips: recipe.tips ?? "",
    sourceUrl: recipe.sourceUrl ?? "",
    status: recipe.status,
    categories: recipe.categories.map((category) => category.title),
    servings: recipe.servings,
    preparationTime: recipe.preparationTime,
    cookTime: recipe.cookTime ?? 0,
    ingredients: recipe.ingredients.map((ingredient) => ({
      name: ingredient.name,
      // Plain decimals in the editor: easier to correct than "1½".
      amount: ingredient.amount === null ? "" : String(ingredient.amount),
      unit: ingredient.unit ?? "",
      scalable: ingredient.scalable,
      note: ingredient.note ?? "",
    })),
    approachSteps: recipe.approachSteps.map((step) => ({ content: step.content })),
  };
}
