import { NextRequest } from "next/server";
import { createEnrollment, getEnrollments } from "./enrollment.controller";

export async function GET(req: NextRequest) {
  return getEnrollments(req);
}

export async function POST(req: NextRequest) {
  return createEnrollment(req);
}
