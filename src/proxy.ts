import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Roles, ROUTES } from "@/lib/constants";
import { getDashboardPath } from "@/lib/dashboard";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (pathname === ROUTES.SIGN_IN) {
    // Signed-in users should never see the sign-in page
    if (session?.user) {
      return NextResponse.redirect(
        new URL(getDashboardPath(session.user.role), request.url)
      );
    }
    return NextResponse.next();
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url));
  }

  const role = session.user.role;

  if (pathname.startsWith(ROUTES.ADMIN_DASHBOARD) && role !== Roles.Admin) {
    return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED, request.url));
  }

  if (
    pathname.startsWith(ROUTES.STUDENT_DASHBOARD) &&
    role !== Roles.Student &&
    role !== Roles.Admin
  ) {
    return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/sign-in"],
};
