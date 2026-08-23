'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { categoryCreateSchema } from '@/schemas/categorySchema'
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  type Category,
} from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { getInputClass } from '@/lib/utils/form'

interface ModalProps {
  closeModal: () => void
  categoryData?: Category | null
  mainCategories?: Category[]
}

type FormData = z.infer<typeof categoryCreateSchema>

const Modal: React.FC<ModalProps> = ({
  closeModal,
  categoryData,
  mainCategories = [],
}) => {
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const isEditMode = !!categoryData

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: categoryData?.name || '',
      description: categoryData?.description || '',
      image: categoryData?.image || '',
      parent: categoryData?.parent || '',
      isActive: categoryData?.isActive ?? true,
      sortOrder: categoryData?.sortOrder ?? 0,
    },
  })

  const watchParent = watch('parent')

  useEffect(() => {
    reset({
      name: categoryData?.name || '',
      description: categoryData?.description || '',
      image: categoryData?.image || '',
      parent: categoryData?.parent || '',
      isActive: categoryData?.isActive ?? true,
      sortOrder: categoryData?.sortOrder ?? 0,
    })
  }, [categoryData, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        description: data.description?.trim() || null,
        image: data.image?.trim() || null,
        parent: data.parent || null,
      }

      if (isEditMode && categoryData?._id) {
        await updateCategory({ id: categoryData._id, ...payload }).unwrap()
      } else {
        await createCategory(payload).unwrap()
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

  const availableParents = mainCategories.filter(
    (cat) => !isEditMode || cat._id !== categoryData?._id
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-md p-4 mx-auto">
          <div className="relative bg-white rounded-xl shadow-lg">
            {/* Close Button */}
            <button
              onClick={handleClose}
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Category' : 'Create New Category'}
              </h2>
              <p className="mt-2 text-gray-500">
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
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Category Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter category name"
                    className={getInputClass(!!errors.name, 'text-white')}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Slug (auto-generated, read-only display) */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={
                      watch('name')
                        ? watch('name')
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/[\s_]+/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '')
                        : ''
                    }
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Enter description (optional)"
                    className={getInputClass(!!errors.description, 'text-white')}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Parent Category */}
                <div>
                  <label
                    htmlFor="parent"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Parent Category
                  </label>
                  <select
                    id="parent"
                    className={getInputClass(!!errors.parent, 'text-white')}
                    {...register('parent')}
                  >
                    <option value="">None (Main Category)</option>
                    {availableParents.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {watchParent
                      ? 'This will be a subcategory'
                      : 'Leave empty to create a main category'}
                  </p>
                  {errors.parent && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.parent.message}
                    </p>
                  )}
                </div>

                {/* Sort Order */}
                <div>
                  <label
                    htmlFor="sortOrder"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Sort Order
                  </label>
                  <input
                    id="sortOrder"
                    type="number"
                    min={0}
                    {...register('sortOrder', { valueAsNumber: true })}
                    className={getInputClass(!!errors.sortOrder, 'text-white')}
                  />
                  {errors.sortOrder && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.sortOrder.message}
                    </p>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register('isActive')}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#4d1b80]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4d1b80]"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">
                    Active
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
