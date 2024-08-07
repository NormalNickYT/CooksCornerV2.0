import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserRecipes } from '@/services/api/recipeService';
import { DisplayManualRecipe } from '@/types/displayTypes';

interface RecipeContextType {
  recipes: DisplayManualRecipe[];
  setRecipes: React.Dispatch<React.SetStateAction<DisplayManualRecipe[]>>;
  fetchRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  setRecipes: () => {},
  fetchRecipes: async () => {},
});

export const useRecipes = () => {
  return useContext(RecipeContext);
};

const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<DisplayManualRecipe[]>([]);

  const fetchRecipes = async () => {
    try {
      const result = await getUserRecipes();
      setRecipes(result);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [recipes]);

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes, fetchRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
