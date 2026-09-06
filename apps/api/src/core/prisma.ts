import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { logger } from "./logger";

/**
 * One client for the whole process.
 *
 * The previous code constructed `new PrismaClient()` in four different files,
 * which opens four connection pools against the same database.
 */
export const prisma = new PrismaClient({
  log: env.isProduction ? ["warn", "error"] : ["warn", "error"],
});

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  logger.debug("Prisma disconnected");
}

export default prisma;
