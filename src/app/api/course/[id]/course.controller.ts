import dbConnect from "@/database/dbConnection";
import Course from "@/database/models/course.schema";
import Lesson from "@/database/models/lesson.schema";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import { createCourseSchema } from "@/schemas/courseSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getCourse = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid course ID", 400);
  }

  const course = await Course.findById(id).populate("categoryId").lean();

  if (!course) {
    return errorResponse("Course not found", 404);
  }

  return successResponse("Course fetched successfully", course, 200);
});

export const deleteCourse = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid course ID", 400);
  }

  const course = await Course.findById(id);
  if (!course) {
    return errorResponse("Course not found", 404);
  }

  await Promise.all([
    Course.findByIdAndDelete(id),
    Lesson.deleteMany({ courseId: id }),
  ]);

  return successResponse("Course deleted successfully", null, 200);
});

export const updateCourse = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid course ID", 400);
  }

  const body = await req.json();

  const parsed = createCourseSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid course data", 400);
  }

  const updatedCourse = await Course.findByIdAndUpdate(id, parsed.data, {
    new: true,
  }).populate("categoryId");

  if (!updatedCourse) {
    return errorResponse("Course not found", 404);
  }

  return successResponse("Course updated successfully", updatedCourse, 200);
});
