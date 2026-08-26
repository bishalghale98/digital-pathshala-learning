import { z } from "zod";
import { slugField } from "./shared-fields";

export const courseStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  slug: slugField.optional(),

  shortDescription: z
    .string()
    .trim()
    .max(200, "Short description must be less than 200 characters")
    .optional(),

  description: z
    .string()
    .min(1, "Description is required"),

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

  thumbnail: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  whatsappGroupLink: z
    .string()
    .trim()
    .url("WhatsApp group link must be a valid URL")
    .optional()
    .or(z.literal("")),

  keywords: z
    .string()
    .trim()
    .max(500, "Keywords must be less than 500 characters")
    .optional(),

  status: courseStatusEnum.optional(),

  categoryId: z.array(z.string().min(1)).min(1, "At least one category is required"),
});
