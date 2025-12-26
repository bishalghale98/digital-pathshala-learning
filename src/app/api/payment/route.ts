import { NextRequest } from "next/server";
import { getPaymentDetail } from "./verify.controller";

export async function GET(req: NextRequest) {
  return getPaymentDetail(req);
}
