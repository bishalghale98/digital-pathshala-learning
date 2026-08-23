import dbConnect from "@/database/dbConnection";
import Course from "@/database/models/course.schema";
import Category from "@/database/models/category.schema";
import Lesson from "@/database/models/lesson.schema";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import { generateSlug } from "@/lib/helper/generateSlug";
import { createCourseSchema } from "@/schemas/courseSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getCourse = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid course ID", 400);
  }

  const course = await Course.findById(id)
    .populate("categoryId")
    .populate("subcategoryId")
    .lean();

  if (!course) {
    return errorResponse("Course not found", 404);
  }

  return successResponse("Course fetched successfully", course, 200);
});

export const deleteCourse = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid course ID", 400);
  }

  const course = await Course.findById(id);
  if (!course) {
    return errorResponse("Course not found", 404);
  }

  await Promise.all([
    Course.findByIdAndDelete(id),
    Lesson.deleteMany({ courseId: id }),
  ]);

  return successResponse("Course deleted successfully", null, 200);
});

export const updateCourse = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid course ID", 400);
  }

  const body = await req.json();

  const parsed = createCourseSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid course data", 400);
  }

  const { categoryId, subcategoryId, title } = parsed.data;

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

  // Check for duplicate title (excluding current course)
  const existingCourse = await Course.findOne({
    _id: { $ne: id },
    title: { $regex: new RegExp(`^${title}$`, "i") },
  });
  if (existingCourse) {
    return errorResponse("A course with this title already exists", 409);
  }

  // Regenerate slug if title changed
  const currentCourse = await Course.findById(id);
  let slug = currentCourse?.slug || generateSlug(title);
  if (currentCourse && currentCourse.title !== title) {
    slug = generateSlug(title);
    const existingSlug = await Course.findOne({ _id: { $ne: id }, slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    { ...parsed.data, slug, subcategoryId: subcategoryId || null },
    { new: true }
  )
    .populate("categoryId")
    .populate("subcategoryId");

  if (!updatedCourse) {
    return errorResponse("Course not found", 404);
  }

  return successResponse("Course updated successfully", updatedCourse, 200);
});
