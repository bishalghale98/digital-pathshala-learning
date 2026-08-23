import dbConnect from "@/database/dbConnection";
import Category from "@/database/models/category.schema";
import Course from "@/database/models/course.schema";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import { categoryUpdateSchema } from "@/schemas/categorySchema";
import { generateSlug } from "@/lib/helper/generateSlug";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getCategory = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid category ID", 400);
  }

  const category = await Category.findById(id).lean();

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

  const category = await Category.findById(id);

  if (!category) {
    return errorResponse("Category not found with that ID", 404);
  }

  const subcategories = await Category.countDocuments({ parent: id });

  if (subcategories > 0) {
    return errorResponse(
      "Cannot delete this category because it has subcategories. Remove all subcategories first.",
      400
    );
  }

  const courseCount = await Course.countDocuments({ categoryId: id });

  if (courseCount > 0) {
    return errorResponse(
      "Cannot delete this category because it has courses assigned to it. Reassign or remove those courses first.",
      400
    );
  }

  await Category.findByIdAndDelete(id);

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
    const firstError = parsed.error.issues[0]?.message || "Invalid category data";
    return errorResponse(firstError, 400);
  }

  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    return errorResponse("Category not found with that ID", 404);
  }

  const { name, description, image, parent, isActive, sortOrder } = parsed.data;

  // Prevent self-parenting
  if (parent && parent === id) {
    return errorResponse("A category cannot be its own parent", 400);
  }

  // Validate parent if changing
  if (parent !== undefined) {
    if (parent) {
      const parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return errorResponse("Parent category not found", 404);
      }

      if (parentCategory.parent) {
        return errorResponse(
          "Cannot assign a subcategory as a parent. Only two levels are allowed.",
          400
        );
      }
    }
  }

  const targetParent = parent !== undefined ? (parent || null) : existingCategory.parent;
  const targetSlug = name ? generateSlug(name.trim()) : existingCategory.slug;
  const targetName = name ? name.trim() : existingCategory.name;

  // Check duplicate name/slug under the same parent
  const duplicate = await Category.findOne({
    slug: targetSlug,
    parent: targetParent,
    _id: { $ne: id },
  });

  if (duplicate) {
    return errorResponse(
      "A category with this name already exists under the selected parent",
      409
    );
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      ...(name !== undefined && { name: targetName, slug: targetSlug }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(image !== undefined && { image: image?.trim() || null }),
      ...(parent !== undefined && { parent: parent || null }),
      ...(isActive !== undefined && { isActive }),
      ...(sortOrder !== undefined && { sortOrder }),
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
