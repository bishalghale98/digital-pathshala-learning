import prisma from "@/database/prisma";
import { enrollmentCreateSchema, enrollmentStatusSchema } from "@/schemas/enrollmentSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";

import { NextRequest } from "next/server";


export const getEnrollments = tryCatch(async () => {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      course: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse("Successfully fetched enrollments", enrollments, 200);
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
      amount: Number(courseData.price),
      purchase_order_id: enrollment.id,
      purchase_order_name: courseData.title,
    };

    try {
      const res = await fetch(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `key ${khaltiSecretKey}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error(`Khalti API error: ${res.status}`);
      }

      const responseData = await res.json();
      payment_url = responseData.payment_url;

      await prisma.payment.create({
        data: {
          enrollmentId: enrollment.id,
          amount: Number(courseData.price),
          paymentMethod: "khalti",
          pidx: responseData.pidx as string,
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

  return successResponse("Successfully fetched enrollment", enrollment, 200);
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

  return successResponse("Enrollment status updated successfully", updatedEnrollment, 200);
});
