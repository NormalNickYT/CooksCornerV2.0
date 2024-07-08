interface Post {
  id: number;
  name: string;
  category: string;
  url: string;
  image: string;
  description: string;
  ingredients: string[];
  approach: string;
  // Hier naar kijken
  preperationTime: number;
  createdAt: number;

  tips: string;
}

export default Post;
