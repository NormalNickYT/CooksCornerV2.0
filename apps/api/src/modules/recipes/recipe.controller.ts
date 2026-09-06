import type { Request, Response } from "express";
import type { RecipeFilters } from "@cookscorner/shared";
import { clampServings, recipeFiltersSchema } from "@cookscorner/shared";
import { BadRequestError, UnauthorizedError } from "../../core/errors";
import { validated } from "../../middleware/validate";
import { recipeService } from "./recipe.service";

/**
 * A recipe arrives as multipart/form-data: the image as a file part and
 * everything else as a JSON string, because form fields cannot carry the
 * nested ingredient and step arrays.
 */
function parseRecipePayload(req: Request): unknown {
  const raw = req.body?.data;
  if (typeof raw !== "string") {
    throw new BadRequestError("Verwacht een 'data' veld met het recept als JSON");
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new BadRequestError("Het 'data' veld bevat geen geldige JSON");
  }
}

function requireUserId(req: Request): string {
  const id = req.user?.id;
  if (!id) throw new UnauthorizedError();
  return id;
}

export async function list(req: Request, res: Response): Promise<void> {
  const filters = validated<RecipeFilters>(req, "query");
  res.json(await recipeService.list(filters, req.user?.id));
}

/** The signed-in user's own recipes, drafts included. */
export async function listMine(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const filters = recipeFiltersSchema.parse({ ...req.query, authorId: userId });
  res.json(await recipeService.list(filters, userId));
}

export async function detail(req: Request, res: Response): Promise<void> {
  const { idOrSlug } = req.params as { idOrSlug: string };

  // ?servings=6 returns the amounts already recalculated, so a printout or a
  // future shopping list does not have to redo the maths.
  const requested = req.query.servings;
  if (typeof requested === "string" && requested.trim() !== "") {
    const servings = clampServings(Number(requested));
    res.json(await recipeService.getScaled(idOrSlug, servings, req.user?.id));
    return;
  }

  res.json(await recipeService.getOne(idOrSlug, req.user?.id));
}

export async function create(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const recipe = await recipeService.create(parseRecipePayload(req), userId, req.file?.filename ?? null);
  res.status(201).json(recipe);
}

export async function update(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const { id } = req.params as { id: string };
  const recipe = await recipeService.update(id, parseRecipePayload(req), userId, req.file?.filename ?? null);
  res.json(recipe);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const { id } = req.params as { id: string };
  await recipeService.delete(id, userId);
  res.status(204).send();
}

export async function listCategories(_req: Request, res: Response): Promise<void> {
  const categories = await recipeService.listCategories();
  res.json(
    categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      title: category.title,
      recipeCount: category._count.recipes,
    })),
  );
}
