import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Roles } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (pathname === "/sign-in") {
    return NextResponse.next();
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const role = session.user.role;

  if (pathname.startsWith("/admin") && role !== Roles.Admin) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // if (pathname.startsWith("/student") && role !== Roles.Student) {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/sign-in"],
};
