import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Category", "Course", "Lesson", "Enrollment", "Student", "MyCourse", "Payment"],
  endpoints: () => ({}),
});

type ApiError = {
  status?: number | string;
  data?: { message?: string };
};

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as ApiError).data;
    if (data?.message) return data.message;
  }
  return "Something went wrong";
}
