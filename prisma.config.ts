import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

// Driven2Develop uses Prisma's engine-less "js" engine (driver adapters) so that no
// native Rust engine binary needs to be downloaded at install/build time.
// Locally this points the Prisma CLI (generate/migrate/studio) at SQLite via
// better-sqlite3. The deployed app's runtime client (lib/db.ts) picks the
// adapter based on DATABASE_URL instead of this file, which only affects the
// CLI. In production, switch `provider` in prisma/schema.prisma to
// "postgresql" - see README.md.

function sqlitePathFromUrl(url: string) {
  return url.replace(/^file:/, "");
}

export default defineConfig({
  engine: "js",
  experimental: {
    adapter: true,
  },
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  adapter: async () => {
    return new PrismaBetterSQLite3({
      url: sqlitePathFromUrl(process.env.DATABASE_URL ?? "file:./dev.db"),
    });
  },
});
