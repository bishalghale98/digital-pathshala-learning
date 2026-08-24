import { baseApi } from "../api/base";
import type { Course } from "../course/courseApi";
import type { CategoryTree } from "../category/categoryApi";

export interface PlatformStats {
  courses: number;
  categories: number;
}

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicCourses: builder.query<Course[], void>({
      query: () => "public/course",
      transformResponse: (res: { data: Course[] }) => res.data,
    }),
    getPublicCategories: builder.query<CategoryTree[], void>({
      query: () => "public/category",
      transformResponse: (res: { data: CategoryTree[] }) => res.data,
    }),
    getPublicStats: builder.query<PlatformStats, void>({
      query: () => "public/stats",
      transformResponse: (res: { data: PlatformStats }) => res.data,
    }),
  }),
});

export const {
  useGetPublicCoursesQuery,
  useGetPublicCategoriesQuery,
  useGetPublicStatsQuery,
} = publicApi;
