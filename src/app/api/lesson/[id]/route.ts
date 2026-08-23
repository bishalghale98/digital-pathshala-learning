import { NextRequest } from "next/server";
import { deleteLesson, getLesson, updateLesson } from "@/server/modules/lesson/lesson.controller";
import { authMiddleware } from "../../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }

  const { id } = await params;

  return getLesson(req, id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }

  const { id } = await params;
  return deleteLesson(req, id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }

  const { id } = await params;
  return updateLesson(req, id);
}
