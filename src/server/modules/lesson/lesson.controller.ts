import prisma from "@/database/prisma";
import { lessonCreateSchema, lessonUpdateSchema } from "@/schemas/lessonSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getLessons = tryCatch(async () => {
  const lessons = await prisma.lesson.findMany({
    include: {
      course: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse("Successfully fetched lessons", lessons, 200);
});

export const createLesson = tryCatch(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = lessonCreateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid lesson data", 400);
  }

  const { courseId, title, description, videoUrl, lessonNumber } = parsed.data;

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title,
      description: description || undefined,
      videoUrl: videoUrl || undefined,
      lessonNumber: lessonNumber || 0,
    },
    include: {
      course: true,
    },
  });

  return successResponse("Lesson created successfully", lesson, 201);
});

export const getLesson = tryCatch(async (req: NextRequest, id: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      course: true,
    },
  });

  if (!lesson) {
    return errorResponse("Lesson with that ID not found", 404);
  }

  return successResponse("Successfully fetched lesson", lesson, 200);
});

export const deleteLesson = tryCatch(async (req: NextRequest, id: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
  });

  if (!lesson) {
    return errorResponse("Lesson with that ID not found", 404);
  }

  await prisma.lesson.delete({
    where: { id },
  });

  return successResponse("Lesson successfully deleted", null, 200);
});

export const updateLesson = tryCatch(async (req: NextRequest, id: string) => {
  const body = await req.json();
  const parsed = lessonUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid lesson data", 400);
  }

  const { courseId, title, description, videoUrl, lessonNumber } = parsed.data;

  const updatedLesson = await prisma.lesson.update({
    where: { id },
    data: {
      ...(courseId !== undefined && { courseId }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(lessonNumber !== undefined && { lessonNumber }),
    },
    include: {
      course: true,
    },
  });

  return successResponse("Lesson successfully updated", updatedLesson, 200);
});
