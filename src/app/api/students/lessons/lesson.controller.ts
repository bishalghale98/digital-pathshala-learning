import { errorResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";
import { fetchLessonsByCourseId } from "../../lesson/course/lessonByCourse.controller";

export const getLessonsWithCourseId = tryCatch(async (req: NextRequest) => {
  const courseId = req.nextUrl.searchParams.get("courseId");

  if (!courseId) {
    return errorResponse("courseId query parameter is required", 400);
  }

  return fetchLessonsByCourseId(courseId);
});
