import { NextRequest } from "next/server";
import { createCourse, getCourses } from "@/server/modules/course/course.controller";
import { authMiddleware } from "../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";

export async function POST(req: NextRequest): Promise<Response> {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }
  return createCourse(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }
  return getCourses();
}
