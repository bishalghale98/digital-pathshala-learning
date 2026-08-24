import { baseApi } from "../api/base";
import type { Category } from "../category/categoryApi";

export interface CourseCategory {
  id: string;
  courseId: string;
  categoryId: string;
  category: Category;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  thumbnail?: string;
  duration: string;
  price: number;
  whatsappGroupLink?: string;
  keywords?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categories: CourseCategory[];
  createdAt: string;
  updatedAt: string;
}

export type CoursePayload = {
  title: string;
  slug?: string;
  shortDescription?: string;
  description: string;
  duration: string | number;
  price: number;
  thumbnail?: string;
  whatsappGroupLink?: string;
  keywords?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string[];
};

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //get all courses
    getCourses: builder.query<Course[], void>({
      query: () => "course",
      transformResponse: (res: { data: Course[] }) => {
        return res.data
      },
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
