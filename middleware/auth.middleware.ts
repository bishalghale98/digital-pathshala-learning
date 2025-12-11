import { auth } from "@/lib/auth";
import { errorResponse } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

export const authMiddleware = async (
  req: NextRequest,
  allowedRoles: string[] | string
) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return errorResponse("Unauthorized: Please login", 401);
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(session.user.role)) {
    return errorResponse(
      "Forbidden: You do not have access to this action",
      403
    );
  }

  return NextResponse.next();
};
