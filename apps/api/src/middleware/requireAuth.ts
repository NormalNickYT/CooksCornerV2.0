import type { RequestHandler } from "express";
import { UnauthorizedError } from "../core/errors";

/** Rejects the request unless Passport put a user on it. */
export const requireAuth: RequestHandler = (req, _res, next) => {
  if (req.isAuthenticated?.() && req.user) {
    next();
    return;
  }
  next(new UnauthorizedError());
};

/**
 * Attaches the user when there is one, but lets anonymous visitors through.
 * Used by the public recipe list so it can mark a reader's own favourites.
 */
export const optionalAuth: RequestHandler = (_req, _res, next) => next();
