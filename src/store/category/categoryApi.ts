import { baseApi } from "../api/base";

export interface CategoryChild {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
}

export interface CategoryTree {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  children?: CategoryChild[];
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  parent?: { id: string; name: string; slug?: string } | null;
  _count?: { children: number };
  createdAt: string;
}

type CategoryPayload = { name: string; slug?: string; description?: string; parent?: string | null };

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryTree[], void>({
      query: () => "category",
      transformResponse: (res: { data: CategoryTree[] }) => res.data,
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
    createCategory: builder.mutation<Category, CategoryPayload>({
      query: (body) => ({ url: "category", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }, "Course"],
    }),
    updateCategory: builder.mutation<Category, CategoryPayload & { id: string }>({
      query: ({ id, ...body }) => ({ url: `category/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        "Course",
      ],
    }),
    deleteCategory: builder.mutation<unknown, string>({
      query: (id) => ({ url: `category/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Category", id: "LIST" }, "Course"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
