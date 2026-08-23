import { NextRequest } from "next/server";
import { createCategory, getCategories } from "@/server/modules/categories/category.controller";
import { authMiddleware } from "../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";

export async function POST(req: NextRequest): Promise<Response> {
  const checkAuth = await authMiddleware(req, Roles.Admin);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }
  return createCategory(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  const checkAuth = await authMiddleware(req, [Roles.Student, Roles.Admin]);

  if (checkAuth.status !== 200) {
    
    return checkAuth;
  }
  return getCategories(req);
}
