import { PrismaClient } from "@prisma/client";
import { RecipeFilters } from "../types/recipefilters";
import { RecipeRepository } from "../repository/recipeRepository";

const prisma = new PrismaClient();

export class RecipeService {
  private recipeRepository = new RecipeRepository();

  public async getFilteredRecipes(filters: RecipeFilters) {
    return await this.recipeRepository.getFilteredRecipes(filters);
  }

  public async getRecipesByUserId(userId: string) {
    return await this.recipeRepository.findByUserId(userId);
  }
}
