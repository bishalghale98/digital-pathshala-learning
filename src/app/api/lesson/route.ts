import { NextRequest } from "next/server";
import { createLesson, getLessons } from "@/server/modules/lesson/lesson.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../middleware/auth.middleware";

export async function GET(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }
  return getLessons(req);
}

export async function POST(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }
  return createLesson(req);
}
