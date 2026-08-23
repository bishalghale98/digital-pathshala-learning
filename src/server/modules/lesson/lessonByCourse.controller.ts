import prisma from "@/database/prisma";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";

export const fetchLessonsByCourseId = async (courseId: string) => {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    include: {
      course: true,
    },
  });

  return successResponse("Lessons fetched successfully", lessons);
};

export const getLessonByCourseId = tryCatch(
  async (req: Request, courseId: string) => fetchLessonsByCourseId(courseId)
);
