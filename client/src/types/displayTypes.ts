export interface DisplayCategory {
  id: string;
  title: string;
}

export interface DisplayManualRecipe {
  id: string;
  title: string;
  status: string;
  categories: DisplayCategory[];
  image: string;
}
