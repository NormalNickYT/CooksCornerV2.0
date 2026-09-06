import type { RecipeInputParsed } from "@cookscorner/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recipeApi, type RecipeListParams } from "./recipe.api";

const keys = {
  all: ["recipes"] as const,
  list: (params: RecipeListParams) => ["recipes", "list", params] as const,
  mine: (params: RecipeListParams) => ["recipes", "mine", params] as const,
  detail: (idOrSlug: string) => ["recipes", "detail", idOrSlug] as const,
  categories: ["categories"] as const,
};

export function useRecipeList(params: RecipeListParams = {}) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => recipeApi.list(params),
    // Keeps the previous page on screen while the next one loads, instead of
    // collapsing the grid to a spinner on every filter change.
    placeholderData: (previous) => previous,
  });
}

export function useMyRecipes(params: RecipeListParams = {}) {
  return useQuery({
    queryKey: keys.mine(params),
    queryFn: () => recipeApi.mine(params),
    placeholderData: (previous) => previous,
  });
}

export function useRecipe(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: keys.detail(idOrSlug ?? ""),
    queryFn: () => recipeApi.byId(idOrSlug!),
    enabled: Boolean(idOrSlug),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: keys.categories,
    queryFn: recipeApi.categories,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, image }: { input: RecipeInputParsed; image: File | null }) =>
      recipeApi.create(input, image),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input, image }: { id: string; input: RecipeInputParsed; image: File | null }) =>
      recipeApi.update(id, input, image),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipeApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
  });
}
