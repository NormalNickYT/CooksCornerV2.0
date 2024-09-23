export type RecipeFilters = {
    name?: string;
    recents?: boolean;
    populair?: boolean;
    sortBy?: "createdAt" | "title" | "totalTime";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
    category?: string;
    maxTotalTime?: number;
    servings?: number;
  };
  