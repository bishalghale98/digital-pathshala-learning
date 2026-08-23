import { NextRequest } from "next/server";
import { paymentVerification } from "@/server/modules/payment/verify.controller";
import { authMiddleware } from "../../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";

export const POST = async (req: NextRequest) => {

   const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }

  return paymentVerification(req);
};
