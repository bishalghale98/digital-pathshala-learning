import prisma from "@/database/prisma";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";

import { NextRequest } from "next/server";

export const paymentVerification = tryCatch(async (req: NextRequest) => {
  const { pidx } = await req.json();

  if (!pidx || typeof pidx !== "string") {
    return errorResponse("pidx is required", 400);
  }

  const payment = await prisma.payment.findFirst({
    where: { pidx },
    include: {
      enrollment: true,
    },
  });

  if (!payment) {
    return errorResponse("Payment record not found for this pidx", 404);
  }

  const res = await fetch(
    "https://dev.khalti.com/api/v2/epayment/lookup/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
      },
      body: JSON.stringify({ pidx }),
    }
  );

  if (!res.ok) {
    return errorResponse("Failed to verify payment with Khalti", 502);
  }

  const responseData = await res.json();
  const { status, transaction_id, total_amount } = responseData;

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: status === "Completed" ? "Completed" : status === "Failed" ? "Failed" : "Pending",
      transactionId: transaction_id,
      amount: total_amount / 100,
    },
  });

  return successResponse(`Payment ${String(status).toLowerCase()}`, {
    status,
    transactionId: transaction_id,
    amount: total_amount / 100,
    payment: updatedPayment,
  });
});

export const getPaymentDetail = tryCatch(async (req: NextRequest) => {
  const url = new URL(req.url);
  const enrollmentId = url.searchParams.get("enrollmentId");

  if (!enrollmentId) {
    return errorResponse("enrollmentId query parameter is required", 400);
  }

  const payment = await prisma.payment.findUnique({
    where: { enrollmentId },
    include: {
      enrollment: true,
    },
  });

  if (!payment) {
    return errorResponse("Payment not found for this enrollment", 404);
  }

  return successResponse("Payment detail fetched successfully", payment);
});
