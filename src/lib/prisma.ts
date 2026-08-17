import { PrismaClient } from "@prisma/client";

// Standard Next.js dev-mode singleton so hot-reloading doesn't
// spin up a new PrismaClient (and a new connection pool) on every save.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
