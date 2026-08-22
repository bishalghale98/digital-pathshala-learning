import { baseApi } from "../api/base";
import { EnrollmentStatus, PaymentMethod } from "@/types/models";
import type { Course } from "../course/courseApi";
import type { StudentUser } from "../student/studentApi";

export interface Enrollment {
  _id: string;
  studentId: StudentUser | string;
  courseId: Course | string;
  enrolledAt: string;
  enrollmentStatus: EnrollmentStatus;
  whatsapp?: string;
  createdAt?: string;
}

export type CreateEnrollmentPayload = {
    courseId: string;
    whatsApp: string;
    paymentMethod?: PaymentMethod;
};

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnrollments: builder.query<Enrollment[], void>({
      query: () => "enrollment",
      transformResponse: (res: { data: Enrollment[] }) => res.data,
      providesTags: [{ type: "Enrollment", id: "LIST" }],
    }),
    createEnrollment: builder.mutation<
      { enrollment: Enrollment; payment_url: string },
      CreateEnrollmentPayload
    >({
      query: (body) => ({ url: "enrollment", method: "POST", body }),
      transformResponse: (res: { data: { enrollment: Enrollment; payment_url: string } }) =>
        res.data,
      invalidatesTags: [{ type: "Enrollment", id: "LIST" }],
    }),
    changeEnrollmentStatus: builder.mutation<
      Enrollment,
      { id: string; body: { enrollmentStatus: EnrollmentStatus } }
    >({
      query: ({ id, body }) => ({ url: `enrollment/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Enrollment", "MyCourse"],
    }),
    deleteEnrollment: builder.mutation<unknown, string>({
      query: (id) => ({ url: `enrollment/${id}`, method: "DELETE" }),
      invalidatesTags: ["Enrollment", "MyCourse"],
    }),
  }),
});

export const {
  useGetEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useChangeEnrollmentStatusMutation,
  useDeleteEnrollmentMutation,
} = enrollmentApi;
