import {
  manualRecipeSchema,
  ManualRecipe,
  urlRecipeSchema,
  URLRecipe,
} from "@/schemas/Recipe";
import axios from "axios";

// const BASE_URL = process.env.BASE_URL;

export const getUserRecipes = async () => {
  try {
    const response = await axios.get(`/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createManualRecipe = async (data: ManualRecipe) => {
  try {
    manualRecipeSchema.parse(data);

    console.log("Dit is de data: ", data);
    const response = await axios.post(`/recipes/api/createRecipe`, data);
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
