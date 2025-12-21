import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),

  duration: z
    .string()
    .trim()
    .regex(
      /^[\d\s]+(?:weeks?|months?|days?|hours?)$/i,
      'Please enter a valid duration (e.g., "8 weeks")'
    ),

  price: z
    .number()
    .positive("Price must be a positive number")
    .max(10000, "Price must be less than 10,000"),

  categoryId: z.string().length(24, "Invalid category ID"),
});
