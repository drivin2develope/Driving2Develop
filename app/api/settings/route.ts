import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, signSession, setSessionCookie } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim().length > 0) data.name = body.name.trim();
  if (typeof body.industry === "string") data.industry = body.industry;
  if (typeof body.experienceLevel === "string") data.experienceLevel = body.experienceLevel;
  if (typeof body.goal === "string") data.goal = body.goal;
  if (body.role === "REP" || body.role === "MANAGER") data.role = body.role;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
  });

  if (data.role && data.role !== user.role) {
    const token = await signSession({ userId: updated.id, role: updated.role as "REP" | "MANAGER" | "ADMIN" });
    await setSessionCookie(token);
  }

  const { passwordHash, ...safeUser } = updated;
  return NextResponse.json(safeUser);
}
