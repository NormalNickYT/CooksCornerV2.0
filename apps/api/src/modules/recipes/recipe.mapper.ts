import type { Category, Ingredient, Prisma, Recipe, Step, User } from "@prisma/client";
import type { RecipeDetail, RecipeSummary } from "@cookscorner/shared";
import { env } from "../../core/env";

/**
 * Turns database rows into the shape the client is promised.
 *
 * Two things must happen here and nowhere else: Prisma `Decimal` values become
 * plain numbers (they serialise to JSON as objects otherwise, and the client
 * cannot do arithmetic on those), and image filenames become URLs.
 */

export type RecipeWithRelations = Recipe & {
  author: User;
  ingredients: Ingredient[];
  steps: Step[];
  categories: Array<{ category: Category }>;
};

/** Prisma's Decimal, or null. Never leaks past this module. */
function decimalToNumber(value: Prisma.Decimal | null): number | null {
  if (value === null) return null;
  const asNumber = value.toNumber();
  return Number.isFinite(asNumber) ? asNumber : null;
}

export function imageUrl(filename: string | null): string | null {
  return filename ? `${env.API_URL}/uploads/${filename}` : null;
}

export function toRecipeSummary(recipe: RecipeWithRelations): RecipeSummary {
  return {
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    image: imageUrl(recipe.image),
    status: recipe.status,
    servings: recipe.servings,
    preparationTime: recipe.preparationTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    createdAt: recipe.createdAt.toISOString(),
    categories: recipe.categories.map(({ category }) => ({
      id: category.id,
      title: category.title,
      slug: category.slug,
    })),
    author: {
      id: recipe.author.id,
      username: recipe.author.username,
      avatar: recipe.author.avatar,
    },
  };
}

export function toRecipeDetail(recipe: RecipeWithRelations): RecipeDetail {
  return {
    ...toRecipeSummary(recipe),
    description: recipe.description,
    tips: recipe.tips,
    sourceUrl: recipe.sourceUrl,
    ingredients: recipe.ingredients
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        amount: decimalToNumber(ingredient.amount),
        unit: ingredient.unit,
        scalable: ingredient.scalable,
        note: ingredient.note,
        position: ingredient.position,
      })),
    approachSteps: recipe.steps
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((step) => ({ id: step.id, content: step.content, position: step.position })),
  };
}

/** The include clause every read uses, so summaries and details never diverge. */
export const recipeInclude = {
  author: true,
  ingredients: true,
  steps: true,
  categories: { include: { category: true } },
} satisfies Prisma.RecipeInclude;
