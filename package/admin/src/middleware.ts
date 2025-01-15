import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTHORIZATION_TOKEN_KEY } from "@/libs/cookie";

export function middleware(req: NextRequest): NextResponse {
  const cookie = req.cookies.get(AUTHORIZATION_TOKEN_KEY);
  // const cookie = req.headers.has("Authorization");
  if (!cookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images/*|login|favicon.ico).*)"],
};
