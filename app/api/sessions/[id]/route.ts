import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const session = await prisma.practiceSession.findUnique({
    where: { id: params.id },
    include: { metric: true, scenario: true, user: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const isOwner = session.userId === user.id;
  const isManagerOfOwner = user.role === "MANAGER" && session.user.managerId === user.id;

  if (!isOwner && !isManagerOfOwner) {
    return NextResponse.json({ error: "Not authorized to view this session." }, { status: 403 });
  }

  return NextResponse.json(session);
}
