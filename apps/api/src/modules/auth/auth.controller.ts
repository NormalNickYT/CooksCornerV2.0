import type { NextFunction, Request, Response } from "express";
import type { User } from "@prisma/client";
import { loginSchema, registerSchema } from "@cookscorner/shared";
import passport from "passport";
import { UnauthorizedError } from "../../core/errors";
import { logger } from "../../core/logger";
import { validated } from "../../middleware/validate";
import { authService, toPublicUser } from "./auth.service";

/**
 * Establishes the session after a successful sign-in.
 *
 * `req.logIn` is callback-based, and the session has to be regenerated first:
 * reusing the pre-login session id lets an attacker who planted a cookie ride
 * along on the victim's new session (session fixation).
 */
function establishSession(req: Request, user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        reject(regenerateError);
        return;
      }

      req.logIn(user, (loginError) => {
        if (loginError) {
          reject(loginError);
          return;
        }
        req.session.save((saveError) => (saveError ? reject(saveError) : resolve()));
      });
    });
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const input = validated<ReturnType<typeof registerSchema.parse>>(req);
  const user = await authService.register(input);
  await establishSession(req, user);
  res.status(201).json(toPublicUser(user));
}

export function login(req: Request, res: Response, next: NextFunction): void {
  // Custom callback so failures come back as JSON instead of a redirect.
  passport.authenticate("local", (error: unknown, user: User | false, info: { message?: string } | undefined) => {
    if (error) {
      next(error);
      return;
    }
    if (!user) {
      next(new UnauthorizedError(info?.message ?? "E-mailadres of wachtwoord klopt niet"));
      return;
    }

    establishSession(req, user)
      .then(() => res.json(toPublicUser(user)))
      .catch(next);
  })(req, res, next);
}

export function me(req: Request, res: Response): void {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  res.json(toPublicUser(req.user));
}

/**
 * Signs out properly.
 *
 * The previous version only cleared the cookie, which left the session valid
 * server-side: anyone who had captured that cookie stayed logged in forever.
 */
export function logout(req: Request, res: Response, next: NextFunction): void {
  const userId = req.user?.id;

  req.logOut({ keepSessionInfo: false }, (logoutError) => {
    if (logoutError) {
      next(logoutError);
      return;
    }

    req.session.destroy((destroyError) => {
      if (destroyError) {
        next(destroyError);
        return;
      }
      res.clearCookie("cookscorner.sid");
      logger.info({ userId }, "User signed out");
      res.status(204).send();
    });
  });
}

/** Sanity-checked so `?redirect=https://evil.example` cannot be used as an open redirect. */
export function safeRedirect(target: string | undefined, base: string): string {
  if (!target) return base;
  try {
    const url = new URL(target, base);
    return url.origin === new URL(base).origin ? url.toString() : base;
  } catch {
    return base;
  }
}

export const authSchemas = { registerSchema, loginSchema };
