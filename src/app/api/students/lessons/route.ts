import { NextRequest } from "next/server";
import { getLessonsWithCourseId } from "./lesson.controller";

export async function GET(req: NextRequest) {
  return getLessonsWithCourseId(req);
}
