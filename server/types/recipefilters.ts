export interface RecipeFilters {
  name?: string;
  recents?: boolean;
  sortBy?: "createdAt" | "title" | "totalTime";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  category?: string; // Filter op categorie
  maxTotalTime?: number; // Filter op maximale totale tijd
  servings?: number; // Filter op aantal porties
}
