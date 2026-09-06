import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import type { Store } from "express-session";
import { createApp } from "./app";
import { env } from "./core/env";
import { logger } from "./core/logger";
import { disconnectPrisma, prisma } from "./core/prisma";

/**
 * Sessions live in Redis when a URL is configured.
 *
 * Without a store, express-session keeps them in memory: fine for one dev
 * process, but they vanish on restart and cannot be shared across instances.
 * A configured-but-unreachable Redis is a hard failure rather than a silent
 * fallback, so a broken production deploy is loud.
 */
async function createSessionStore(): Promise<Store | undefined> {
  if (!env.REDIS_URL) {
    logger.warn("REDIS_URL not set: sessions are stored in memory and will be lost on restart");
    return undefined;
  }

  const client = createClient({
    url: env.REDIS_URL,
    socket: {
      connectTimeout: 3000,
      // Bounded retries. The default strategy retries forever, so an absent
      // Redis meant the process never finished booting at all.
      reconnectStrategy: (retries) => (retries > 2 ? false : 200 * (retries + 1)),
    },
  });

  // Registered before connect so a refused connection is handled, not thrown.
  client.on("error", (error: Error) => logger.debug({ err: error }, "Redis connection error"));

  try {
    await client.connect();
    logger.info("Connected to Redis");
    return new RedisStore({ client, prefix: "cookscorner:sess:" });
  } catch (error) {
    // In production a configured Redis that will not connect is fatal.
    if (env.isProduction) throw error;

    // Locally, carry on without it. Destroy the client first, or its retry
    // loop keeps the event loop alive and spams the log.
    // node-redis v4 exposes disconnect(), not destroy().
    await client.disconnect().catch(() => undefined);
    logger.warn("Redis unavailable at " + env.REDIS_URL + ", using in-memory sessions instead");
    return undefined;
  }
}

async function main(): Promise<void> {
  // Fail fast on a bad DATABASE_URL rather than on the first request.
  await prisma.$queryRaw`SELECT 1`;
  logger.info("Connected to the database");

  const app = createApp({ sessionStore: await createSessionStore() });

  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on ${env.API_URL} (${env.NODE_ENV})`);
  });

  // Finish in-flight requests before exiting, so a deploy does not drop them.
  const shutdown = (signal: string) => {
    logger.info({ signal }, "Shutting down");
    server.close(async () => {
      await disconnectPrisma();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((error) => {
  logger.error({ err: error }, "Failed to start the API");
  process.exit(1);
});
