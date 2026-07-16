import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const scenarios = await prisma.scenario.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(scenarios);
}
