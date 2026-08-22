import dbConnect from "@/database/dbConnection";
import Payment from "@/database/models/payment.schema";
import { auth } from "@/lib/auth";
import { Roles } from "@/lib/constants";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const paymentVerification = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const { pidx } = await req.json();

  if (!pidx || typeof pidx !== "string") {
    return errorResponse("pidx is required", 400);
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return errorResponse("Unauthorized: Please login", 401);
  }

  const payment = await Payment.findOne({ pidx }).populate("enrollment");

  if (!payment) {
    return errorResponse("Payment record not found for this pidx", 404);
  }

  // Ownership check: students may only verify their own payments
  const enrollment = payment.enrollment as {
    studentId?: { toString(): string };
  } | null;

  if (
    session.user.role !== Roles.Admin &&
    (!enrollment ||
      !enrollment.studentId ||
      enrollment.studentId.toString() !== session.user.id)
  ) {
    return errorResponse("You are not allowed to verify this payment", 403);
  }

  const res = await axios.post(
    "https://dev.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
      },
    }
  );

  const { status, transaction_id, total_amount } = res.data;

  const updatedPayment = await Payment.findByIdAndUpdate(
    payment._id,
    { status, transactionId: transaction_id, amount: total_amount / 100 },
    { new: true }
  );

  return successResponse(`Payment ${String(status).toLowerCase()}`, {
    status,
    transactionId: transaction_id,
    amount: total_amount / 100,
    payment: updatedPayment,
  });
});

export const getPaymentDetail = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const url = new URL(req.url);
  const enrollment = url.searchParams.get("enrollmentId");

  if (!enrollment) {
    return errorResponse("enrollmentId query parameter is required", 400);
  }

  const res = await Payment.findOne({
    enrollment,
  }).populate("enrollment");

  if (!res) {
    return errorResponse("Payment not found for this enrollment", 404);
  }

  return successResponse("Payment detail fetched successfully", res);
});
