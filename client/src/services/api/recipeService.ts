import {
  manualRecipeSchema,
  ManualRecipe,
  urlRecipeSchema,
  URLRecipe,
} from "@/schemas/Recipe";
import axios from "axios";

export const getUserRecipes = async () => {
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

export const createManualRecipe = async (data: ManualRecipe) => {
  try {
    manualRecipeSchema.parse(data);

    const formData = new FormData();

    if (data.image) {
      formData.append("image", data.image);
    }

    console.log(data);
    console.log(data.image);

    const documentJson = {
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      approach: data.approach,
      preparationTime: data.preparationTime,
      tips: data.tips,
      status: data.status,
      categories: data.categories,
      userId: data.userId,
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
