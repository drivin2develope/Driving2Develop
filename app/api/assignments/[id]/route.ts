import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const assignment = await prisma.assignment.findUnique({ where: { id: params.id } });
  if (!assignment) {
    return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
  }
  if (assignment.repId !== user.id && assignment.managerId !== user.id) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const status = body.status === "DONE" ? "DONE" : "PENDING";

  const updated = await prisma.assignment.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(updated);
}
