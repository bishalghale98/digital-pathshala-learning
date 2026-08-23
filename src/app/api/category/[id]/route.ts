import { NextRequest } from "next/server";
import {
  deleteCategory,
  getCategory,
  updateCategory,
} from "@/server/modules/categories/category.controller";
import { Roles } from "@/lib/constants";
import { authMiddleware } from "../../../../../middleware/auth.middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin, Roles.Student]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }

  const { id } = await params;

  return getCategory(req, id);
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
  return deleteCategory(req, id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);

  if (checkAuth.status !== 200) {
    return checkAuth;
  }
  const { id } = await params;
  return updateCategory(req, id);
}
