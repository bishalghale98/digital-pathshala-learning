import dbConnect from "@/database/dbConnection";
import Enrollment from "@/database/models/enrollment.schema";
import { auth } from "@/lib/auth";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import {
  enrollmentCreateSchema,
  enrollmentStatusSchema,
} from "@/schemas/enrollmentSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const getEnrollments = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const enrollments = await Enrollment.find()
    .populate("studentId")
    .populate("courseId")
    .lean()
    .sort({ createdAt: -1 });

  return successResponse("Successfully fetched enrollments", enrollments, 200);
});

export const createEnrollment = tryCatch(async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  await dbConnect();

  const body = await req.json();
  const parsed = enrollmentCreateSchema.safeParse(body);

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    return errorResponse("Invalid enrollment data", 400);
  }

  const { courseId, whatsApp, paymentMethod } = parsed.data;

  const studentId = session?.user.id;

  const existing = await Enrollment.findOne({ studentId, courseId });
  if (existing) {
    return errorResponse("Student is already enrolled in this course", 409);
  }

  const enrollment = await Enrollment.create({
    studentId,
    courseId,
    whatsapp: whatsApp,
    paymentMethod,
    enrolledAt: new Date(),
  });

  return successResponse("Enrollment created successfully", enrollment, 201);
});

export const getEnrollment = tryCatch(async (_req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid enrollment ID", 400);
  }

  const enrollment = await Enrollment.findById(id)
    .populate("courseId", "title description")
    .populate("studentId", "name email")
    .lean();

  if (!enrollment) {
    return errorResponse("Enrollment not found", 404);
  }

  return successResponse("Successfully fetched enrollment", enrollment, 200);
});

export const deleteEnrollment = tryCatch(
  async (_req: NextRequest, id: string) => {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid enrollment ID", 400);
    }

    const enrollment = await Enrollment.findByIdAndDelete(id);

    if (!enrollment) {
      return errorResponse("Enrollment not found", 404);
    }

    return successResponse("Enrollment successfully deleted", null, 200);
  }
);

export const changeEnrollmentStatus = tryCatch(
  async (req: NextRequest, id: string) => {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid enrollment ID", 400);
    }

    const body = await req.json();
    const parsed = enrollmentStatusSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid enrollment status", 400);
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      { enrollmentStatus: parsed.data.enrollmentStatus },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("courseId")
      .populate("studentId")
      .lean();

    if (!updatedEnrollment) {
      return errorResponse("Enrollment not found", 404);
    }

    return successResponse(
      "Enrollment status updated successfully",
      updatedEnrollment,
      200
    );
  }
);
