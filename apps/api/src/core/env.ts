import { config } from "dotenv";
import path from "node:path";
import { z } from "zod";

// The repo keeps one .env at the root so the API and the web app cannot drift
// apart on things like the client URL.
config({ path: path.resolve(import.meta.dirname, "../../../../.env") });

/**
 * Configuration is validated once, at boot.
 *
 * A missing SESSION_SECRET should stop the process immediately with a clear
 * message, not surface three hours later as sessions that silently never
 * persist.
 */
const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5000),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required. Did you copy .env.example to .env?"),

    SESSION_SECRET: z
      .string()
      .min(32, "SESSION_SECRET must be at least 32 characters. Generate one: openssl rand -hex 32"),
    REDIS_URL: z.string().optional(),

    API_URL: z.string().url().default("http://localhost:5000"),
    CLIENT_URL: z.string().url().default("http://localhost:5173"),

    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CALLBACK_URL: z.string().optional(),

    MAX_UPLOAD_MB: z.coerce.number().positive().max(50).default(8),
  })
  .transform((raw) => ({
    ...raw,
    isProduction: raw.NODE_ENV === "production",
    isTest: raw.NODE_ENV === "test",
    /**
     * Google login is optional. Without credentials the app still runs and
     * email/password sign-in keeps working; only the Google button disappears.
     */
    googleEnabled: Boolean(raw.GOOGLE_CLIENT_ID && raw.GOOGLE_CLIENT_SECRET && raw.GOOGLE_CALLBACK_URL),
  }));

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`);
  console.error(`\nInvalid environment configuration:\n${issues.join("\n")}\n`);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
