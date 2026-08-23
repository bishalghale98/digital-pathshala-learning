import prisma from "@/database/prisma";
import { createCourseSchema } from "@/schemas/courseSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const createCourse = tryCatch(async (req: NextRequest) => {
  const body = await req.json();

  const parsed = createCourseSchema.safeParse(body);

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    return errorResponse("Invalid course data", 400);
  }

  const { title, description, duration, price, categoryId } = parsed.data;

  const existingCourse = await prisma.course.findFirst({
    where: { title },
  });

  if (existingCourse) {
    return errorResponse("Course already exists", 409);
  }

  const course = await prisma.course.create({
    data: {
      title,
      description,
      duration,
      price,
      categoryId,
    },
    include: {
      category: true,
    },
  });

  return successResponse("Course created successfully", course, 201);
});

export const getCourses = tryCatch(async () => {
  const courses = await prisma.course.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse("Courses fetched successfully", courses, 200);
});

export const getCourse = tryCatch(async (req: NextRequest, id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!course) {
    return errorResponse("Course not found", 404);
  }

  return successResponse("Course fetched successfully", course, 200);
});

export const deleteCourse = tryCatch(async (req: NextRequest, id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    return errorResponse("Course not found", 404);
  }

  await prisma.lesson.deleteMany({
    where: { courseId: id },
  });

  await prisma.course.delete({
    where: { id },
  });

  return successResponse("Course deleted successfully", null, 200);
});

export const updateCourse = tryCatch(async (req: NextRequest, id: string) => {
  const body = await req.json();

  const parsed = createCourseSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid course data", 400);
  }

  const { title, description, duration, price, categoryId } = parsed.data;

  const updatedCourse = await prisma.course.update({
    where: { id },
    data: {
      title,
      description,
      duration,
      price,
      categoryId,
    },
    include: {
      category: true,
    },
  });

  return successResponse("Course updated successfully", updatedCourse, 200);
});
