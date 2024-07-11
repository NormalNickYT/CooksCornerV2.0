import { z } from "zod";

const postSchema = z.object({
  title: z.string(),
  userId: z.string(),
  url: z.string().nullable(),
  image: z.string(),
  description: z.string().nullable(),
  ingredients: z.array(z.string()),
  approach: z.string().nullable(),
  preperationTime: z.date().nullable(),
  tips: z.string().nullable(),
  categories: z.array(z.string()),
});

export default postSchema;
