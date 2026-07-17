import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const VALID_ROLES = ["REP", "MANAGER", "ADMIN"];
const VALID_STATUSES = ["PENDING", "ACTIVE", "SUSPENDED"];

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentUser();
  if (!admin) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || (body.role === undefined && body.status === undefined)) {
    return NextResponse.json({ error: "Provide a role and/or status to update." }, { status: 400 });
  }
  if (body.role !== undefined && !VALID_ROLES.includes(body.role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  // Guard against an admin accidentally locking themselves out - they can't
  // demote their own role away from ADMIN or suspend/unapprove themselves.
  if (target.id === admin.id) {
    if (body.role !== undefined && body.role !== "ADMIN") {
      return NextResponse.json({ error: "You can't remove your own admin role." }, { status: 400 });
    }
    if (body.status !== undefined && body.status !== "ACTIVE") {
      return NextResponse.json({ error: "You can't suspend or unapprove your own account." }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: {
      ...(body.role !== undefined ? { role: body.role } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
    },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, managerId: true },
  });

  return NextResponse.json(updated);
}
