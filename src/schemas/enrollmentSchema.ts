import { z } from "zod";
import { EnrollmentStatus, PaymentMethod } from "@/types/models";

// Re-exported for convenience - types/models is the single source of truth
export { EnrollmentStatus };

export const enrollmentCreateSchema = z.object({
  courseId: z.string().length(24, "Invalid course ID"),

  whatsApp: z
    .string()
    .min(10, "WhatsApp number is required")
    .regex(/^[0-9]+$/, "Invalid WhatsApp number"),

  paymentMethod: z.enum([PaymentMethod.Esewa, PaymentMethod.Khalti]),
});

export const enrollmentUpdateSchema = z.object({
  whatsApp: z.string().optional(),
});

export const enrollmentStatusSchema = z.object({
  enrollmentStatus: z.enum([
    EnrollmentStatus.Approved,
    EnrollmentStatus.Pending,
    EnrollmentStatus.Rejected,
  ]),
});
