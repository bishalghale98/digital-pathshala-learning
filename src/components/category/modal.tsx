'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { categoryCreateSchema } from '@/schemas/categorySchema'
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
} from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { getInputClass } from '@/lib/utils/form'

interface ModalProps {
    closeModal: () => void
    categoryData?: { _id: string; name: string; description?: string } | null
}

type FormData = z.infer<typeof categoryCreateSchema>

const Modal: React.FC<ModalProps> = ({ closeModal, categoryData }) => {
    const [createCategory] = useCreateCategoryMutation()
    const [updateCategory] = useUpdateCategoryMutation()
    const isEditMode = !!categoryData

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(categoryCreateSchema),
        defaultValues: {
            name: categoryData?.name || '',
            description: categoryData?.description || '',
        },
    })

    useEffect(() => {
        // Reset form when modal opens or categoryData changes
        reset({
            name: categoryData?.name || '',
            description: categoryData?.description || '',
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
            {/* Overlay */}
            <div
                className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"
                onClick={handleClose}
            />
            {/* Modal */}
            <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-sm p-4 mx-auto">
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            type="button"
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            aria-label="Close modal"
                        >
                            <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Modal Header */}
                        <div className="p-6 text-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isEditMode ? 'Edit Category' : 'Create New Category'}
                            </h2>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                {isEditMode
                                    ? 'Update the category details below.'
                                    : 'Fill in the details below to create a new category.'}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6">
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Category Name <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter category name"
                                        className={getInputClass(!!errors.name, "text-white")}
                                        {...register('name')}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        placeholder="Enter description (optional)"
                                        className={getInputClass(!!errors.description , "text-white")}
                                        {...register('description')}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-2 px-4 text-sm font-medium text-white bg-[#4d1b80] hover:bg-[#7127BA] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4d1b80] focus:ring-offset-2"
                                    >
                                        {isSubmitting
                                            ? 'Submitting...'
                                            : isEditMode
                                                ? 'Update Category'
                                                : 'Create Category'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Modal
