import path from "node:path";
import cors from "cors";
import express, { type Express } from "express";
import session from "express-session";
import type { Store } from "express-session";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./core/env";
import { logger } from "./core/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { UPLOAD_DIR } from "./middleware/upload";
import passport from "./modules/auth/passport";
import authRoutes from "./modules/auth/auth.routes";
import recipeRoutes from "./modules/recipes/recipe.routes";

export interface AppOptions {
  /** Redis in production, the default in-memory store while developing. */
  sessionStore?: Store;
}

export function createApp({ sessionStore }: AppOptions = {}): Express {
  const app = express();

  // Behind a reverse proxy in production, so secure cookies and rate limiting
  // see the real client IP rather than the proxy's.
  if (env.isProduction) app.set("trust proxy", 1);

  app.use(
    helmet({
      // The API only serves JSON and images; the SPA is served separately.
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: env.isProduction ? undefined : false,
    }),
  );

  app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === "/health" } }));

  app.use(
    cors({
      origin: env.CLIENT_URL,
      // Sessions travel as cookies, so the browser needs explicit permission
      // to send them cross-origin.
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.use(
    session({
      name: "cookscorner.sid",
      store: sessionStore,
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.use(
    "/uploads",
    express.static(UPLOAD_DIR, {
      maxAge: env.isProduction ? "7d" : 0,
      // Uploads are user content: never let the browser guess a type.
      setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
      index: false,
      dotfiles: "deny",
    }),
  );

  app.use("/api/auth", authRoutes);
  app.use("/api", recipeRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const uploadsPath = path.resolve(UPLOAD_DIR);
