import { ObjectId } from "mongodb";
import dbConnect from "@/database/dbConnection";
import Course from "@/database/models/course.schema";
import Enrollment from "@/database/models/enrollment.schema";
import Payment from "@/database/models/payment.schema";
import { auth, db } from "@/lib/auth";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import {
  enrollmentCreateSchema,
  enrollmentStatusSchema,
} from "@/schemas/enrollmentSchema";
import { EnrollmentStatus, PaymentMethod } from "@/types/models";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { populateStudentObj, populateStudents } from "./helper.controller";

export const getEnrollments = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const enrollments = await Enrollment.find()
    .populate("courseId")
    .sort({ createdAt: -1 })
    .lean();

  // Populate studentId from Better Auth
  const populatedEnrollments = await populateStudents(enrollments);

  return successResponse(
    "Successfully fetched enrollments",
    populatedEnrollments,
    200
  );
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

  const existing = await Enrollment.findOne({
    studentId,
    courseId,
    enrollmentStatus: EnrollmentStatus.Approved,
  });
  if (existing) {
    return errorResponse("Student is already enrolled in this course", 409);
  }

  const enrollment = await Enrollment.create({
    studentId,
    courseId,
    whatsapp: whatsApp,
    enrolledAt: new Date(),
  });

  const courseData = await Course.findById(courseId);

  let payment_url;

  if (paymentMethod === PaymentMethod.Khalti) {
    const data = {
      return_url: "http://localhost:3000/student/courses",
      website_url: "http://localhost:3000/",
      amount: courseData.price * 100,
      purchase_order_id: enrollment._id,
      purchase_order_name: courseData.title,
    };

    const res = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      data,
      {
        headers: {
          Authorization: "key b540a86f2796459683b81cdaf2cf30c9",
        },
      }
    );

    payment_url = res.data.payment_url;

    const pidx = res.data.pidx;

    console.log(pidx, "pidx enroll ma");

    const createdPayment = await Payment.create({
      enrollment: enrollment._id,
      amount: courseData.price,
      paymentMethod,
      pidx: pidx,
    });

    console.log(createdPayment, "payment create vayo");
  } else {
    // TODO ....
  }

  return successResponse(
    "Enrollment created successfully",
    { enrollment, payment_url },
    201
  );
});

export const getEnrollment = tryCatch(async (_req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid enrollment ID", 400);
  }

  const enrollment = await Enrollment.findById(id)
    .populate("courseId", "title description")
    .lean();

  const populatedEnrollments = await populateStudents(enrollment);

  if (!populatedEnrollments) {
    return errorResponse("Enrollment not found", 404);
  }

  return successResponse(
    "Successfully fetched enrollment",
    populatedEnrollments,
    200
  );
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
      }
    )
      .populate("courseId")
      .lean();

    const populatedEnrollments = await populateStudentObj(updatedEnrollment);

    console.log(populatedEnrollments);

    if (!populatedEnrollments) {
      return errorResponse("Enrollment not found", 404);
    }

    return successResponse(
      "Enrollment status updated successfully",
      populatedEnrollments,
      200
    );
  }
);
