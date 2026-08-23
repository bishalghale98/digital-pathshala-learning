import dbConnect from "@/database/dbConnection";
import Category from "@/database/models/category.schema";
import { categoryCreateSchema } from "@/schemas/categorySchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const createCategory = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();

  const parsed = categoryCreateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid category data", 400);
  }

  const { name, slug } = parsed.data;

  const trimmedName = name.trim();

  const existCategory = await Category.findOne({ name: trimmedName });

  if (existCategory) {
    return errorResponse("Category already exists with this name", 409);
  }

  const category = await Category.create({
    name: trimmedName,
    slug: slug,
  });

  return successResponse("Category created successfully", category, 201);
});

export const getCategories = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const categories = await Category.find().sort({ createdAt: -1 }).lean();

  return successResponse("List of all categories", categories, 200);
});
