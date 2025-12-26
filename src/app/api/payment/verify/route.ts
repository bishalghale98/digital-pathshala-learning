// /app/api/payment/verify/route.ts
import { NextRequest } from "next/server";
import { paymentVerification } from "../verify.controller";

export const POST = async (req: NextRequest) => {
  return paymentVerification(req);
};
