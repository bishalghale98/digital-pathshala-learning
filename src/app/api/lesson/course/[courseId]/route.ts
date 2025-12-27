import { NextRequest } from "next/server";
import { getLessonByCourseId } from "../lessonByCourse.controller";
import { authMiddleware } from "../../../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }

  const { courseId } = await params;

  return getLessonByCourseId(req, courseId);
}
