import { baseApi } from "../api/base";
import type { Category } from "../category/categoryApi";

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  categoryId: Category | string;
  createdAt: string;
}

export type CoursePayload = {
  title: string;
  description: string;
  duration: string | number;
  price: number;
  categoryId: string;
};

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //get all courses
    getCourses: builder.query<Course[], void>({
      query: () => "course",
      transformResponse: (res: { data: Course[] }) => res.data,
      providesTags: [{ type: "Course", id: "LIST" }],
    }),
    // create course
    createCourse: builder.mutation<Course, CoursePayload>({
      query: (body) => ({ url: "course", method: "POST", body }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    // update course
    updateCourse: builder.mutation<Course, CoursePayload & { id: string }>({
      query: ({ id, ...body }) => ({ url: `course/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Course", id },
        { type: "Course", id: "LIST" },
        "Lesson",
        "Enrollment",
        "MyCourse",
      ],
    }),
    // delete course
    deleteCourse: builder.mutation<unknown, string>({
      query: (id) => ({ url: `course/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Course", id: "LIST" }, "Lesson", "Enrollment", "MyCourse"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
