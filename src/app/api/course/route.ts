import { NextRequest } from "next/server";
import { createCourse, getCourses } from "./course.controller";

export async function POST(req: NextRequest): Promise<Response> {
  return createCourse(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  return getCourses(req);
}
