import { NextRequest } from "next/server";
import { getStudents } from "@/server/modules/user/student.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../middleware/auth.middleware";

export async function GET(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }

  return getStudents(req);
}
