import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

// Driven2Develop runs on Prisma's engine-less "client" generator + driver adapters
// (see prisma/schema.prisma `engineType = "client"`). This means no native
// Rust query-engine binary is ever downloaded - useful for restricted-network
// builds and for fast, portable serverless deploys.
//
// Locally (SQLite): DATABASE_URL="file:./dev.db" -> PrismaBetterSQLite3.
// In production (Postgres): DATABASE_URL="postgresql://..." -> PrismaPg.
//
// IMPORTANT: the generated client's SQL dialect is baked in at `prisma
// generate` time from prisma/schema.prisma's `datasource.provider`. Swapping
// the adapter here only works once you've also changed `provider` in
// schema.prisma to "postgresql" and re-run `npx prisma generate` - see
// README.md "Deploying to production".

function createAdapter(databaseUrl: string) {
  if (databaseUrl.startsWith("file:")) {
    return new PrismaBetterSQLite3({ url: databaseUrl.replace(/^file:/, "") });
  }
  return new PrismaPg({ connectionString: databaseUrl });
}

declare global {
  // eslint-disable-next-line no-var
  var __driven2developPrisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

export const prisma: PrismaClient =
  global.__driven2developPrisma ?? new PrismaClient({ adapter: createAdapter(databaseUrl) });

if (process.env.NODE_ENV !== "production") {
  global.__driven2developPrisma = prisma;
}
