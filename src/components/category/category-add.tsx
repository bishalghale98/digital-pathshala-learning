'use client'

import { getSlug } from "@/lib/helper/helper";
import { categoryCreateSchema } from "@/schemas/categorySchema";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/store/category/categoryApi";
import type { CategoryTree } from "@/store/category/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

interface CategoryAddProps {
    parentOptions: CategoryTree[];
    editingCategory?: CategoryTree | null;
    onSuccess?: () => void;
}

type FormData = z.infer<typeof categoryCreateSchema>;

const CategoryAdd = ({ parentOptions, editingCategory, onSuccess }: CategoryAddProps) => {

    const isEditing = !!editingCategory;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(categoryCreateSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            parent: undefined,
        },
    });

    const watchedName = watch("name");

    useEffect(() => {
        const slug = getSlug(watchedName ?? "");
        setValue("slug", slug, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [watchedName, setValue]);

    useEffect(() => {
        if (editingCategory) {
            const parentId = parentOptions.find((p) =>
                p.children?.some((child) => child.id === editingCategory.id)
            )?.id;

            reset({
                name: editingCategory.name || "",
                slug: editingCategory.slug || "",
                description: editingCategory.description || "",
                parent: parentId || undefined,
            });
        } else {
            reset({
                name: "",
                slug: "",
                description: "",
                parent: undefined,
            });
        }
    }, [editingCategory, reset, parentOptions]);

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const isSubmitting = isCreating || isUpdating;

    const onSubmit = async (data: FormData) => {
        try {
            if (isEditing && editingCategory) {
                await updateCategory({ id: editingCategory.id, ...data }).unwrap();
                toast.success("Category updated successfully");
            } else {
                await createCategory(data).unwrap();
                toast.success("Category created successfully");
            }
            reset();
            onSuccess?.();
        } catch {
            toast.error("Failed to save category");
        }
    };

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <h2 className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {isEditing ? "Edit Category" : "Add New Category"}
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 space-y-4"
                >
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            {...register("name")}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter category name"
                        />

                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name.message}
                            </p>
                        )}

                        <p className="mt-1 text-xs text-gray-500">
                            The name is how it appears on your site.
                        </p>
                    </div>

                    {/* Slug */}
                    <div>
                        <label
                            htmlFor="slug"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Slug
                        </label>

                        <input
                            id="slug"
                            type="text"
                            readOnly
                            {...register("slug")}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                            placeholder="category-slug"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            The slug is the URL-friendly version of the name.
                        </p>
                    </div>

                    {/* Parent Category */}
                    <div>
                        <label
                            htmlFor="parent"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Parent Category
                        </label>

                        <select
                            id="parent"
                            {...register("parent", {
                                setValueAs: (value) =>
                                    value === "" ? undefined : value,
                            })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">None</option>

                            {parentOptions.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {errors.parent && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.parent.message}
                            </p>
                        )}

                        <p className="mt-1 text-xs text-gray-500">
                            Select a parent category to create a subcategory.
                            Leave it as None to create a main category.
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            rows={4}
                            {...register("description")}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter category description"
                        />

                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.description.message}
                            </p>
                        )}

                        <p className="mt-1 text-xs text-gray-500">
                            Add a short description for this category.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {isSubmitting
                            ? isEditing ? "Updating..." : "Adding..."
                            : isEditing ? "Update Category" : "Add New Category"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryAdd;
