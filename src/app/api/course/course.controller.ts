import dbConnect from "@/database/dbConnection";
import Course from "@/database/models/course.schema";
import { createCourseSchema } from "@/schemas/courseSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";
import "@/database/models/category.schema"; // ✅ FORCE REGISTER

export const createCourse = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();

  const parsed = createCourseSchema.safeParse(body);

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    return errorResponse("Invalid course data", 400);
  }

  const { categoryId, description, duration, price, title } = parsed.data;

  // ✅ Prevent duplicate courses
  const existingCourse = await Course.findOne({ title });
  if (existingCourse) {
    return errorResponse("Course already exists", 409);
  }

  const course = await Course.create({
    categoryId,
    description,
    duration,
    price,
    title,
  });

  return successResponse("Course created successfully", course, 201);
});

export const getCourses = tryCatch(async () => {
  await dbConnect();

  const courses = await Course.find()
    .populate("categoryId") // ✅ THIS IS CORRECT
    .sort({ createdAt: -1 })
    .lean();


  return successResponse("Courses fetched successfully", courses, 200);
});
