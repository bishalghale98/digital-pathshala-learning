import { NextRequest } from "next/server";
import { getPaymentDetail } from "./verify.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../middleware/auth.middleware";

export async function GET(req: NextRequest) {


  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }

  return getPaymentDetail(req);
}
