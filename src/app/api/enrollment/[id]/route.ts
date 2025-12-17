import { NextRequest } from "next/server";
import {
  deleteEnrollment,
  getEnrollment,
  changeEnrollmentStatus,
} from "../enrollment.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return getEnrollment(req, id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteEnrollment(req, id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return changeEnrollmentStatus(req, id);
}
