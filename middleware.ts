import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow login page to load without auth check
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

    // For protected admin paths, redirect to login if no session
    if (isAdminPath) {
        const sessionCookie = req.cookies.get("next-auth.session-token") ?? req.cookies.get("__Secure-next-auth.session-token");
        
        if (!sessionCookie) {
            const logInUrl = new URL("/admin/login", req.url);
            return NextResponse.redirect(logInUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};