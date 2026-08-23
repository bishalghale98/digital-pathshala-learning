import { baseApi } from "../api/base";
import type { Course } from "../course/courseApi";

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  courseId: Course | string;
  createdAt: string;
}

export type LessonPayload = {
  title: string;
  description?: string;
  videoUrl: string;
  courseId: string;
};

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessonsByCourse: builder.query<Lesson[], string>({
      query: (courseId) => `lesson/course/${courseId}`,
      transformResponse: (res: { data: Lesson[] }) => res.data,
      providesTags: (_r, _e, courseId) => [{ type: "Lesson", id: courseId }],
    }),
    createLesson: builder.mutation<Lesson, LessonPayload>({
      query: (body) => ({ url: "lesson", method: "POST", body }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Lesson", id: arg.courseId }, "Course"],
    }),
    updateLesson: builder.mutation<Lesson, Partial<LessonPayload> & { id: string; courseId: string }>(
      {
        query: ({ id, ...body }) => ({ url: `lesson/${id}`, method: "PATCH", body }),
        invalidatesTags: (_r, _e, { courseId }) => [{ type: "Lesson", id: courseId }, "Course"],
      }
    ),
    deleteLesson: builder.mutation<unknown, { id: string; courseId: string }>({
      query: ({ id }) => ({ url: `lesson/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: "Lesson", id: courseId }, "Course"],
    }),
  }),
});

export const {
  useGetLessonsByCourseQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
