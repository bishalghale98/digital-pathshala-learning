'use client'

import React, { useCallback, useState, useMemo } from 'react'
import ConfirmationModal from '@/components/common/delete-modal'
import { useRouter, useSearchParams } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
  type Course,
} from '@/store/course/courseApi'
import { useGetCategoriesQuery } from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { toast } from 'sonner'
import { CourseHeader, CourseFilters, CourseTable } from '@/components/admin/courses'
import CourseForm from '@/components/admin/courses/CourseForm';

const CoursesPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const courseId = searchParams.get("courseId");


  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

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
        course.categories?.some((cc) => cc.categoryId === categoryFilter)
      return matchesSearch && matchesCategory
    })
  }, [courses, search, categoryFilter])

  const openDeleteModal = useCallback((course: Course) => {
    setCourseToDelete(course)
  }, [])

  const handleDelete = useCallback(async () => {
    if (!courseToDelete) return
    try {
      await deleteCourse(courseToDelete.id).unwrap()
      toast.success('Course deleted')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
    setCourseToDelete(null)
  }, [courseToDelete, deleteCourse])

  const handleAddCourse = () => { router.push(ROUTES.ADMIN_COURSE_CREATE) }
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    router.push(ROUTES.ADMIN_COURSE_EDIT(course.id))
  }



  if (type === 'create') {
    return (
      <CourseForm />
    )
  }

  if (type === 'edit' && courseId) {
    return (
      <CourseForm editingCourse={editingCourse} />
    )
  }



    return (
      <div>
        <CourseHeader onAddCourse={handleAddCourse} />

        <CourseFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
        />

        <CourseTable
          courses={filteredCourses}
          totalCount={courses.length}
          isLoading={isLoading}
          onEdit={handleEditCourse}
          onDelete={openDeleteModal}
        />

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

  export default CoursesPage
