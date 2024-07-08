import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { isLoggedIn } from "../middleware/authMiddleware";

const prisma = new PrismaClient();
const router = Router();

// Get all user posts
router.get("/recipes", isLoggedIn, async (req: Request, res: Response) => {
  const postList = await prisma.post.findMany();
  res.json(postList);
});

// Get all specific user posts based on id
router.get("/userRecipes", isLoggedIn, async (req: Request, res: Response) => {
  const userPosts = await prisma.post.findMany();
  res.json(userPosts);
});

// Create Post
router.post(
  "/createRecipe",
  isLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const recipe = req.body;
      const newPost = await prisma.post.create({
        data: recipe,
      });
      res.json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Modify a post

export default router;
