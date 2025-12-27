import dbConnect from "@/database/dbConnection";
import Enrollment from "@/database/models/enrollment.schema";
import { auth, db } from "@/lib/auth";
import { Roles } from "@/lib/constants";
import { EnrollmentStatus } from "@/types/models";
import { successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const getStudents = tryCatch(async (req: NextRequest) => {
  const students = await db
    .collection("user")
    .find({ role: Roles.Student })
    .sort({ createdAt: -1 })
    .toArray();

  return successResponse("Student fetch successfully", students);
});

export const getMyCourse = tryCatch(async (req: NextRequest) => {
  await dbConnect();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  const enrollments = await Enrollment.find({
    studentId: userId,
    enrollmentStatus: EnrollmentStatus.Approved,
  })
    .populate("courseId")
    .lean();

  return successResponse("My courses fetch successfully", enrollments);
});
