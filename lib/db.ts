import { PrismaClient } from "@prisma/client";
import { createPrismaAdapter } from "@/lib/prisma-adapter";

// Driven2Develop runs on Prisma's engine-less "client" generator + driver adapters
// (see prisma/schema.prisma `engineType = "client"`). This means no native
// Rust query-engine binary is ever downloaded - useful for restricted-network
// builds and for fast, portable serverless deploys.
//
// Locally (SQLite): DATABASE_URL="file:./dev.db" -> PrismaBetterSQLite3.
// In production (Postgres): DATABASE_URL="postgresql://..." -> PrismaPg.
// Adapter selection lives in lib/prisma-adapter.ts, shared with the seed
// script and the Prisma CLI config so they can't drift out of sync.
//
// IMPORTANT: the generated client's SQL dialect is baked in at `prisma
// generate` time from prisma/schema.prisma's `datasource.provider`. Swapping
// the adapter here only works once you've also changed `provider` in
// schema.prisma to "postgresql" and re-run `npx prisma generate` - see
// README.md "Deploying to production".

declare global {
  // eslint-disable-next-line no-var
  var __driven2developPrisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  return new PrismaClient({ adapter: createPrismaAdapter(databaseUrl) });
}

// Constructed lazily (on first property access) instead of at module load.
// A mismatch between DATABASE_URL and the schema's provider throws from
// inside the PrismaClient constructor - previously that ran the moment this
// file was imported, which crashed `next build` outright the instant any
// route module got loaded during page-data collection, regardless of
// whether that route ever queries the database. Deferring construction
// means the same misconfiguration still throws, but only for a request that
// actually reaches a route using `prisma` - not for the whole build.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = (global.__driven2developPrisma ??= createClient());
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
