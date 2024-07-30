import express, { Request, Response, Router } from "express";
import passport, { session } from "passport";
import prisma from "../prisma/prisma";
import { isLoggedIn } from "../middleware/authMiddleware";

const router = Router();
const clientUrl =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;

router.get(
  "/api/user",
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req.user as any).id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...rest } = user;
      res.status(200).json(rest);
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/api/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${clientUrl}/login`,
  }),
  (req: Request, res: Response) => {
    try {
      res.redirect(`${clientUrl}/dashboard?tab=dash`);
    } catch (error) {
      console.error("Error during Google OAuth callback:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/api/logout",
  isLoggedIn,
  (req: express.Request, res: express.Response, next) => {
    try {
      res
        .clearCookie("connect.sid")
        .status(200)
        .json("User has been signed out");
    } catch (error) {
      next(error);
    }
  }
);
export default router;
