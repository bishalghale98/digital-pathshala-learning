import { baseApi } from "../api/base";
import type { Category } from "../category/categoryApi";

export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  thumbnail?: string | null;
  duration: string;
  price: number;
  isFree: boolean;
  categoryId: Category | string;
  subcategoryId?: Category | string | null;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export type CoursePayload = {
  title: string;
  description: string;
  shortDescription?: string | null;
  duration: string;
  price: number;
  isFree?: boolean;
  categoryId: string;
  subcategoryId?: string | null;
  status?: CourseStatus;
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
