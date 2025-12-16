import { NextRequest } from "next/server";
import { createLessons, getLessons } from "./lesson.controller";

export async function GET(req: NextRequest) {
  return getLessons(req);
}


export async function POST(req: NextRequest) {
  return createLessons(req);
}