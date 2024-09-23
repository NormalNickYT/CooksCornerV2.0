import {
  manualRecipeSchema,
  ManualRecipe,
  urlRecipeSchema,
  URLRecipe,
} from "@/schemas/Recipe";
import axios from "axios";
import {RecipeFilters} from "@/types/RecipeFilters";

export const getAllUsersRecipes = async () => {
  try {
    const response = await axios.get(`/api/recipes/userrecipes`);
    const data = response.data;

    return data.map((recipe: ManualRecipe) => ({
      ...recipe,
      image: `/uploads/${recipe.image}`,
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

export const getRecentRecipes = async (limit : number) => {
  try {
    const response = await axios.get(`/api/recipes/userrecipes`, {
      params: {
        recents: true,
        limit: limit,
      },
    });
    const data = response.data;

    return data.map((recipe: ManualRecipe) => ({
      ...recipe,
      image: `/uploads/${recipe.image}`,
    }));
  } catch (error) {
    console.error("Error fetching recent recipes:", error);
    throw error;
  }
};

export const getUserRecipes = async (userId: number) => {
  try {
    const response = await axios.get(`/api/recipes/user/${userId}`);
    const data = response.data;

    return data.map((recipe: ManualRecipe) => ({
      ...recipe,
      image: `/uploads/${recipe.image}`,
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

export const getFilteredRecipes = async (filters: RecipeFilters) => { 
  // TODO: Filter validation 
  try {
    const response = await axios.get(`/api/recipes/userrecipes`, {
      params: filters,
    });

    const data = response.data;

    return data.map((recipe: ManualRecipe) => ({
      ...recipe,
      image: `/uploads/${recipe.image}`,
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}

export const createManualRecipe = async (data: ManualRecipe) => {
  try {
    manualRecipeSchema.parse(data);

    const formData = new FormData();

    if (data.image) {
      formData.append("image", data.image);
    }

    const documentJson = {
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      approachSteps: data.approachSteps,
      preparationTime: data.preparationTime,
      tips: data.tips,
      status: data.status,
      categories: data.categories,
      userId: data.userId,
      cookTime: data.cookTime,
      servings: data.servings,
      totalTime: data.totalTime,
    };

    formData.append("document", JSON.stringify(documentJson));

    const response = await axios.post(`/api/recipes/createrecipe`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

export const deleteRecipe = async (recipeId: string) => {
  try {
    await axios.delete(`/api/recipes/delete/${recipeId}`, {
      withCredentials: true,
    });
    console.log("Recipe deleted successfully");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

export const createURLRecipe = async (data: URLRecipe) => {
  try {
    urlRecipeSchema.parse(data);
    const response = await axios.post(`/api/createRecipe`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};
