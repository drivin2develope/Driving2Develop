import "dotenv/config";
import { defineConfig } from "prisma/config";
import { createPrismaAdapter } from "./lib/prisma-adapter";

// Driven2Develop uses Prisma's engine-less "js" engine (driver adapters) so that no
// native Rust engine binary needs to be downloaded at install/build time.
// This picks the Prisma CLI's (generate/migrate/studio) adapter from
// DATABASE_URL via the same shared helper the runtime client and seed script
// use (lib/prisma-adapter.ts) - so running `migrate deploy` locally against
// a real production DATABASE_URL picks the right adapter automatically,
// with nothing to remember to also change here.
//
// Note this only affects which adapter the CLI uses to connect - the
// generated client's SQL dialect still comes from prisma/schema.prisma's
// `datasource.provider`, which must also say "postgresql" for a real
// Postgres deploy. See README.md "Deploying to production".

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
    return createPrismaAdapter(process.env.DATABASE_URL ?? "file:./dev.db");
  },
});
