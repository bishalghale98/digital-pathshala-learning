import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/utils/response";
import { NextRequest } from "next/server";

/**
 * Middleware to protect app routes by role
 * @param req - NextRequest object
 * @param allowedRoles - single role or array of roles allowed to access
 * @returns null if authorized, or errorResponse if not
 */
export const authMiddleware = async (
  req: NextRequest,
  allowedRoles: string[] | string
) => {
  // Get session from headers
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return errorResponse("Unauthorized: Please login", 401);
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(session.user.role as string)) {
    return errorResponse(
      "Forbidden: You do not have access to this action",
      403
    );
  }

  // Authorized: return null so API route continues
  return successResponse("Authorized", session);
};
