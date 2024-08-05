export interface DisplayCategory {
  id: string;
  title: string;
}

export interface DisplayManualRecipe {
  title: string;
  status: string;
  categories: DisplayCategory[];
  image: string;
}
