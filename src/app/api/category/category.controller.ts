import dbConnect from "@/database/dbConnection";
import Category from "@/database/models/category.schema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";
import { authMiddleware } from "../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";
import { categoryCreateSchema } from "@/schemas/categorySchema";

export const createCategory = tryCatch(async (req: NextRequest) => {
  // const checkAuth = authMiddleware(req, Roles.Admin);

  // if (checkAuth) return checkAuth;

  await dbConnect();
  const body = await req.json();

  const parshed = categoryCreateSchema.safeParse(body);

  if (!parshed.success) {
    console.error("Invalid API data:", parshed.error.issues);
    throw new Error("Invalid data received from API");
  }

  const { name, description } = parshed.data;

  if (!name || !name.trim()) {
    return errorResponse("Name is required", 400);
  }

  const trimmedName = name.trim();

  const existCategory = await Category.findOne({ name: trimmedName });

  if (existCategory) {
    return errorResponse("Category already exists with this name", 409);
  }

  const category = await Category.create({
    name: trimmedName,
    description: description?.trim() || "",
  });

  return successResponse("Category created successfully", category, 201);
});

export const getCategories = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const categories = await Category.find().sort({ createdAt: -1 }).lean();

  if (!categories || categories.length === 0) {
    return errorResponse("No categories found", 404);
  }

  return successResponse("List of all categories", categories, 200);
});
