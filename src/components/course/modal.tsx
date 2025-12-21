"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ICourse } from "@/store/course/types";
import { createCourseSchema } from "@/schemas/courseSchema";
import { fetchCategory } from "@/store/category/categorySlice";
import { getInputClass } from "@/lib/utils/form";

interface CourseModalProps {
    closeModal: () => void;
    courseData?: ICourse | null;
}

type CourseFormData = z.infer<typeof createCourseSchema>;

const CourseModal: React.FC<CourseModalProps> = ({
    closeModal,
    courseData,
}) => {
    const isEditMode = !!courseData;
    const dispatch = useAppDispatch();
    const { Categories } = useAppSelector((store) => store.categories)


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<CourseFormData>({
        resolver: zodResolver(createCourseSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            duration: "",
            price: 0,
            categoryId: "",
        },
    });

    useEffect(() => {
        dispatch(fetchCategory())
    }, [dispatch])

    useEffect(() => {
        if (courseData) {
            reset({
                title: courseData.title,
                description: courseData.description || "",
                duration: courseData.duration || "",
                price: courseData.price || 0,
                categoryId: courseData.categoryId?._id,
            });
        }
    }, [courseData, reset]);


    const onSubmit = async (data: CourseFormData) => {
        try {
            console.log("Form Data:", data);

            // if (isEditMode && courseData?._id) {
            //   await dispatch(updateCourse({ id: courseData._id, data }));
            // } else {
            //   await dispatch(createCourse(data));
            // }

            reset();
            closeModal();
        } catch (error) {
            console.error("Error submitting course:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={closeModal}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg">
                    {/* Header */}
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

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
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
                                        Price ($) *
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
                                    {Categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>


                                {errors.categoryId && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.categoryId.message}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* Actions */}
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
