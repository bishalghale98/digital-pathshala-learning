import { NextRequest } from "next/server";
import { getLessonByCourseId } from "../lessonByCourse.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  return getLessonByCourseId(req, courseId);
}