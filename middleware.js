// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production"
  });
  
  const { pathname } = req.nextUrl;

  // Protected paths
  const protectedPaths = ["/dashboard", "/admin"];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // Auth paths
  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // If user is logged in and tries to access auth page, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not logged in and tries to access protected page
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};