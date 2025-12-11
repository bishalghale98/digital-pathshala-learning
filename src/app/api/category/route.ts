import { NextRequest } from "next/server";
import { createCategory, getCategories } from "./category.controller";

export async function POST(req: NextRequest): Promise<Response> {
  return createCategory(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  return getCategories(req);
}
