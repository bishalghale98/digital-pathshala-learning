import dbConnect from "@/database/dbConnection";
import Lesson from "@/database/models/lesson.schema";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";

/**
 * Shared core for fetching all lessons of a course.
 * Used by /api/lesson/course/[courseId] and /api/students/lessons?courseId=...
 */
export const fetchLessonsByCourseId = async (courseId: string) => {
  await dbConnect();

  if (!isValidObjectId(courseId)) {
    return errorResponse("Invalid course ID", 400);
  }

  const lessons = await Lesson.find({ courseId })
    .populate("courseId")
    .lean();

  return successResponse("Lessons fetched successfully", lessons);
};

export const getLessonByCourseId = tryCatch(
  async (req: Request, courseId: string) => fetchLessonsByCourseId(courseId)
);
