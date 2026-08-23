import { NextRequest } from "next/server";
import { createEnrollment, getEnrollments } from "@/server/modules/enrollment/enrollment.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../middleware/auth.middleware";

export async function GET(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }
  return getEnrollments(req);
}

export async function POST(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }

  return createEnrollment(req);
}
