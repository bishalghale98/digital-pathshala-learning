import { NextRequest } from "next/server";
import { authMiddleware } from "../../../middleware/auth.middleware";

type RouteHandler = (req: NextRequest, context?: any) => Promise<Response>;

export function withAuth(handler: RouteHandler, allowedRoles: string | string[]) {
  return async (req: NextRequest, context?: any) => {
    const checkAuth = await authMiddleware(req, allowedRoles);
    if (checkAuth.status !== 200) {
      return checkAuth;
    }
    return handler(req, context);
  };
}
