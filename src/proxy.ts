import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Roles } from "@/lib/constants";
import { getDashboardPath } from "@/lib/dashboard";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (pathname === "/sign-in") {
    // Signed-in users should never see the sign-in page
    if (session?.user) {
      return NextResponse.redirect(
        new URL(getDashboardPath(session.user.role), request.url)
      );
    }
    return NextResponse.next();
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const role = session.user.role;

  if (pathname.startsWith("/admin") && role !== Roles.Admin) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    pathname.startsWith("/student") &&
    role !== Roles.Student &&
    role !== Roles.Admin
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/sign-in"],
};
