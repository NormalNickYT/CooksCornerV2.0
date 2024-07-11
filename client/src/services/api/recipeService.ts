import axios from "axios";

const BASE_URL = process.env.BASE_URL;

export const getUserRecipes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createRecipe = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/createRecipe`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
