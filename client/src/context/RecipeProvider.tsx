import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  getAllUsersRecipes,
  getUserRecipes,
} from "@/services/api/recipeService";
import { DisplayManualRecipe } from "@/types/displayTypes";
import { useAuth } from "./AuthProvider";

interface RecipeContextType {
  recipes: DisplayManualRecipe[];
  userRecipes: DisplayManualRecipe[];
  setRecipes: React.Dispatch<React.SetStateAction<DisplayManualRecipe[]>>;
  fetchAllUsersRecipes: () => Promise<void>;
  fetchUserRecipes: (userId: number) => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  userRecipes: [],
  setRecipes: () => {},
  fetchAllUsersRecipes: async () => {},
  fetchUserRecipes: async () => {},
});

export const useRecipes = () => {
  return useContext(RecipeContext);
};

const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<DisplayManualRecipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<DisplayManualRecipe[]>([]);

  const fetchAllUsersRecipes = async () => {
    try {
      const result = await getAllUsersRecipes();
      setRecipes(result);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchUserRecipes = async (userId: number) => {
    try {
      const result = await getUserRecipes(userId);
      setUserRecipes(result);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        userRecipes,
        setRecipes,
        fetchAllUsersRecipes,
        fetchUserRecipes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
