import { getCourses } from "@/server/modules/course/course.controller";

export async function GET() {
  return getCourses();
}
