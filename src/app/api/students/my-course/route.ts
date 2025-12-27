import { NextRequest } from "next/server";
import { getMyCourse } from "../student.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../../middleware/auth.middleware";

export async function GET(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  // If checkAuth is a Response, return it (unauthorized/forbidden)
  if (checkAuth.status !== 200) {
    console.log(checkAuth);
    return checkAuth;
  }

  return getMyCourse(req);
}
