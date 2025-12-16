import { z } from "zod";

/**
 * Base lesson fields (reusable)
 */
const lessonBaseSchema = {
  courseId: z.string().length(24, "Invalid course ID"),
  title: z.string().trim().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters long")
    .optional(),
  videoUrl: z.string().trim().url("Invalid video URL").optional(),
};

/**
 * CREATE lesson schema
 * → All required fields enforced
 */
export const lessonCreateSchema = z.object({
  ...lessonBaseSchema,
});

/**
 * UPDATE lesson schema
 * → All fields optional (PATCH behavior)
 */
export const lessonUpdateSchema = z.object({
  courseId: z.string().length(24).optional(),
  title: z.string().trim().min(3).optional(),
  description: z.string().trim().min(5).optional(),
  videoUrl: z.string().trim().url().optional(),
});
