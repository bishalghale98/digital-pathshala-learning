import z from "zod";
import { slugField, nameField } from "./shared-fields";

export const categoryCreateSchema = z.object({
  name: nameField("Category name"),
  slug: slugField,
  description: z.string().optional(),
  parent: z.string().optional(),
});

export const categoryUpdateSchema = z
  .object({
    name: nameField("Category name").optional(),
    slug: slugField.optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.slug !== undefined, {
    message: "At least one field (name or slug) is required",
  });
