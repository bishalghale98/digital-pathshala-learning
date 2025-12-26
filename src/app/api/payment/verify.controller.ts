import dbConnect from "@/database/dbConnection";
import Payment from "@/database/models/payment.schema";
import { tryCatch } from "@/utils/tryCatch";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const paymentVerification = tryCatch(async (req: NextRequest) => {
  const { pidx } = await req.json();

  const res = await axios.post(
    "https://dev.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: "key b540a86f2796459683b81cdaf2cf30c9",
      },
    }
  );

  const { status, transaction_id, total_amount } = res.data;

  console.log(status, "status");

  await Payment.findOneAndUpdate(
    { pidx },
    { status, transactionId: transaction_id, amount: total_amount }
  );

  return NextResponse.json({ success: true, data: res.data });
});

export const getPaymentDetail = tryCatch(async (req: NextRequest) => {
  await dbConnect();
  const url = new URL(req.url);
  const enrollment = url.searchParams.get("enrollmentId");

  const res = await Payment.findOne({
    enrollment,
  }).populate("enrollment");

  return Response.json({
    res,
    message: "running",
  });
});
