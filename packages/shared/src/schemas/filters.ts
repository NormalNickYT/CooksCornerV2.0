import { z } from "zod";

/**
 * Query parameters for the recipe list. Parsed from strings because they come
 * off a URL, then reused as the typed argument to the repository.
 */

export const RECIPE_SORT_FIELDS = ["createdAt", "title", "totalTime", "preparationTime"] as const;

/** Query strings are always strings; coerce and clamp before they reach Prisma. */
export const recipeFiltersSchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  authorId: z.string().trim().min(1).optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  maxTotalTime: z.coerce.number().int().positive().max(10_000).optional(),
  servings: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(RECIPE_SORT_FIELDS).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  // Capped so a stray ?limit=999999 cannot pull the whole table.
  limit: z.coerce.number().int().min(1).max(50).default(12),
  offset: z.coerce.number().int().min(0).default(0),
});

export type RecipeFilters = z.output<typeof recipeFiltersSchema>;

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
