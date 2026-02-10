import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            return null;
        }

        if (!isAuth) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }

        // Role-based protection
        if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (req.nextUrl.pathname.startsWith("/teacher") && token.role !== "TEACHER") {
            // Admin should be able to access everything, or specifically redirect to dashboard if needed.
            // But prompt says Admin can input scores too.
            // Let's allow Admin everywhere or redirect based on role.
            if (token.role === "ADMIN") return null;
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: () => true, // We handle logic in the function above
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/teacher/:path*", "/dashboard/:path*", "/auth/:path*"],
};
