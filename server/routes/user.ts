import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/post", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
