import prisma from "@/database/prisma";
import { enrollmentCreateSchema, enrollmentStatusSchema } from "@/schemas/enrollmentSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import axios from "axios";
import { NextRequest } from "next/server";
import { populateStudentObj, populateStudents } from "./helper.controller";

export const getEnrollments = tryCatch(async () => {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      course: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const populatedEnrollments = await populateStudents(enrollments);

  return successResponse("Successfully fetched enrollments", populatedEnrollments, 200);
});

export const createEnrollment = tryCatch(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = enrollmentCreateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid enrollment data", 400);
  }

  const { courseId, whatsApp, paymentMethod } = parsed.data;

  if (paymentMethod !== "khalti") {
    return errorResponse("This payment method is not supported yet. Please use Khalti.", 400);
  }

  // For now, we'll use a placeholder studentId
  // In a real app, this would come from the session
  const studentId = "placeholder-student-id";

  const existing = await prisma.enrollment.findFirst({
    where: {
      studentId,
      courseId,
      enrollmentStatus: "Approved",
    },
  });

  if (existing) {
    return errorResponse("Student is already enrolled in this course", 409);
  }

  const courseData = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!courseData) {
    return errorResponse("Course not found", 404);
  }

  const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;
  const base_url = process.env.NEXT_APP_URL;

  if (!khaltiSecretKey || !base_url) {
    return errorResponse("Payment gateway is not configured", 500);
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      studentId,
      courseId,
      whatsapp: whatsApp || undefined,
    },
  });

  let payment_url: string | undefined;

  if (paymentMethod === "khalti") {
    const data = {
      return_url: `${base_url}/student/courses`,
      website_url: `${base_url}`,
      amount: Math.round(courseData.price * 100),
      purchase_order_id: enrollment.id,
      purchase_order_name: courseData.title,
    };

    try {
      const res = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: `key ${khaltiSecretKey}`,
          },
        }
      );

      payment_url = res.data.payment_url;

      await prisma.payment.create({
        data: {
          enrollmentId: enrollment.id,
          amount: courseData.price,
          paymentMethod: "khalti",
          pidx: res.data.pidx as string,
        },
      });
    } catch {
      await prisma.enrollment.delete({
        where: { id: enrollment.id },
      });
      return errorResponse("Failed to initiate payment. Please try again.", 502);
    }
  }

  return successResponse("Enrollment created successfully", { enrollment, payment_url }, 201);
});

export const getEnrollment = tryCatch(async (req: NextRequest, id: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
  });

  if (!enrollment) {
    return errorResponse("Enrollment not found", 404);
  }

  const populatedEnrollments = await populateStudents([enrollment]);

  return successResponse("Successfully fetched enrollment", populatedEnrollments?.[0] || enrollment, 200);
});

export const deleteEnrollment = tryCatch(async (req: NextRequest, id: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
  });

  if (!enrollment) {
    return errorResponse("Enrollment not found", 404);
  }

  await prisma.enrollment.delete({
    where: { id },
  });

  return successResponse("Enrollment successfully deleted", null, 200);
});

export const changeEnrollmentStatus = tryCatch(async (req: NextRequest, id: string) => {
  const body = await req.json();
  const parsed = enrollmentStatusSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid enrollment status", 400);
  }

  const updatedEnrollment = await prisma.enrollment.update({
    where: { id },
    data: {
      enrollmentStatus: parsed.data.enrollmentStatus,
    },
    include: {
      course: true,
    },
  });

  const populatedEnrollments = await populateStudentObj(updatedEnrollment);

  return successResponse("Enrollment status updated successfully", populatedEnrollments, 200);
});
