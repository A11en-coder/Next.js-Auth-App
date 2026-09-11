import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup";
  const token = request.cookies.get("token")?.value;

  // if the user is on public path and has a token, redirect to home page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // if the user is on a private path and does not have a token, redirect to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/signup", "/profile/:path*"],
};
