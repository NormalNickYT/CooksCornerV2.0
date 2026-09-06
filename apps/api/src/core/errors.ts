/**
 * Errors a route is allowed to throw.
 *
 * Anything that is not an `AppError` reaching the error handler is treated as
 * a bug: it gets logged in full and answered with a generic 500, so internal
 * details never leak to the client.
 */
export class AppError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
    Error.captureStackTrace?.(this, new.target);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Ongeldig verzoek", details?: unknown) {
    super(400, message, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Je moet ingelogd zijn") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Je hebt hier geen toegang toe") {
    super(403, message, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Niet gevonden") {
    super(404, message, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Dit bestaat al", details?: unknown) {
    super(409, message, "CONFLICT", details);
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message = "Bestand is te groot") {
    super(413, message, "PAYLOAD_TOO_LARGE");
  }
}
