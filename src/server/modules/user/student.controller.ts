import prisma from "@/database/prisma";
import { successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getStudents = tryCatch(async () => {
  // Note: Students are managed by Better Auth in a separate table
  // For now, we return enrollments as a proxy for students
  // In a real implementation, you would query the Better Auth user table
  const enrollments = await prisma.enrollment.findMany({
    select: {
      studentId: true,
    },
    distinct: ["studentId"],
    orderBy: { createdAt: "desc" },
  });

  const students = enrollments.map((e) => ({
    id: e.studentId,
  }));

  return successResponse("Student fetch successfully", students);
});

export const getMyCourse = tryCatch(async () => {
  // Note: In a real implementation, studentId would come from the session
  const studentId = "placeholder-student-id";

  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
      enrollmentStatus: "Approved",
    },
    include: {
      course: true,
      lastAccessedLesson: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse("My courses fetch successfully", enrollments);
});
