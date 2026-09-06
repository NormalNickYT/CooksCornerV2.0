import { Request, Response, NextFunction } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return next();
  } else {
    res.status(401).send("Not Authorized");
  }
};
