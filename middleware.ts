import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check all possible NextAuth / Auth.js session cookie name patterns (including chunked cookies)
  const allCookies = req.cookies.getAll();
  const hasSessionCookie = allCookies.some((cookie) =>
    cookie.name.includes("session-token")
  );

  const isApiAdminPath = pathname.startsWith("/api/admin");
  const isAdminPagePath = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // If already logged in and visiting /admin/login, redirect to /admin dashboard
  if (isLoginPage) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Handle protected API routes under /api/admin/
  if (isApiAdminPath) {
    if (!hasSessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Handle protected page routes under /admin/
  if (isAdminPagePath) {
    if (!hasSessionCookie) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};