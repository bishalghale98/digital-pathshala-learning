import dbConnect from "@/database/dbConnection";
import Lesson from "@/database/models/lesson.schema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest, NextResponse } from "next/server";

export const getLessonsWithCourseId = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const courseId = req.nextUrl.searchParams.get("courseId");

  if (!courseId) {
    return errorResponse("Course id is required", 400);
  }

  // Example: fetch lessons
  const lessons = await Lesson.find({ courseId }).populate("courseId").lean();

  return successResponse("lessons fetch", lessons);
});
