import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { isLoggedIn } from "../middleware/authMiddleware";
import upload from "../middleware/multerStorage";

const prisma = new PrismaClient();
const router = Router();

// Get all user posts
router.get(
  "/api/recipes/allrecipes",
  isLoggedIn,
  async (req: Request, res: Response) => {
    const postList = await prisma.post.findMany();
    res.json(postList);
  }
);

// Get all specific user posts based on id
router.get(
  "/api/recipes/userRecipes",
  isLoggedIn,
  async (req: Request, res: Response) => {
    const userPosts = await prisma.post.findMany();
    res.json(userPosts);
  }
);

// Create Post
router.post(
  "/api/recipes/createrecipe",
  isLoggedIn,
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("testing");
    console.log(req.body);
    try {
      const { document } = req.body;
      const parsedDocument = JSON.parse(document);

      const {
        title,
        description,
        ingredients,
        approach,
        preparationTime,
        tips,
        status,
        categories,
        userId,
      } = parsedDocument;

      const image = req.file?.path || "";

      const newPost = await prisma.post.create({
        data: {
          title,
          image,
          user: {
            connect: { id: userId },
          },
          description,
          ingredients: {
            create: ingredients.map((ingredient: any) => ({
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
            })),
          },
          approach,
          preparationTime: preparationTime,
          tips,
          status,
          categories: {
            connectOrCreate: categories.map((category: any) => ({
              where: { title: category },
              create: { title: category }, 
            })),
          },
        },
      });

      res.json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
