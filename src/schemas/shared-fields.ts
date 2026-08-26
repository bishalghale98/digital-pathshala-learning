import { z } from "zod";

export const slugField = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(150, "Slug must be less than 150 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and can contain hyphens");

export const courseIdField = z.string().length(24, "Invalid course ID");

export const nameField = (label = "Name") =>
  z
    .string()
    .min(2, `${label} must be at least 2 characters`)
    .max(50, `${label} must be less than 50 characters`);
