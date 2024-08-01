import { z } from "zod";

export const manualRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        amount: z.number().min(1, "Amount is required"),
        unit: z.string().min(1, "Unit is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
  approach: z.string().min(1, "Approach is required"),
  preparationTime: z.number().min(1, "Preparation time is required"),
  tips: z.string().nullable(),
  categories: z.string().array().min(1, "At least one category is required"),
  status: z.string().min(1, "Status is required"),
  image: z.instanceof(File, { message: "Image is required" }),
  userId: z.string().optional(),
});

export const urlRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL"),
  image: z.instanceof(File, { message: "Image is required" }),
  categories: z.string().min(1, "Categories is required"),
  tips: z.string().nullable(),
});

export type ManualRecipe = z.infer<typeof manualRecipeSchema>;
export type URLRecipe = z.infer<typeof urlRecipeSchema>;
