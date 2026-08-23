import { z } from "zod";

export const courseStatusEnum = z.enum(["draft", "published", "archived"]);

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
    .max(2000, "Description must be less than 2000 characters"),

  shortDescription: z
    .string()
    .trim()
    .max(300, "Short description must be less than 300 characters")
    .nullable()
    .optional(),

  duration: z
    .string()
    .trim()
    .regex(
      /^[\d\s]+(?:weeks?|months?|days?|hours?)$/i,
      'Please enter a valid duration (e.g., "8 weeks")'
    ),

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(100000, "Price must be less than 100,000"),

  isFree: z.boolean().default(false),

  categoryId: z
    .string()
    .length(24, "Invalid category ID")
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid category ID format"),

  subcategoryId: z
    .string()
    .length(24, "Invalid subcategory ID")
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^[0-9a-fA-F]{24}$/.test(val),
      "Invalid subcategory ID format"
    ),

  status: courseStatusEnum.default("draft"),
});
