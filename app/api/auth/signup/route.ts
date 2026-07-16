import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string" || typeof body.name !== "string") {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const name = body.name.trim();
  const password = body.password;

  if (!email.includes("@") || password.length < 6 || name.length < 1) {
    return NextResponse.json({ error: "Enter a valid email, name, and a password with at least 6 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  // Bootstrap: the very first account on a fresh install becomes an active
  // admin (nobody else exists yet to approve them). Every signup after that
  // requires an existing admin to approve it before the account can sign in.
  const isFirstUser = (await prisma.user.count()) === 0;
  const role = isFirstUser ? "ADMIN" : body.role === "MANAGER" ? "MANAGER" : "REP";
  const status = isFirstUser ? "ACTIVE" : "PENDING";

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
      status,
    },
  });

  if (user.status !== "ACTIVE") {
    return NextResponse.json({
      pending: true,
      message: "Your account was created and is waiting on admin approval. You'll be able to sign in once it's approved.",
    });
  }

  const token = await signSession({ userId: user.id, role: user.role as "REP" | "MANAGER" | "ADMIN" });
  await setSessionCookie(token);

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });
}
