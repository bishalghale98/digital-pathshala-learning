import { NextRequest } from "next/server";
import {
  deleteEnrollment,
  getEnrollment,
  changeEnrollmentStatus,
} from "../enrollment.controller";
import { authMiddleware } from "../../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }
  const { id } = await params;

  return getEnrollment(req, id);
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
  return deleteEnrollment(req, id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Admin-only: students must never be able to change enrollment status
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }

  const { id } = await params;
  return changeEnrollmentStatus(req, id);
}
