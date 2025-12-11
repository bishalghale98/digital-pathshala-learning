import dbConnect from "@/database/dbConnection";
import Category from "@/database/models/category.schema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";
import { authMiddleware } from "../../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";

export const getCategory = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!id || id.length !== 24) {
    return errorResponse("Invalid category ID", 400);
  }

  const category = await Category.findById(id);

  if (!category) {
    return errorResponse("Category not found with that ID", 404);
  }

  return successResponse("Category has been found", category, 200);
});

export const deleteCategroy = tryCatch(async (req: NextRequest, id: string) => {
  const checkAuth = authMiddleware(req, Roles.Admin);

  if (checkAuth) return checkAuth;

  await dbConnect();

  //   mongodo id length is 24 so i check that
  if (!id || id.length !== 24) {
    return errorResponse("Category id is not provided or id is not valid", 400);
  }

  await Category.findByIdAndDelete(id);

  return successResponse("Categroy deleted successfully", null, 200);
});

export const updateCategory = tryCatch(async (req: NextRequest, id: string) => {
  const checkAuth = authMiddleware(req, Roles.Admin);
  if (checkAuth) return checkAuth;

  await dbConnect();

  const { name, description } = await req.json();

  const category = await Category.findById(id);

  if (!category) {
    return errorResponse("Category is not available with that name", 404);
  }

  if (name) {
    category.name = name;
  }

  if (description) {
    category.description = description;
  }

  await category.save();

  const updatedCategory = await Category.findById(id);

  return successResponse(
    "Categroy has been updated successfully",
    updatedCategory,
    200
  );
});
