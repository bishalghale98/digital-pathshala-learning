import prisma from "@/database/prisma";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const toggleLessonCompletion = tryCatch(async (req: NextRequest) => {
  const { enrollmentId, lessonId } = await req.json();

  if (!enrollmentId || !lessonId) {
    return errorResponse("enrollmentId and lessonId are required", 400);
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      completedLessons: {
        select: { id: true },
      },
    },
  });

  if (!enrollment) {
    return errorResponse("Enrollment not found", 404);
  }

  const isCompleted = enrollment.completedLessons.some(
    (lesson) => lesson.id === lessonId
  );

  if (isCompleted) {
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        completedLessons: {
          disconnect: { id: lessonId },
        },
        lastAccessedLessonId: lessonId,
        lastAccessedAt: new Date(),
      },
    });
  } else {
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        completedLessons: {
          connect: { id: lessonId },
        },
        lastAccessedLessonId: lessonId,
        lastAccessedAt: new Date(),
      },
    });
  }

  const updatedEnrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      completedLessons: {
        select: { id: true },
      },
      lastAccessedLesson: true,
    },
  });

  return successResponse("Progress updated", {
    completedLessons: updatedEnrollment?.completedLessons || [],
    lastAccessedLesson: updatedEnrollment?.lastAccessedLesson,
    lastAccessedAt: updatedEnrollment?.lastAccessedAt,
  });
});

export const updateLastAccessed = tryCatch(async (req: NextRequest) => {
  const { enrollmentId, lessonId } = await req.json();

  if (!enrollmentId || !lessonId) {
    return errorResponse("enrollmentId and lessonId are required", 400);
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollment) {
    return errorResponse("Enrollment not found", 404);
  }

  const updatedEnrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      lastAccessedLessonId: lessonId,
      lastAccessedAt: new Date(),
    },
    include: {
      lastAccessedLesson: true,
    },
  });

  return successResponse("Last accessed updated", {
    lastAccessedLesson: updatedEnrollment.lastAccessedLesson,
    lastAccessedAt: updatedEnrollment.lastAccessedAt,
  });
});
