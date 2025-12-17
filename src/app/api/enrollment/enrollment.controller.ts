import dbConnect from "@/database/dbConnection";
import Enrollment from "@/database/models/enrollment.schema";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import { enrollmentCreateSchema } from "@/schemas/enrollmentSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
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
  await dbConnect();

  const body = await req.json();
  const parsed = enrollmentCreateSchema.safeParse(body);

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    return errorResponse("Invalid enrollment data", 400);
  }

  const { courseId, whatsapp } = parsed.data;

  const studentId = "123";

  const existing = await Enrollment.findOne({ studentId, courseId });
  if (existing) {
    return errorResponse("Student is already enrolled in this course", 409);
  }

  const enrollment = await Enrollment.create({
    studentId: "123",
    courseId,
    whatsapp,
    enrolledAt: new Date(),
  });

  return successResponse("Enrollment created successfully", enrollment, 201);
});

export const getEnrollment = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid enrollment ID", 400);
  }

  const enrollment = await Enrollment.findById(id)
    .populate("courseId")
    .populate("studentId")
    .lean();

  if (!enrollment) {
    return errorResponse("Enrollment with that ID not found", 404);
  }

  return successResponse("Successfully fetched enrollment", enrollment, 200);
});

export const deleteEnrollment = tryCatch(
  async (req: NextRequest, id: string) => {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid enrollment ID", 400);
    }

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return errorResponse("enrollment with that ID not found", 404);
    }

    await Enrollment.findByIdAndDelete(id);

    return successResponse("Enrollment successfully deleted", null, 200);
  }
);

export const changeEnrollmentStatus = tryCatch(
  async (req: NextRequest, id: string) => {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid enrollment ID", 400);
    }

    const { enrollmentStatus } = await req.json();

    if (!enrollmentStatus) {
      return errorResponse("Enrollment is id is required");
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      { enrollmentStatus },
      {
        new: true,
      }
    )
      .lean()
      .populate("courseId")
      .populate("studentId");

    if (!updatedEnrollment) {
      return errorResponse("enrollment with that ID not found", 404);
    }

    return successResponse(
      "Enrollment successfully updated",
      updatedEnrollment,
      200
    );
  }
);
