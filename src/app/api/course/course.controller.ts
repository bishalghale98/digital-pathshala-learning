import dbConnect from "@/database/dbConnection";
import Course from "@/database/models/course.schema";
import Category from "@/database/models/category.schema";
import { createCourseSchema } from "@/schemas/courseSchema";
import { generateSlug } from "@/lib/helper/generateSlug";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const createCourse = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();

  const parsed = createCourseSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid course data", 400);
  }

  const { title, categoryId, subcategoryId } = parsed.data;

  // Validate category exists
  if (!isValidObjectId(categoryId)) {
    return errorResponse("Invalid category ID", 400);
  }
  const category = await Category.findById(categoryId);
  if (!category) {
    return errorResponse("Category not found", 404);
  }

  // Validate subcategory if provided
  if (subcategoryId) {
    if (!isValidObjectId(subcategoryId)) {
      return errorResponse("Invalid subcategory ID", 400);
    }
    const subcategory = await Category.findById(subcategoryId);
    if (!subcategory) {
      return errorResponse("Subcategory not found", 404);
    }
    if (subcategory.parent?.toString() !== categoryId) {
      return errorResponse(
        "Subcategory does not belong to the selected category",
        400
      );
    }
  }

  // Generate unique slug
  let slug = generateSlug(title);
  const existingSlug = await Course.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  // Prevent duplicate titles
  const existingCourse = await Course.findOne({
    title: { $regex: new RegExp(`^${title}$`, "i") },
  });
  if (existingCourse) {
    return errorResponse("A course with this title already exists", 409);
  }

  const createdData = await Course.create({
    ...parsed.data,
    slug,
    subcategoryId: subcategoryId || null,
  });

  const course = await Course.findById(createdData._id)
    .populate("categoryId")
    .populate("subcategoryId");

  return successResponse("Course created successfully", course, 201);
});

export const getCourses = tryCatch(async (req) => {
  await dbConnect();

  const courses = await Course.find()
    .populate("categoryId")
    .populate("subcategoryId")
    .sort({ createdAt: -1 })
    .lean();

  return successResponse("Courses fetched successfully", courses, 200);
});
