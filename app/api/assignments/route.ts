import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MANAGER") {
    return NextResponse.json({ error: "Only managers can create assignments." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.repId !== "string" || typeof body.note !== "string") {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const rep = await prisma.user.findUnique({ where: { id: body.repId } });
  if (!rep || rep.managerId !== user.id) {
    return NextResponse.json({ error: "That rep is not on your team." }, { status: 403 });
  }

  const assignment = await prisma.assignment.create({
    data: {
      managerId: user.id,
      repId: body.repId,
      scenarioId: body.scenarioId || null,
      note: body.note,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });

  return NextResponse.json(assignment);
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const assignments = await prisma.assignment.findMany({
    where: user.role === "MANAGER" ? { managerId: user.id } : { repId: user.id },
    include: { scenario: true, rep: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assignments);
}
