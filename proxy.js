// middleware.js  (project root, same level as app/)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If somehow a non-admin reaches /admin, redirect to login
    if (
      pathname.startsWith("/admin") &&
      token?.role !== "admin" &&
      token?.role !== "superadmin"
    ) {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", req.url),
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware if user is NOT logged in
      authorized({ token }) {
        return !!token;
      },
    },
  },
);

// Apply this middleware only to /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
