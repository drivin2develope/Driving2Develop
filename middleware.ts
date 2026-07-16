import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "driving2develop_session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/practice",
  "/upload",
  "/report",
  "/history",
  "/scenarios",
  "/skills",
  "/achievements",
  "/coach",
  "/objections",
  "/leaderboard",
  "/notifications",
  "/manager",
  "/settings",
  "/onboarding",
];

const AUTH_PAGES = ["/login", "/signup"];

async function getSession(token: string | undefined) {
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (typeof payload.userId === "string" && (payload.role === "REP" || payload.role === "MANAGER")) {
      return { userId: payload.userId as string, role: payload.role as "REP" | "MANAGER" };
    }
    return null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await getSession(token);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/manager") && session && session.role !== "MANAGER") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/practice/:path*",
    "/upload/:path*",
    "/report/:path*",
    "/history/:path*",
    "/scenarios/:path*",
    "/skills/:path*",
    "/achievements/:path*",
    "/coach/:path*",
    "/objections/:path*",
    "/leaderboard/:path*",
    "/notifications/:path*",
    "/manager/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
    "/login",
    "/signup",
  ],
};
