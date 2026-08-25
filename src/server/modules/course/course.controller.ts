import prisma from "@/database/prisma";
import { createCourseSchema } from "@/schemas/courseSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";
import { getSlug } from "@/lib/helper/helper";

export const createCourse = tryCatch(async (req: NextRequest) => {
  const body = await req.json();

  const parsed = createCourseSchema.safeParse(body);

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    return errorResponse("Invalid course data", 400);
  }

  const {
    title,
    slug,
    shortDescription,
    description,
    duration,
    price,
    thumbnail,
    whatsappGroupLink,
    keywords,
    status,
    categoryId,
  } = parsed.data;

  const existingCourse = await prisma.course.findFirst({
    where: { title },
  });

  if (existingCourse) {
    return errorResponse("Course already exists", 409);
  }

  const courseSlug = slug || getSlug(title);

  const existingSlug = await prisma.course.findUnique({
    where: { slug: courseSlug },
  });

  if (existingSlug) {
    return errorResponse("A course with this slug already exists", 409);
  }

  const course = await prisma.course.create({
    data: {
      title,
      slug: courseSlug,
      shortDescription: shortDescription || "",
      description,
      duration,
      price,
      thumbnail: thumbnail || undefined,
      whatsappGroupLink: whatsappGroupLink || undefined,
      keywords: keywords || undefined,
      status: status || "DRAFT",
      categories: {
        create: categoryId.map((id) => ({ categoryId: id })),
      },
    },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });

  return successResponse("Course created successfully", course, 201);
});

export const getCourses = tryCatch(async () => {
  const courses = await prisma.course.findMany({
    include: {
      categories: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse("Courses fetched successfully", courses, 200);
});

export const getCourse = tryCatch(async (req: NextRequest, id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      categories: {
        include: { category: true },
      },
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

  const {
    title,
    slug,
    shortDescription,
    description,
    duration,
    price,
    thumbnail,
    whatsappGroupLink,
    keywords,
    status,
    categoryId,
  } = parsed.data;

  const existingCourse = await prisma.course.findUnique({ where: { id } });
  if (!existingCourse) {
    return errorResponse("Course not found", 404);
  }

  const courseSlug = slug || getSlug(title);

  if (courseSlug !== existingCourse.slug) {
    const slugConflict = await prisma.course.findUnique({
      where: { slug: courseSlug },
    });
    if (slugConflict) {
      return errorResponse("A course with this slug already exists", 409);
    }
  }

  await prisma.courseCategory.deleteMany({
    where: { courseId: id },
  });

  const updatedCourse = await prisma.course.update({
    where: { id },
    data: {
      title,
      slug: courseSlug,
      shortDescription: shortDescription || "",
      description,
      duration,
      price,
      thumbnail: thumbnail || undefined,
      whatsappGroupLink: whatsappGroupLink || undefined,
      keywords: keywords || undefined,
      status: status || "DRAFT",
      categories: {
        create: categoryId.map((catId) => ({ categoryId: catId })),
      },
    },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });

  return successResponse("Course updated successfully", updatedCourse, 200);
});
