import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long"),

  duration: z.string().trim().min(1, "Duration is required"),

  price: z.number().positive("Price must be a positive number"),

  categoryId: z.string().length(24, "Invalid category ID"),
});
