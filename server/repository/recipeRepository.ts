import { PrismaClient } from "@prisma/client";
import { RecipeFilters } from "../types/recipefilters";

export class RecipeRepository {
  private prisma = new PrismaClient();

  public async findByUserId(userId: string) {
    return await this.prisma.post.findMany({
      where: { userId },
      include: {
        categories: true,
        ingredients: true,
      },
    });
  }

  public async getFilteredRecipes(filters: RecipeFilters) {
    const {
      name,
      recents,
      populair,
      sortBy,
      sortOrder,
      limit,
      offset,
      category,
      maxTotalTime,
      servings,
    } = filters;

    const where: any = {};
    const orderBy: any = {};

    if (name) {
      where.title = { contains: name, mode: "insensitive" };
    }

    if (category) {
      where.categories = {
        some: { category: { contains: category, mode: "insensitive" } },
      };
    }

    if (maxTotalTime) {
      where.totalTime = { lte: maxTotalTime };
    }

    if (servings) {
      where.servings = { gte: servings };
    }

    if (recents) {
      orderBy.createdAt = "desc";
    } else if (sortBy) {
      orderBy[sortBy] = sortOrder || "asc";
    } else {
      orderBy.createdAt = "desc";
    }

    const recipes = await this.prisma.post.findMany({
      where,
      include: {
        categories: { select: { category: true } },
        ingredients: true,
        user: true,
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    return recipes;
  }
}
