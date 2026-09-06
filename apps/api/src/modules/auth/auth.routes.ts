import { Router } from "express";
import rateLimit from "express-rate-limit";
import { loginSchema, registerSchema } from "@cookscorner/shared";
import passport from "passport";
import { env } from "../../core/env";
import { NotFoundError } from "../../core/errors";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import { login, logout, me, register, safeRedirect } from "./auth.controller";

const router = Router();

/**
 * Credential endpoints are rate limited per IP.
 *
 * Without this, the login route is an open password-guessing oracle: the
 * bcrypt comparison is deliberately slow, but not slow enough to matter when
 * an attacker can fire thousands of attempts a minute.
 */
const credentialsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.isProduction ? 10 : 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Te veel pogingen. Probeer het over 15 minuten opnieuw." } },
});

router.post("/register", credentialsLimiter, validate(registerSchema), register);
router.post("/login", credentialsLimiter, validate(loginSchema), login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);

/** Lets the sign-in page hide the Google button when it is not configured. */
router.get("/providers", (_req, res) => {
  res.json({ password: true, google: env.googleEnabled });
});

router.get("/google", (req, res, next) => {
  if (!env.googleEnabled) {
    next(new NotFoundError("Google-login is niet geconfigureerd"));
    return;
  }
  passport.authenticate("google", { scope: ["email", "profile"] })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    if (!env.googleEnabled) {
      next(new NotFoundError("Google-login is niet geconfigureerd"));
      return;
    }
    passport.authenticate("google", {
      failureRedirect: `${env.CLIENT_URL}/login?error=google`,
    })(req, res, next);
  },
  (_req, res) => {
    // Browser flow, so this one redirects rather than returning JSON.
    res.redirect(safeRedirect(`${env.CLIENT_URL}/dashboard`, env.CLIENT_URL));
  },
);

export default router;
