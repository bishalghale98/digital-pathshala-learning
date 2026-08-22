import dbConnect from "@/database/dbConnection";
import Lesson from "@/database/models/lesson.schema";
import { isValidObjectId } from "@/lib/helper/isValidObjectId";
import { lessonCreateSchema, lessonUpdateSchema } from "@/schemas/lessonSchema";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getLessons = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const lessons = await Lesson.find()
    .populate("courseId")
    .sort({ createdAt: -1 })
    .lean();

  return successResponse("Successfully fetched lessons", lessons, 200);
});

export const createLesson = tryCatch(async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();
  const parsed = lessonCreateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid lesson data", 400);
  }

  const lesson = await Lesson.create(parsed.data);

  const populatedLesson = await Lesson.findById(lesson._id).populate(
    "courseId"
  );

  return successResponse("Lesson created successfully", populatedLesson, 201);
});

export const getLesson = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid lesson ID", 400);
  }

  const lesson = await Lesson.findById(id).populate("courseId").lean();

  if (!lesson) {
    return errorResponse("Lesson with that ID not found", 404);
  }

  return successResponse("Successfully fetched lesson", lesson, 200);
});

export const deleteLesson = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid lesson ID", 400);
  }

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    return errorResponse("Lesson with that ID not found", 404);
  }

  await Lesson.findByIdAndDelete(id);

  return successResponse("Lesson successfully deleted", null, 200);
});

export const updateLesson = tryCatch(async (req: NextRequest, id: string) => {
  await dbConnect();

  if (!isValidObjectId(id)) {
    return errorResponse("Invalid lesson ID", 400);
  }

  const body = await req.json();
  const parsed = lessonUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid lesson data", 400);
  }

  const updatedLesson = await Lesson.findByIdAndUpdate(id, parsed.data, {
    new: true,
  })
    .lean()
    .populate("courseId");

  if (!updatedLesson) {
    return errorResponse("Lesson with that ID not found", 404);
  }

  return successResponse("Lesson successfully updated", updatedLesson, 200);
});
