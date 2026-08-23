import { NextRequest } from "next/server";
import {
  toggleLessonCompletion,
  updateLastAccessed,
} from "@/server/modules/user/progress.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../../middleware/auth.middleware";

export async function POST(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }

  return toggleLessonCompletion(req);
}

export async function PATCH(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }

  return updateLastAccessed(req);
}
