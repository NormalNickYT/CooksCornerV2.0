import type { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    /** Passport deserialises a full database user onto every request. */
    interface User extends PrismaUser {}

    interface Request {
      /** Values parsed by the `validate` middleware, keyed by request part. */
      validated?: Partial<Record<"body" | "query" | "params", unknown>>;
    }
  }
}

export {};
