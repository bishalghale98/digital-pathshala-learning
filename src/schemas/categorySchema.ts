import z from "zod";

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(150, "Slug required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and can contain hyphens"),
  description: z.string().optional(),
  parent: z.string().optional(),
});

export const categoryUpdateSchema = z
  .object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name must be less than 50 characters")
      .optional(),
    slug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(150, "Slug required")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and can contain hyphens")
      .optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.slug !== undefined, {
    message: "At least one field (name or slug) is required",
  });
