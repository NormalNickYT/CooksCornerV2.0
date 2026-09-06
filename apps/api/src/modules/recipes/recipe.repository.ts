import type { Prisma } from "@prisma/client";
import type { RecipeFilters } from "@cookscorner/shared";
import { prisma } from "../../core/prisma";
import { recipeInclude, type RecipeWithRelations } from "./recipe.mapper";

/**
 * Every recipe query lives here. Nothing above this layer touches Prisma, so
 * the filter translation exists exactly once.
 */
export class RecipeRepository {
  findById(id: string): Promise<RecipeWithRelations | null> {
    return prisma.recipe.findUnique({ where: { id }, include: recipeInclude });
  }

  /** Recipes are addressable by slug so URLs stay readable. */
  findBySlug(slug: string): Promise<RecipeWithRelations | null> {
    return prisma.recipe.findUnique({ where: { slug }, include: recipeInclude });
  }

  slugExists(slug: string): Promise<boolean> {
    return prisma.recipe.findUnique({ where: { slug }, select: { id: true } }).then(Boolean);
  }

  /**
   * Builds the `where` clause from validated filters.
   *
   * The category filter is the one that used to be broken: it ran `contains`
   * against a relation, which Prisma rejects. Matching goes through the join
   * table and compares the category's slug.
   */
  private buildWhere(filters: RecipeFilters, viewerId?: string): Prisma.RecipeWhereInput {
    const where: Prisma.RecipeWhereInput = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.category) {
      where.categories = { some: { category: { slug: filters.category.toLowerCase() } } };
    }

    if (filters.maxTotalTime) where.totalTime = { lte: filters.maxTotalTime };
    if (filters.servings) where.servings = { gte: filters.servings };
    if (filters.authorId) where.authorId = filters.authorId;

    if (filters.status) {
      where.status = filters.status;
    } else if (filters.authorId && filters.authorId === viewerId) {
      // Authors see their own drafts; everyone else sees published work only.
      where.status = undefined;
    } else {
      where.status = "active";
    }

    return where;
  }

  /** One round trip for the page, one for the count, so the client can paginate. */
  async findMany(
    filters: RecipeFilters,
    viewerId?: string,
  ): Promise<{ items: RecipeWithRelations[]; total: number }> {
    const where = this.buildWhere(filters, viewerId);
    const orderBy = { [filters.sortBy]: filters.sortOrder } as Prisma.RecipeOrderByWithRelationInput;

    const [items, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: recipeInclude,
        orderBy,
        take: filters.limit,
        skip: filters.offset,
      }),
      prisma.recipe.count({ where }),
    ]);

    return { items, total };
  }

  create(data: Prisma.RecipeCreateInput): Promise<RecipeWithRelations> {
    return prisma.recipe.create({ data, include: recipeInclude });
  }

  /**
   * Replaces a recipe and its children in one transaction.
   *
   * Ingredients and steps are deleted and recreated rather than diffed:
   * positions shift when a line is removed, and a partial update that fails
   * halfway would leave a recipe with somebody else's quantities in it.
   */
  update(id: string, data: Prisma.RecipeUpdateInput, children?: {
    ingredients: Prisma.IngredientCreateManyInput[];
    steps: Prisma.StepCreateManyInput[];
  }): Promise<RecipeWithRelations> {
    return prisma.$transaction(async (tx) => {
      if (children) {
        await tx.ingredient.deleteMany({ where: { recipeId: id } });
        await tx.step.deleteMany({ where: { recipeId: id } });
        await tx.ingredient.createMany({ data: children.ingredients });
        await tx.step.createMany({ data: children.steps });
      }
      return tx.recipe.update({ where: { id }, data, include: recipeInclude });
    });
  }

  /** Children go with it: the schema cascades on delete. */
  async delete(id: string): Promise<void> {
    await prisma.recipe.delete({ where: { id } });
  }

  async findAuthorId(id: string): Promise<string | null> {
    const row = await prisma.recipe.findUnique({ where: { id }, select: { authorId: true } });
    return row?.authorId ?? null;
  }

  /** Creates any category that does not exist yet and returns them all. */
  async upsertCategories(entries: Array<{ title: string; slug: string }>): Promise<{ id: string }[]> {
    return Promise.all(
      entries.map((entry) =>
        prisma.category.upsert({
          where: { slug: entry.slug },
          update: {},
          create: { slug: entry.slug, title: entry.title },
          select: { id: true },
        }),
      ),
    );
  }

  listCategories() {
    return prisma.category.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        _count: { select: { recipes: true } },
      },
    });
  }
}

export const recipeRepository = new RecipeRepository();
