import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RecipeFilters {
  name?: string;
  recents?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export async function getFilteredRecipes(filters: RecipeFilters) {
  const { name, recents, sortBy, sortOrder, limit = 3, offset = 0 } = filters;

  const where: any = {};

  if (name) {
    where.title = { contains: name, mode: "insensitive" };
  }

  if (recents) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    where.createdAt = { gte: thirtyDaysAgo };
  }

  const orderBy: any = {};

  if (sortBy) {
    orderBy[sortBy] = sortOrder || "asc";
  } else {
    orderBy.title = "asc";
  }

  const recipes = await prisma.post.findMany({
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
