import { NextRequest } from "next/server";
import { deleteCourse, getCourse, updateCourse } from "@/server/modules/course/course.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../../middleware/auth.middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }
  const { id } = await params;

  return getCourse(req, id);
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
  return deleteCourse(req, id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }
  const { id } = await params;
  return updateCourse(req, id);
}
