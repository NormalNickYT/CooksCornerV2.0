export interface DisplayCategory {
  id: string;
  title: string;
}

export interface CategoryResponse {
  category: DisplayCategory;
}

export interface DisplayUser {
  id: string;
  username: string;
}

export interface DisplayManualRecipe {
  id: string;
  title: string;
  status: string;
  categories: CategoryResponse[];
  image: string;
  user: DisplayUser;
  preparationTime: number;
  totalTime: number;
  createdAt : string;
}
