import { NextRequest } from "next/server";
import { getLessonsWithCourseId } from "@/server/modules/user/lesson.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../../middleware/auth.middleware";

export async function GET(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }

  return getLessonsWithCourseId(req);
}
