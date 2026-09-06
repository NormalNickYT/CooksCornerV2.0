import pino from "pino";
import { env } from "./env";

/**
 * Structured logs in production, readable ones while developing.
 * Never log a request body: recipe uploads carry session cookies and, during
 * registration, plaintext passwords.
 */
export const logger = pino({
  level: env.isProduction ? "info" : env.isTest ? "silent" : "debug",
  transport: env.isProduction
    ? undefined
    : { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" } },
  redact: {
    paths: ["req.headers.cookie", "req.headers.authorization", "password", "*.password", "passwordHash"],
    remove: true,
  },
});
