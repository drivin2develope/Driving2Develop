import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Missing email or password." }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (user.status === "PENDING") {
    return NextResponse.json({ error: "Your account is still waiting on admin approval." }, { status: 403 });
  }
  if (user.status === "SUSPENDED") {
    return NextResponse.json({ error: "This account has been suspended. Contact an admin for access." }, { status: 403 });
  }

  const token = await signSession({ userId: user.id, role: user.role as "REP" | "MANAGER" | "ADMIN" });
  await setSessionCookie(token);

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });
}
