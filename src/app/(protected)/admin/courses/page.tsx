'use client'

import React, { useCallback, useState, useMemo } from 'react'
import CourseModal from '@/components/course/modal'
import ConfirmationModal from '@/components/common/delete-modal'
import { useRouter } from 'next/navigation'
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
  type Course,
} from '@/store/course/courseApi'
import { useGetCategoriesQuery } from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { toast } from 'sonner'
import { Search, X, Plus, BookOpen } from 'lucide-react'

const Courses = () => {
  const router = useRouter()

  const [openAddModal, setOpenAddModal] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const { data: courses = [], isLoading } = useGetCoursesQuery()
  const { data: categories = [] } = useGetCategoriesQuery()
  const [deleteCourse] = useDeleteCourseMutation()

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        !categoryFilter ||
        (typeof course.categoryId === 'object' &&
          (course.categoryId as { _id: string })._id === categoryFilter)
      return matchesSearch && matchesCategory
    })
  }, [courses, search, categoryFilter])

  const addModalOpen = useCallback(() => setOpenAddModal(true), [])
  const editModalOpen = useCallback((course: Course) => {
    setEditingCourse(course)
    setIsEditModalOpen(true)
  }, [])
  const closeModal = useCallback(() => {
    setOpenAddModal(false)
    setIsEditModalOpen(false)
    setEditingCourse(null)
  }, [])
  const openDeleteModal = useCallback((course: Course) => {
    setCourseToDelete(course)
  }, [])

  const handleDelete = useCallback(async () => {
    if (!courseToDelete) return
    try {
      await deleteCourse(courseToDelete._id).unwrap()
      toast.success('Course deleted')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
    setCourseToDelete(null)
  }, [courseToDelete, deleteCourse])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all courses</p>
        </div>
        <button
          onClick={addModalOpen}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors min-w-[180px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-sm font-medium text-gray-900">
                        {search || categoryFilter ? 'No courses found' : 'No courses yet'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {search || categoryFilter
                          ? 'Try adjusting your filters'
                          : 'Create your first course to get started'}
                      </p>
                      {!search && !categoryFilter && (
                        <button
                          onClick={addModalOpen}
                          className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Course
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/courses/${course._id}/lessons`)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-[300px]">
                        {course.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {typeof course.categoryId === 'object' ? course.categoryId.name : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{course.duration}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">Rs. {course.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(course.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => editModalOpen(course)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(course)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredCourses.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium">{filteredCourses.length}</span> of{' '}
              <span className="font-medium">{courses.length}</span> courses
            </p>
          </div>
        )}
      </div>

      {openAddModal && <CourseModal closeModal={closeModal} />}
      {isEditModalOpen && editingCourse && (
        <CourseModal closeModal={closeModal} courseData={editingCourse} />
      )}
      <ConfirmationModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDelete}
        title={courseToDelete ? `Are you sure you want to delete "${courseToDelete.title}"?` : ''}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default Courses
