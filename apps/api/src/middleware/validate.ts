import type { Request, RequestHandler } from "express";
import type { ZodSchema } from "zod";

type Source = "body" | "query" | "params";

/**
 * Parses part of the request with a Zod schema and stores the typed result on
 * `req.validated`, so handlers work with coerced, defaulted values instead of
 * raw query strings.
 *
 * The parsed value is also written back onto `req.body` / `req.params`, but
 * never onto `req.query`: Express 5 exposes that as a getter-only property.
 *
 * Failures throw a ZodError, which the error handler renders as a single 400
 * listing every bad field at once.
 */
export function validate<T>(schema: ZodSchema<T>, source: Source = "body"): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(result.error);
      return;
    }

    req.validated = { ...req.validated, [source]: result.data };
    if (source !== "query") {
      req[source] = result.data as never;
    }
    next();
  };
}

/** Read back what `validate` parsed for a given part of the request. */
export function validated<T>(req: Request, source: Source = "body"): T {
  return req.validated?.[source] as T;
}
