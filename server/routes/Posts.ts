import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const postList = await prisma.post.findMany();
  res.json(postList);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const post = req.body;
    const newPost = await prisma.post.create({
      data: post,
    });
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
