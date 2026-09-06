import type { Prisma } from "@prisma/client";
import type {
  Paginated,
  RecipeDetail,
  RecipeFilters,
  RecipeInputParsed,
  RecipeSummary,
} from "@cookscorner/shared";
import { recipeInputSchema, scaleRecipe, slugify, totalTimeOf } from "@cookscorner/shared";
import { ForbiddenError, NotFoundError } from "../../core/errors";
import { logger } from "../../core/logger";
import { removeUpload } from "../../middleware/upload";
import { toRecipeDetail, toRecipeSummary, type RecipeWithRelations } from "./recipe.mapper";
import { recipeRepository } from "./recipe.repository";

export class RecipeService {
  private readonly repository = recipeRepository;

  async list(filters: RecipeFilters, viewerId?: string): Promise<Paginated<RecipeSummary>> {
    const { items, total } = await this.repository.findMany(filters, viewerId);
    return {
      items: items.map(toRecipeSummary),
      total,
      limit: filters.limit,
      offset: filters.offset,
      hasMore: filters.offset + items.length < total,
    };
  }

  /**
   * Fetches one recipe by id or slug.
   *
   * Drafts and archived recipes are visible to their author only, so an
   * unlisted recipe cannot be read by anyone who guesses the URL.
   */
  async getOne(idOrSlug: string, viewerId?: string): Promise<RecipeDetail> {
    const recipe =
      (await this.repository.findBySlug(idOrSlug)) ?? (await this.repository.findById(idOrSlug));

    if (!recipe) throw new NotFoundError("Dit recept bestaat niet (meer)");

    if (recipe.status !== "active" && recipe.authorId !== viewerId) {
      // Same error as a missing recipe: do not confirm that it exists.
      throw new NotFoundError("Dit recept bestaat niet (meer)");
    }

    return toRecipeDetail(recipe);
  }

  /**
   * The same recipe, with every amount recalculated for a different number of
   * people. Uses the shared scaling engine, so the API and the browser can
   * never disagree about what "for 6" means.
   */
  async getScaled(idOrSlug: string, servings: number, viewerId?: string) {
    const recipe = await this.getOne(idOrSlug, viewerId);
    return {
      ...recipe,
      requestedServings: servings,
      scaledIngredients: scaleRecipe(recipe.ingredients, { from: recipe.servings, to: servings }),
    };
  }

  async create(input: unknown, authorId: string, imageFilename: string | null): Promise<RecipeDetail> {
    let data: RecipeInputParsed;
    try {
      data = recipeInputSchema.parse(input);
    } catch (error) {
      // The upload already landed on disk; do not leave it orphaned.
      await removeUpload(imageFilename);
      throw error;
    }

    try {
      const categories = await this.resolveCategories(data.categories);

      const recipe = await this.repository.create({
        title: data.title,
        slug: await this.uniqueSlug(data.title),
        description: data.description,
        tips: data.tips,
        sourceUrl: data.sourceUrl,
        image: imageFilename,
        status: data.status,
        servings: data.servings,
        preparationTime: data.preparationTime,
        cookTime: data.cookTime,
        totalTime: totalTimeOf(data),
        author: { connect: { id: authorId } },
        ingredients: { create: this.toIngredientRows(data) },
        steps: { create: data.approachSteps.map((step, index) => ({ content: step.content, position: index })) },
        categories: { create: categories.map((category) => ({ category: { connect: { id: category.id } } })) },
      });

      logger.info({ recipeId: recipe.id, authorId }, "Recipe created");
      return toRecipeDetail(recipe);
    } catch (error) {
      await removeUpload(imageFilename);
      throw error;
    }
  }

  async update(id: string, input: unknown, viewerId: string, imageFilename: string | null): Promise<RecipeDetail> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      await removeUpload(imageFilename);
      throw new NotFoundError("Dit recept bestaat niet (meer)");
    }
    if (existing.authorId !== viewerId) {
      await removeUpload(imageFilename);
      throw new ForbiddenError("Dit is niet jouw recept");
    }

    let data: RecipeInputParsed;
    try {
      data = recipeInputSchema.parse(input);
    } catch (error) {
      await removeUpload(imageFilename);
      throw error;
    }

    const categories = await this.resolveCategories(data.categories);

    const updateData: Prisma.RecipeUpdateInput = {
      title: data.title,
      description: data.description,
      tips: data.tips,
      sourceUrl: data.sourceUrl,
      status: data.status,
      servings: data.servings,
      preparationTime: data.preparationTime,
      cookTime: data.cookTime,
      totalTime: totalTimeOf(data),
      // Keep the current image when no new file was uploaded.
      ...(imageFilename ? { image: imageFilename } : {}),
      categories: {
        deleteMany: {},
        create: categories.map((category) => ({ category: { connect: { id: category.id } } })),
      },
    };

    const recipe = await this.repository.update(id, updateData, {
      ingredients: this.toIngredientRows(data).map((row) => ({ ...row, recipeId: id })),
      steps: data.approachSteps.map((step, index) => ({ content: step.content, position: index, recipeId: id })),
    });

    // Only now that the write succeeded is the old image safe to remove.
    if (imageFilename && existing.image && existing.image !== imageFilename) {
      await removeUpload(existing.image);
    }

    logger.info({ recipeId: id, viewerId }, "Recipe updated");
    return toRecipeDetail(recipe);
  }

  async delete(id: string, viewerId: string): Promise<void> {
    const recipe = await this.repository.findById(id);
    if (!recipe) throw new NotFoundError("Dit recept bestaat niet (meer)");
    if (recipe.authorId !== viewerId) throw new ForbiddenError("Dit is niet jouw recept");

    await this.repository.delete(id);
    await removeUpload(recipe.image);
    logger.info({ recipeId: id, viewerId }, "Recipe deleted");
  }

  listCategories() {
    return this.repository.listCategories();
  }

  private toIngredientRows(data: RecipeInputParsed) {
    return data.ingredients.map((ingredient, index) => ({
      name: ingredient.name,
      // Prisma accepts a plain number for Decimal columns.
      amount: ingredient.amount,
      unit: ingredient.unit,
      scalable: ingredient.scalable,
      note: ingredient.note,
      position: index,
    }));
  }

  private resolveCategories(titles: string[]) {
    const unique = new Map(titles.map((title) => [slugify(title), title.trim()]));
    return this.repository.upsertCategories(
      [...unique].map(([slug, title]) => ({ slug, title })),
    );
  }

  /** Appends a short suffix only when the plain slug is taken. */
  private async uniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    if (!(await this.repository.slugExists(base))) return base;

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const candidate = `${base}-${Math.random().toString(36).slice(2, 7)}`;
      if (!(await this.repository.slugExists(candidate))) return candidate;
    }
    return `${base}-${Date.now().toString(36)}`;
  }

  /** Exposed for tests. */
  toDetail(recipe: RecipeWithRelations): RecipeDetail {
    return toRecipeDetail(recipe);
  }
}

export const recipeService = new RecipeService();
