import dbConnect from "@/database/dbConnection";
import Category from "@/database/models/category.schema";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import {
  categoryUpdateSchema,
} from "@/schemas/categorySchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getCategory = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid category ID", 400);
  }

  const category = await Category.findById(id);

  if (!category) {
    return errorResponse("Category not found with that ID", 404);
  }

  return successResponse("Category has been found", category, 200);
});

export const deleteCategory = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid category ID", 400);
  }

  const deleted = await Category.findByIdAndDelete(id);

  if (!deleted) {
    return errorResponse("Category not found with that ID", 404);
  }

  return successResponse("Category deleted successfully", null, 200);
});

export const updateCategory = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid category ID", 400);
  }

  const body = await req.json();
  const parsed = categoryUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid category data", 400);
  }

  const { name, slug } = parsed.data;

  if (name) {
    const duplicate = await Category.findOne({
      name,
      _id: { $ne: id },
    });

    if (duplicate) {
      return errorResponse("Category with this name already exists", 409);
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
    },
    { new: true }
  );

  if (!updatedCategory) {
    return errorResponse("Category not found with that ID", 404);
  }

  return successResponse(
    "Category has been updated successfully",
    updatedCategory,
    200
  );
});
