import { NextRequest } from "next/server";
import { getStudents } from "./student.controller";

export async function GET(req: NextRequest) {
  return getStudents(req);
}
