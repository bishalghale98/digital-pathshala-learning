import z from "zod";

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

export const categoryUpdateSchema = z
  .object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name must be less than 50 characters")
      .optional(),
    description: z
      .string()
      .max(200, "Description must be less than 200 characters")
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field (name or description) is required",
  });
