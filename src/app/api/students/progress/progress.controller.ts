import dbConnect from "@/database/dbConnection";
import Enrollment from "@/database/models/enrollment.schema";
import { auth } from "@/lib/auth";
import { EnrollmentStatus } from "@/types/models";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const toggleLessonCompletion = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return errorResponse("Unauthorized", 401);
  }

  const { enrollmentId, lessonId } = await req.json();

  if (!enrollmentId || !lessonId) {
    return errorResponse("enrollmentId and lessonId are required", 400);
  }

  const enrollment = await Enrollment.findOne({
    _id: enrollmentId,
    studentId: session.user.id,
    enrollmentStatus: EnrollmentStatus.Approved,
  });

  if (!enrollment) {
    return errorResponse("Enrollment not found", 404);
  }

  const lessonIdStr = lessonId.toString();
  const isCompleted = enrollment.completedLessons.some(
    (id: { toString(): string }) => id.toString() === lessonIdStr
  );

  if (isCompleted) {
    enrollment.completedLessons = enrollment.completedLessons.filter(
      (id: { toString(): string }) => id.toString() !== lessonIdStr
    );
  } else {
    enrollment.completedLessons.push(lessonId);
  }

  enrollment.lastAccessedLesson = lessonId;
  enrollment.lastAccessedAt = new Date();

  await enrollment.save();

  return successResponse("Progress updated", {
    completedLessons: enrollment.completedLessons,
    lastAccessedLesson: enrollment.lastAccessedLesson,
    lastAccessedAt: enrollment.lastAccessedAt,
  });
});

export const updateLastAccessed = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return errorResponse("Unauthorized", 401);
  }

  const { enrollmentId, lessonId } = await req.json();

  if (!enrollmentId || !lessonId) {
    return errorResponse("enrollmentId and lessonId are required", 400);
  }

  const enrollment = await Enrollment.findOneAndUpdate(
    {
      _id: enrollmentId,
      studentId: session.user.id,
      enrollmentStatus: EnrollmentStatus.Approved,
    },
    {
      lastAccessedLesson: lessonId,
      lastAccessedAt: new Date(),
    },
    { new: true }
  );

  if (!enrollment) {
    return errorResponse("Enrollment not found", 404);
  }

  return successResponse("Last accessed updated", {
    lastAccessedLesson: enrollment.lastAccessedLesson,
    lastAccessedAt: enrollment.lastAccessedAt,
  });
});
