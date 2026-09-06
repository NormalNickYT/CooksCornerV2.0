import type { ErrorRequestHandler, RequestHandler } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../core/errors";
import { env } from "../core/env";
import { logger } from "../core/logger";

/** Every unmatched route ends here rather than hanging. */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: `Geen route voor ${req.method} ${req.path}` } });
};

/**
 * Turns anything thrown in a route into one consistent JSON shape:
 *   { error: { code, message, details? } }
 *
 * Express 5 forwards rejected promises here automatically, so routes can be
 * plain `async` functions with no wrapper.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "De ingevulde gegevens kloppen niet",
        details: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      },
    });
    return;
  }

  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? `Afbeelding is groter dan ${env.MAX_UPLOAD_MB} MB` : "Uploaden is mislukt";
    res.status(413).json({ error: { code: err.code, message } });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = unique constraint. Report which field, never the raw SQL.
    if (err.code === "P2002") {
      const fields = (err.meta?.target as string[] | undefined)?.join(", ") ?? "veld";
      res.status(409).json({ error: { code: "CONFLICT", message: `Deze ${fields} is al in gebruik` } });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Niet gevonden" } });
      return;
    }
  }

  // Anything reaching this point is a bug. Log it fully, answer vaguely.
  logger.error({ err }, "Unhandled error");
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Er ging iets mis aan onze kant",
      ...(env.isProduction ? {} : { details: err instanceof Error ? err.message : String(err) }),
    },
  });
};
