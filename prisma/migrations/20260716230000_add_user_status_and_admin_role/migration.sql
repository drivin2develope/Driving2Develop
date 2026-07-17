-- AlterTable
-- Adds account status (PENDING/ACTIVE/SUSPENDED) for the new admin approval
-- workflow. Existing rows default to ACTIVE so no current user is locked out.
-- The Role enum's new ADMIN value needs no SQL change here: Prisma/SQLite
-- stores enums as plain TEXT with no CHECK constraint (see the "role" column
-- in the init migration), so it is purely a schema.prisma/client-level change.
ALTER TABLE "User" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';
