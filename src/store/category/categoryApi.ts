import { baseApi } from "../api/base";

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  parent?: { _id: string; name: string; slug?: string } | null;
  subcategories?: Category[];
  createdAt: string;
}

type CategoryPayload = { name: string; slug?: string; parent?: string | null };

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "category",
      transformResponse: (res: { data: Category[] }) => res.data,
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
