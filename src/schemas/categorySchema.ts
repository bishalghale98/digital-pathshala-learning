import z from "zod";

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  image: z
    .string()
    .max(500, "Image URL must be less than 500 characters")
    .optional()
    .nullable(),
  parent: z
    .string()
    .length(24, "Invalid parent category ID")
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().min(0, "Sort order cannot be negative").optional(),
});

export const categoryUpdateSchema = z
  .object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name must be less than 100 characters")
      .optional(),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional()
      .nullable(),
    image: z
      .string()
      .max(500, "Image URL must be less than 500 characters")
      .optional()
      .nullable(),
    parent: z
      .string()
      .length(24, "Invalid parent category ID")
      .optional()
      .nullable(),
    isActive: z.boolean().optional(),
    sortOrder: z
      .number()
      .min(0, "Sort order cannot be negative")
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.image !== undefined ||
      data.parent !== undefined ||
      data.isActive !== undefined ||
      data.sortOrder !== undefined,
    {
      message: "At least one field must be provided for update",
    }
  );
