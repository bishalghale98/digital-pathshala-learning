'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getSlug } from '@/lib/helper/helper'
import { getInputClass } from '@/lib/utils/form'
import { ROUTES } from '@/lib/constants'
import { createCourseSchema } from '@/schemas/courseSchema'
import {
  type Course,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from '@/store/course/courseApi'
import { useGetCategoriesQuery, type CategoryTree } from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { RichTextEditor } from '@/components/editor/rich-text-editor'

type FormData = z.infer<typeof createCourseSchema>

interface CourseFormProps {
  editingCourse?: Course | null
}

const CourseForm = ({ editingCourse }: CourseFormProps) => {
  const router = useRouter()
  const isEditing = !!editingCourse

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()
  const { data: categories = [] } = useGetCategoriesQuery()

  const isSubmitting = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      duration: '',
      price: 0,
      thumbnail: '',
      whatsappGroupLink: '',
      keywords: '',
      status: 'DRAFT',
      categoryId: [],
    },
  })

  const watchedTitle = watch('title')
  const watchedCategoryIds = watch('categoryId')

  useEffect(() => {
    if (!isEditing) {
      const slug = getSlug(watchedTitle ?? '')
      setValue('slug', slug, { shouldValidate: true, shouldDirty: true })
    }
  }, [watchedTitle, setValue, isEditing])

  useEffect(() => {
    if (editingCourse) {
      const categoryIds = editingCourse.categories?.map((c) => c.categoryId) ?? []
      reset({
        title: editingCourse.title || '',
        slug: editingCourse.slug || '',
        shortDescription: editingCourse.shortDescription || '',
        description: editingCourse.description || '',
        duration: editingCourse.duration || '',
        price: editingCourse.price || 0,
        thumbnail: editingCourse.thumbnail || '',
        whatsappGroupLink: editingCourse.whatsappGroupLink || '',
        keywords: editingCourse.keywords || '',
        status: editingCourse.status || 'DRAFT',
        categoryId: categoryIds,
      })
    } else {
      reset({
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        duration: '',
        price: 0,
        thumbnail: '',
        whatsappGroupLink: '',
        keywords: '',
        status: 'DRAFT',
        categoryId: [],
      })
    }
  }, [editingCourse, reset])

  const handleCategoryToggle = (id: string, parent?: CategoryTree) => {
    const current = watchedCategoryIds ?? []
    const isSelected = current.includes(id)

    let updated: string[]

    if (isSelected) {
      updated = current.filter((cId) => cId !== id)
    } else {
      updated = [...current, id]

      if (parent && !current.includes(parent.id)) {
        updated = [...updated, parent.id]
      }
    }

    setValue('categoryId', updated, { shouldValidate: true, shouldDirty: true })
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && editingCourse) {
        await updateCourse({ id: editingCourse.id, ...data }).unwrap()
        toast.success('Course updated successfully')
      } else {
        await createCourse(data).unwrap()
        toast.success('Course created successfully')
      }
      reset()
      router.push(ROUTES.ADMIN_COURSES)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="p-6 min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isEditing ? 'Edit Course' : 'Add New Course'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Enter Course Title"
                {...register('title')}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Slug
              </label>

              <div className="flex items-center rounded border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="text-sm text-gray-400">/courses/</span>
                <input
                  id="slug"
                  type="text"
                  {...register('slug')}
                  className="flex-1 bg-transparent px-1 text-sm text-gray-600 outline-none"
                  placeholder="course-slug"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Automatically generated from the course title.
              </p>

              {errors.slug && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Rich Text Editor for Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <RichTextEditor
                value={watch('description') ?? ''}
                onChange={(html) =>
                  setValue('description', html, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder="Write your course description..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Short Description
              </label>
              <textarea
                id="shortDescription"
                rows={2}
                {...register('shortDescription')}
                className={getInputClass(!!errors.shortDescription)}
                placeholder="Brief summary of the course (max 200 characters)"
              />
              {errors.shortDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            {/* Instructor Details placeholder */}
            <div className="bg-white border border-gray-300 rounded shadow-sm p-4 flex justify-between items-center text-gray-700 font-medium cursor-pointer">
              <span>Instructor Details</span>
              <span className="text-sm text-gray-400">&#9660;</span>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Publish Box */}
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                Publish
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-600">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className={getInputClass(!!errors.status)}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration
                  </label>
                  <input
                    id="duration"
                    type="text"
                    {...register('duration')}
                    className={getInputClass(!!errors.duration)}
                    placeholder='e.g., "8 weeks"'
                  />
                  {errors.duration && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    className={getInputClass(!!errors.price)}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : isEditing
                      ? 'Update Course'
                      : 'Publish'}
                </button>
              </div>
            </div>

            {/* Course Categories */}
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                Course Categories
              </div>
              <div className="p-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <label className="flex items-center gap-2 py-1 px-1 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={watchedCategoryIds?.includes(cat.id) ?? false}
                          onChange={() => handleCategoryToggle(cat.id)}
                          className="size-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                      </label>
                      {cat.children && cat.children.length > 0 && (
                        <div className="ml-5 mt-1 pl-4 border-l-2 border-gray-200 space-y-1">
                          {cat.children.map((child) => (
                            <label key={child.id} className="flex items-center gap-2 py-0.5 px-1 rounded hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={watchedCategoryIds?.includes(child.id) ?? false}
                                onChange={() => handleCategoryToggle(child.id, cat)}
                                className="size-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-600">{child.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {errors.categoryId && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail URL */}
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                Course Thumbnail
              </div>
              <div className="p-4 space-y-3">
                <input
                  type="url"
                  {...register('thumbnail')}
                  className={getInputClass(!!errors.thumbnail)}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.thumbnail && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                Keywords
              </div>
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  {...register('keywords')}
                  className={getInputClass(!!errors.keywords)}
                  placeholder="React, Frontend, JavaScript"
                />
                <p className="text-xs text-gray-500">Separate tags with commas</p>
                {errors.keywords && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.keywords.message}
                  </p>
                )}
              </div>
            </div>

            {/* WhatsApp Group Link */}
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                WhatsApp Group
              </div>
              <div className="p-4 space-y-3">
                <input
                  type="url"
                  {...register('whatsappGroupLink')}
                  className={getInputClass(!!errors.whatsappGroupLink)}
                  placeholder="https://chat.whatsapp.com/..."
                />
                {errors.whatsappGroupLink && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.whatsappGroupLink.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CourseForm
