#!/usr/bin/env node
/**
 * Safely switches prisma/schema.prisma's datasource provider between
 * "sqlite" and "postgresql", then immediately runs `prisma validate`.
 *
 * This exists because the exact incident it prevents already happened once:
 * a hand-edit to this file reached `main` with a stray character that broke
 * every build, because nothing validated the edit before it was committed.
 * This script makes that class of mistake structurally impossible - if the
 * result doesn't validate, the file is restored to its original contents
 * and the script exits non-zero. Nothing is ever left in a broken state.
 *
 * Usage:
 *   node scripts/switch-datasource-provider.mjs sqlite
 *   node scripts/switch-datasource-provider.mjs postgresql
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const target = process.argv[2];
if (target !== "sqlite" && target !== "postgresql") {
  console.error('Usage: node scripts/switch-datasource-provider.mjs <sqlite|postgresql>');
  process.exit(1);
}

const schemaPath = "prisma/schema.prisma";
const original = readFileSync(schemaPath, "utf8");

const datasourceBlock = /(datasource\s+db\s*\{[^}]*?provider\s*=\s*")(sqlite|postgresql)("[^}]*?\})/s;
if (!datasourceBlock.test(original)) {
  console.error(`Could not find a recognizable datasource block in ${schemaPath} - aborting without changes.`);
  process.exit(1);
}

const updated = original.replace(datasourceBlock, (_match, before, _current, after) => `${before}${target}${after}`);

if (updated === original) {
  console.log(`Datasource provider is already "${target}" - nothing to change.`);
  process.exit(0);
}

writeFileSync(schemaPath, updated);
console.log(`Set datasource provider to "${target}". Validating...`);

try {
  execSync("npx prisma validate", { stdio: "inherit" });
} catch {
  writeFileSync(schemaPath, original);
  console.error(`\nprisma validate FAILED after the edit - ${schemaPath} has been restored to its original contents.`);
  console.error("No broken schema was left on disk. Investigate before retrying.");
  process.exit(1);
}

console.log(`\n${schemaPath} now uses "${target}" and validates cleanly.`);
console.log("Next: run `npx prisma generate`, update DATABASE_URL, and (for the CLI) confirm prisma.config.ts's adapter matches - see README.md \"Deploying to production\".");
