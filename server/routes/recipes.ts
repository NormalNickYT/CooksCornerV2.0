import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { isLoggedIn } from "../middleware/authMiddleware";
import upload from "../middleware/multerStorage";
import { getFilteredRecipes } from "../services/recipeServices";

const prisma = new PrismaClient();
const router = Router();

// Get specific users recipes based on id
router.get(
  "/api/recipes/user/:id",
  isLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const recipes = await prisma.post.findMany({
        where: {
          userId: userId,
        },
        include: {
          categories: {
            select: {
              category: true,
            },
          },
          ingredients: true,
        },
      });

      res.json(recipes);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Error fetching posts:" });
    }
  }
);

router.get("/api/recipes/userrecipes", async (req: Request, res: Response) => {
  try {
    const filters = {
      name: req.query.name as string,
      recents: req.query.recents === "true" ? true : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
      limit: parseInt(req.query.limit as string) || 4,
      offset: parseInt(req.query.offset as string) || 0,
    };

    const recipes = await getFilteredRecipes(filters);

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
        approachSteps,
        preparationTime,
        tips,
        status,
        categories,
        userId,
        servings,
        cookTime,
        totalTime,
      } = parsedDocument;

      const categoryPromises = categories.map((category: string) =>
        prisma.category.upsert({
          where: { title: category },
          update: {},
          create: { title: category },
        })
      );

      const createdCategories = await Promise.all(categoryPromises);
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
          approachSteps: {
            create: approachSteps.map((step: any, index: number) => ({
              content: step.content,
              order: index + 1,
            })),
          },
          preparationTime: preparationTime,
          tips,
          status,
          servings,
          cookTime,
          totalTime,
          categories: {
            create: createdCategories.map((category) => ({
              category: { connect: { id: category.id } },
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
