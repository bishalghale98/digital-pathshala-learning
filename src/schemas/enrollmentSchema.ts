import { z } from "zod";

export enum EnrollmentStatus {
  Approved = "Approved",
  Pending = "Pending",
  Rejected = "Rejected",
}

const objectIdSchema = z.string().length(24);

const enrollmentBase = {
  courseId: objectIdSchema,

  enrollmentStatus: z
    .enum([
      EnrollmentStatus.Approved,
      EnrollmentStatus.Pending,
      EnrollmentStatus.Rejected,
    ])
    .optional(),
  whatsapp: z.string().trim().optional(),
};

export const enrollmentCreateSchema = z.object({
  courseId: enrollmentBase.courseId,
  whatsapp: enrollmentBase.whatsapp,
});

export const enrollmentUpdateSchema = z.object({
  courseId: enrollmentBase.courseId.optional(),
  whatsapp: enrollmentBase.whatsapp.optional(),
});

export const enrollmentStatusSchema = z.object({
  enrollmentStatus: z.enum([
    EnrollmentStatus.Approved,
    EnrollmentStatus.Pending,
    EnrollmentStatus.Rejected,
  ]),
});
