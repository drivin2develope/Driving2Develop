/**
 * One-off operator script: promotes an existing account to ADMIN + ACTIVE.
 *
 * The first-ever signup on a fresh database is already auto-promoted to
 * ADMIN (see app/api/auth/signup/route.ts). This script exists for the
 * production case where an operator needs to grant admin access to an
 * account that already exists (e.g. after seeding, or a second admin).
 *
 * Usage: npx tsx prisma/make-admin.ts someone@company.com
 */
import { prisma } from "../lib/db";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx prisma/make-admin.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN", status: "ACTIVE" },
  }).catch(() => null);

  if (!user) {
    console.error(`No user found with email "${email}". Create the account first (sign up or seed), then run this again.`);
    process.exit(1);
  }

  console.log(`${user.email} is now an active admin.`);
}

main().finally(() => process.exit(0));
