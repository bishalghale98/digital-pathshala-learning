import { baseApi } from "../api/base";
import type { Lesson } from "../lesson/lessonApi";
import type { Course } from "../course/courseApi";
import type { EnrollmentStatus } from "@/types/models";

export interface StudentUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface MyCourse {
  _id: string;
  courseId: Course | string;
  enrolledAt: string;
  enrollmentStatus: EnrollmentStatus;
}

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<StudentUser[], void>({
      query: () => "students",
      transformResponse: (res: { data: StudentUser[] }) => res.data,
      providesTags: ["Student"],
    }),
    getMyCourses: builder.query<MyCourse[], void>({
      query: () => "students/my-course",
      transformResponse: (res: { data?: MyCourse[] }) => res.data ?? [],
      providesTags: [{ type: "MyCourse", id: "LIST" }],
    }),
    getStudentLessons: builder.query<Lesson[], string>({
      query: (courseId) => `students/lessons?courseId=${courseId}`,
      transformResponse: (res: { data: Lesson[] }) => res.data,
      providesTags: (_r, _e, courseId) => [{ type: "Lesson", id: courseId }],
    }),
  }),
});

export const { useGetStudentsQuery, useGetMyCoursesQuery, useGetStudentLessonsQuery } = studentApi;
