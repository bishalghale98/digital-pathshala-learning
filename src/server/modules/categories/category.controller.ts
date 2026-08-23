import prisma from "@/database/prisma";
import { categoryCreateSchema, categoryUpdateSchema } from "@/schemas/categorySchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { Category } from "@prisma/client";
import { NextRequest } from "next/server";

export const createCategory = tryCatch(async (req: NextRequest) => {
  const body = await req.json();

  const parsed = categoryCreateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid category data", 400);
  }

  const { name, slug, parent } = parsed.data;

  const trimmedName = name.trim();

  const existingCategory = await prisma.category.findFirst({
    where: { name: trimmedName },
  });

  if (existingCategory) {
    return errorResponse("Category already exists with this name", 409);
  }

  let parentId: string | undefined = undefined;

  if (parent) {
    const parentCategory = await prisma.category.findUnique({
      where: { id: parent },
    });

    if (!parentCategory) {
      return errorResponse("Parent category not found", 404);
    }

    if (parentCategory.parentId) {
      return errorResponse("Cannot create a subcategory under a subcategory", 400);
    }

    parentId = parentCategory.id;
  }

  const category = await prisma.category.create({
    data: {
      name: trimmedName,
      slug: slug || undefined,
      parentId: parentId || undefined,
    },
  });

  return successResponse("Category created successfully", category, 201);
});

export const getCategories = tryCatch(async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      children: true,
    },
  });

  const parentCategories = categories.filter((c) => !c.parentId);

  const formattedCategories = parentCategories.map((category) => ({
    ...category,
    subcategories: category?.children,
  }));

  return successResponse("List of all categories", formattedCategories, 200);
});

export const getCategory = tryCatch(async (req: NextRequest, id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
    },
  });

  if (!category) {
    return errorResponse("Category not found with that ID", 404);
  }

  return successResponse("Category has been found", category, 200);
});

export const deleteCategory = tryCatch(async (req: NextRequest, id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return errorResponse("Category not found with that ID", 404);
  }

  const hasSubcategories = await prisma.category.findFirst({
    where: { parentId: id },
  });

  if (hasSubcategories) {
    return errorResponse("Cannot delete category because it has subcategories. Delete the subcategories first.", 400);
  }

  await prisma.category.delete({
    where: { id },
  });

  return successResponse("Category deleted successfully", null, 200);
});

export const updateCategory = tryCatch(async (req: NextRequest, id: string) => {
  const body = await req.json();
  const parsed = categoryUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid category data", 400);
  }

  const { name, slug } = parsed.data;

  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return errorResponse("Category not found with that ID", 404);
  }

  const trimmedName = name?.trim();

  if (trimmedName) {
    const duplicate = await prisma.category.findFirst({
      where: {
        name: trimmedName,
        NOT: { id },
      },
    });

    if (duplicate) {
      return errorResponse("Category with this name already exists", 409);
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      ...(trimmedName !== undefined && { name: trimmedName }),
      ...(slug !== undefined && { slug }),
    },
  });

  return successResponse("Category has been updated successfully", updatedCategory, 200);
});
