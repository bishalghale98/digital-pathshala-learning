"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCourseSchema } from "@/schemas/courseSchema";
import { useGetCategoriesQuery } from "@/store/category/categoryApi";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  type Course,
} from "@/store/course/courseApi";
import { getErrorMessage } from "@/store/api/base";
import { getInputClass } from "@/lib/utils/form";
import { toast } from "sonner";

interface CourseModalProps {
  closeModal: () => void;
  courseData?: Course | null;
}

type CourseFormData = z.input<typeof createCourseSchema>;

const CourseModal: React.FC<CourseModalProps> = ({ closeModal, courseData }) => {
  const isEditMode = !!courseData;

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const { data: categories = [] } = useGetCategoriesQuery();

  const mainCategories = useMemo(
    () => categories.filter((c) => !c.parent),
    [categories]
  );

  const subcategories = useMemo(
    () => categories.filter((c) => c.parent),
    [categories]
  );

  const groupedCategories = useMemo(() => {
    return mainCategories.map((main) => ({
      ...main,
      subs: subcategories.filter((sub) => sub.parent === main._id),
    }));
  }, [mainCategories, subcategories]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<CourseFormData>({
    resolver: zodResolver(createCourseSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      shortDescription: "",
      duration: "",
      price: 0,
      isFree: false,
      categoryId: "",
      subcategoryId: null,
      status: "draft",
    },
  });

  const watchTitle = watch("title");
  const watchCategoryId = watch("categoryId");

  // Filter subcategories based on selected parent category
  const filteredSubcategories = useMemo(() => {
    if (!watchCategoryId) return [];
    return subcategories.filter((sub) => sub.parent === watchCategoryId);
  }, [watchCategoryId, subcategories]);

  useEffect(() => {
    if (courseData) {
      reset({
        title: courseData.title,
        description: courseData.description || "",
        shortDescription: courseData.shortDescription || "",
        duration: (courseData.duration as unknown as string) || "",
        price: courseData.price || 0,
        isFree: courseData.isFree || false,
        categoryId:
          typeof courseData.categoryId === "object"
            ? courseData.categoryId._id
            : courseData.categoryId || "",
        subcategoryId:
          courseData.subcategoryId
            ? typeof courseData.subcategoryId === "object"
              ? courseData.subcategoryId._id
              : courseData.subcategoryId
            : null,
        status: courseData.status || "draft",
      });
    }
  }, [courseData, reset]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      const payload = {
        ...data,
        shortDescription: data.shortDescription?.trim() || null,
        subcategoryId: data.subcategoryId || null,
      };

      if (isEditMode && courseData?._id) {
        await updateCourse({ id: courseData._id, ...payload }).unwrap();
      } else {
        await createCourse(payload).unwrap();
      }
      toast.success(isEditMode ? "Course updated" : "Course created");
      reset();
      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        />

        <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditMode ? "Edit Course" : "New Course"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className={getInputClass(!!errors.title)}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Slug (auto-generated, read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={
                    watchTitle
                      ? watchTitle
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/[\s_]+/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/^-|-$/g, "")
                      : ""
                  }
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  {...register("shortDescription")}
                  placeholder="Brief summary (optional)"
                  className={getInputClass(!!errors.shortDescription)}
                  disabled={isSubmitting}
                />
                {errors.shortDescription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  className={getInputClass(!!errors.description)}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Duration & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    {...register("duration")}
                    placeholder="e.g., 8 weeks"
                    className={getInputClass(!!errors.duration)}
                    disabled={isSubmitting}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className={getInputClass(!!errors.price)}
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Is Free Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register("isFree")}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  Free Course
                </span>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  {...register("categoryId")}
                  className={getInputClass(!!errors.categoryId)}
                >
                  <option value="">Select category</option>
                  {groupedCategories.map((main) => (
                    <optgroup key={main._id} label={main.name}>
                      {main.subs.length > 0 ? (
                        main.subs.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.name}
                          </option>
                        ))
                      ) : (
                        <option key={main._id} value={main._id}>
                          {main.name}
                        </option>
                      )}
                    </optgroup>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  {...register("subcategoryId")}
                  className={getInputClass(!!errors.subcategoryId)}
                  disabled={!watchCategoryId || filteredSubcategories.length === 0}
                >
                  <option value="">None</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                {filteredSubcategories.length === 0 && watchCategoryId && (
                  <p className="mt-1 text-xs text-gray-500">
                    No subcategories available for this category
                  </p>
                )}
                {errors.subcategoryId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.subcategoryId.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  {...register("status")}
                  className={getInputClass(!!errors.status)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update"
                    : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
