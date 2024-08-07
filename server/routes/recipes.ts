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
    try {
      const postList = await prisma.post.findMany({
        include: {
          categories: true,
          ingredients: true,
        },
      });
      res.json(postList);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get all specific user posts based on id
router.get(
  "/api/recipes/userrecipes",
  isLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const postList = await prisma.post.findMany({
        include: {
          categories: true,
          ingredients: true,
        },
      });
      res.json(postList);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Create a recipe post
router.post(
  "/api/recipes/createrecipe",
  isLoggedIn,
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
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

      const image = req.file?.filename || "";

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

// Delete a recipe post based on id
router.delete(
  "/api/recipes/delete/:id",
  isLoggedIn,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const post = await prisma.post.findUnique({
        where: { id: id },
      });

      if (!post) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      console.log(" post userid " + post.userId + " " + req.user.id);

      if (post.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Forbidden: You are not the owner of this recipe" });
      }

      await prisma.post.delete({ where: { id: id } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
