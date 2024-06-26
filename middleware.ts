import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/secure", "/admin"],
};

export function middleware(req: NextRequest) {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) {
    throw new Error(
      "Missing environment variables ADMIN_USER and ADMIN_PASSWORD"
    );
  }

  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }
  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
