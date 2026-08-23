import dbConnect from "@/database/dbConnection";
import Category from "@/database/models/category.schema";
import { categoryCreateSchema } from "@/schemas/categorySchema";
import { generateSlug } from "@/lib/helper/generateSlug";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const createCategory = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();

  const parsed = categoryCreateSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid category data";
    return errorResponse(firstError, 400);
  }

  const { name, description, image, parent, isActive, sortOrder } = parsed.data;

  const trimmedName = name.trim();
  const slug = generateSlug(trimmedName);

  if (parent) {
    const parentCategory = await Category.findById(parent);

    if (!parentCategory) {
      return errorResponse("Parent category not found", 404);
    }

    if (parentCategory.parent) {
      return errorResponse(
        "Cannot create a subcategory under another subcategory. Only two levels are allowed.",
        400
      );
    }
  }

  const existingCategory = await Category.findOne({
    slug,
    parent: parent || null,
  });

  if (existingCategory) {
    return errorResponse(
      parent
        ? "A subcategory with this name already exists under the selected parent"
        : "A category with this name already exists",
      409
    );
  }

  const category = await Category.create({
    name: trimmedName,
    slug,
    description: description?.trim() || null,
    image: image?.trim() || null,
    parent: parent || null,
    isActive: isActive !== undefined ? isActive : true,
    sortOrder: sortOrder || 0,
  });

  return successResponse("Category created successfully", category, 201);
});

export const getCategories = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const categories = await Category.find()
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  return successResponse("List of all categories", categories, 200);
});
