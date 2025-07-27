import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt-web";

export async function middleware(request: NextRequest) {
  // Skip middleware for certain paths
  const { pathname } = request.nextUrl;
  
  // Skip Chrome DevTools and other browser requests
  if (pathname.includes('.well-known') || 
      pathname.includes('chrome-extension') ||
      pathname.includes('devtools')) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token");
  
  // Only log for actual page requests, not assets
  if (!pathname.startsWith('/_next') && !pathname.includes('.')) {
    console.log(`🔍 Middleware check for: ${pathname}`);
    console.log(`🍪 Token present: ${token ? 'YES' : 'NO'}`);
  }

  // Paths that don't require authentication
  const publicPaths = ["/login", "/signup", "/api/login", "/api/signup"];

  const isPublicPath = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Allow public paths to proceed without authentication
  if (isPublicPath) {
    console.log(`✅ Public path allowed: ${pathname}`);
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    console.log(`❌ No token, redirecting to login from: ${pathname}`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the JWT token using Web Crypto API
    await verifyJWT(token.value, process.env.JWT_SECRET || "secretkey");
    console.log(`✅ Token verified for: ${pathname}`);

    // If we're on the login page but have a valid token, redirect to dashboard
    if (pathname === "/login" || pathname === "/") {
      console.log(`🔄 Redirecting authenticated user to dashboard`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(`❌ Token verification failed: ${error}`);
    // If token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
