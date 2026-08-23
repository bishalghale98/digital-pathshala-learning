import { baseApi } from "../api/base";
import type { Course } from "../course/courseApi";

export interface PublicCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parent?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  subcategories?: PublicCategory[];
}

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
    getPublicCategories: builder.query<PublicCategory[], void>({
      query: () => "public/category",
      transformResponse: (res: { data: PublicCategory[] }) => res.data,
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
