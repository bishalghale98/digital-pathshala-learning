'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { categoryCreateSchema } from '@/schemas/categorySchema'
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useGetCategoriesQuery,
    type Category,
} from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { getInputClass } from '@/lib/utils/form'
import { X } from 'lucide-react'

interface ModalProps {
    closeModal: () => void
    categoryData?: Category | null
}

type FormData = z.infer<typeof categoryCreateSchema>

function toSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

const Modal: React.FC<ModalProps> = ({ closeModal, categoryData }) => {
    const [createCategory] = useCreateCategoryMutation()
    const [updateCategory] = useUpdateCategoryMutation()
    const { data: categories = [] } = useGetCategoriesQuery()
    const isEditMode = !!categoryData

    const parentOptions = useMemo(() => {
        return categories.filter((cat) => {
            if (isEditMode && categoryData?._id === cat._id) return false
            if (cat.parent) return false
            return true
        })
    }, [categories, isEditMode, categoryData])

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(categoryCreateSchema),
        defaultValues: {
            name: categoryData?.name || '',
            slug: categoryData?.slug || '',
            parent: categoryData?.parent?._id || undefined,
        },
    })

    const watchedName = watch('name')

    useEffect(() => {
        if (!isEditMode && watchedName) {
            setValue('slug', toSlug(watchedName), { shouldValidate: true })
        }
    }, [watchedName, isEditMode, setValue])

    useEffect(() => {
        reset({
            name: categoryData?.name || '',
            slug: categoryData?.slug || '',
            parent: categoryData?.parent?._id || undefined,
        })
    }, [categoryData, reset])

    const onSubmit = async (data: FormData) => {
        try {
            if (isEditMode && categoryData?._id) {
                await updateCategory({ id: categoryData._id, ...data }).unwrap()
            } else {
                await createCategory(data).unwrap()
            }
            reset()
            closeModal()
        } catch (error) {
            console.error('Error submitting category:', getErrorMessage(error))
        }
    }

    const handleClose = () => {
        reset()
        closeModal()
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm cursor-pointer"
                onClick={handleClose}
            />
            <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-md p-4 mx-auto">
                    <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {isEditMode ? 'Edit Category' : 'Create New Category'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isEditMode
                                        ? 'Update category details below.'
                                        : 'Add a new category to organize courses.'}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                type="button"
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5">
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-1.5 text-sm font-medium text-gray-700"
                                    >
                                        Category Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="e.g. Web Development"
                                        className={getInputClass(!!errors.name, "")}
                                        {...register('name')}
                                    />
                                    {errors.name && (
                                        <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Slug (Auto-generated) */}
                                <div>
                                    <label
                                        htmlFor="slug"
                                        className="block mb-1.5 text-sm font-medium text-gray-700"
                                    >
                                        Slug
                                    </label>
                                    <input
                                        id="slug"
                                        type="text"
                                        readOnly
                                        placeholder="Auto-generated from name"
                                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed focus:outline-none"
                                        {...register('slug')}
                                    />
                                    {errors.slug && (
                                        <p className="mt-1.5 text-xs text-red-500">{errors.slug.message}</p>
                                    )}
                                </div>

                                {/* Parent Category */}
                                <div>
                                    <label
                                        htmlFor="parent"
                                        className="block mb-1.5 text-sm font-medium text-gray-700"
                                    >
                                        Parent Category
                                    </label>
                                    <select
                                        id="parent"
                                        className={getInputClass(!!errors.parent, "")}
                                        {...register('parent')}
                                    >
                                        <option value="">None (Top-level)</option>
                                        {parentOptions.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.parent && (
                                        <p className="mt-1.5 text-xs text-red-500">{errors.parent.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2 cursor-pointer"
                                >
                                    {isSubmitting
                                        ? 'Submitting...'
                                        : isEditMode
                                            ? 'Update Category'
                                            : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
