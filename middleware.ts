import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// 👇 ADD THIS AT THE BOTTOM
export const config = {
  matcher: [
    "/((?!login|signup|accountSetup|_next|favicon.ico|api).*)",
  ],
};
