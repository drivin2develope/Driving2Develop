import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Single source of truth for picking a Prisma driver adapter from a
 * DATABASE_URL, shared by the runtime client (lib/db.ts), the seed script
 * (prisma/seed.ts), and the Prisma CLI config (prisma.config.ts).
 *
 * Before this existed, prisma/seed.ts hard-coded the SQLite adapter
 * regardless of DATABASE_URL - harmless locally, but it would have failed
 * outright against a real production Postgres database (wrong adapter for
 * the connection string). Duplicating this selection logic per-file is
 * exactly how that drift happened; importing from here instead means the
 * three call sites can't drift out of sync again.
 *
 * IMPORTANT: the generated Prisma Client's SQL dialect is baked in at
 * `prisma generate` time from prisma/schema.prisma's `datasource.provider`.
 * Picking the right adapter here only matters once that provider has also
 * been switched to "postgresql" and the client regenerated - see README.md
 * "Deploying to production".
 */
export function createPrismaAdapter(databaseUrl: string) {
  if (databaseUrl.startsWith("file:")) {
    return new PrismaBetterSQLite3({ url: databaseUrl.replace(/^file:/, "") });
  }
  return new PrismaPg({ connectionString: databaseUrl });
}
