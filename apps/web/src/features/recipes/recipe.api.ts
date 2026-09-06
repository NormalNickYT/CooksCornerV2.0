import type {
  Paginated,
  RecipeDetail,
  RecipeInputParsed,
  RecipeSummary,
} from "@cookscorner/shared";
import { api } from "@/lib/api";

export interface RecipeListParams {
  search?: string;
  category?: string;
  maxTotalTime?: number;
  servings?: number;
  sortBy?: "createdAt" | "title" | "totalTime" | "preparationTime";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface CategorySummary {
  id: string;
  slug: string;
  title: string;
  recipeCount: number;
}

/**
 * A recipe goes over the wire as multipart: the image as a file part and the
 * rest as one JSON string, because form fields cannot express the nested
 * ingredient and step arrays.
 */
function toFormData(input: RecipeInputParsed, image: File | null): FormData {
  const formData = new FormData();
  formData.append("data", JSON.stringify(input));
  if (image) formData.append("image", image);
  return formData;
}

export const recipeApi = {
  async list(params: RecipeListParams = {}): Promise<Paginated<RecipeSummary>> {
    const { data } = await api.get<Paginated<RecipeSummary>>("/recipes", { params });
    return data;
  },

  async mine(params: RecipeListParams = {}): Promise<Paginated<RecipeSummary>> {
    const { data } = await api.get<Paginated<RecipeSummary>>("/recipes/mine", { params });
    return data;
  },

  async byId(idOrSlug: string): Promise<RecipeDetail> {
    const { data } = await api.get<RecipeDetail>(`/recipes/${idOrSlug}`);
    return data;
  },

  async create(input: RecipeInputParsed, image: File | null): Promise<RecipeDetail> {
    const { data } = await api.post<RecipeDetail>("/recipes", toFormData(input, image));
    return data;
  },

  async update(id: string, input: RecipeInputParsed, image: File | null): Promise<RecipeDetail> {
    const { data } = await api.put<RecipeDetail>(`/recipes/${id}`, toFormData(input, image));
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },

  async categories(): Promise<CategorySummary[]> {
    const { data } = await api.get<CategorySummary[]>("/categories");
    return data;
  },
};
