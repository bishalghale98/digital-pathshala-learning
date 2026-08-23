'use client'

import CourseCard from '@/components/student/course/course-card'
import EnrollModal from '@/components/student/course/enroll-modal'
import { CourseCardSkeleton } from '@/components/student/loading/course-card'
import { useGetCoursesQuery, type Course } from '@/store/course/courseApi'
import { useGetCategoriesQuery } from '@/store/category/categoryApi'
import { useVerifyPaymentMutation } from '@/store/payment/paymentApi'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'

const CoursesPage = () => {
  const { data: courses = [], isLoading } = useGetCoursesQuery()
  const { data: categories = [] } = useGetCategoriesQuery()
  const [verifyPayment] = useVerifyPaymentMutation()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [courseId, setCourseId] = useState<string>('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const openModal = useCallback((id: string) => {
    setIsOpen(true)
    setCourseId(id)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const pidx = new URLSearchParams(window.location.search).get('pidx')
    if (!pidx) return

    verifyPayment({ pidx })
      .unwrap()
      .then(() => router.replace('/student/courses'))
      .catch((err) => console.error('Payment verification failed:', err))
  }, [router, verifyPayment])

  const filteredCourses = useMemo(() => {
    return courses.filter((course: Course) => {
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        !selectedCategory ||
        (typeof course.categoryId === 'object' &&
          (course.categoryId as { _id: string })._id === selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [courses, search, selectedCategory])

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory(null)
  }

  const hasFilters = search || selectedCategory

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Courses</h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover courses to expand your knowledge and skills.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
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

        {/* Category filter */}
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
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

      {/* Active filters */}
      {hasFilters && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              &quot;{search}&quot;
              <button onClick={() => setSearch('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {categories.find((c) => c._id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory(null)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && <CourseCardSkeleton />}

      {/* Empty state */}
      {!isLoading && filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-gray-500">
            {hasFilters
              ? 'No courses match your filters. Try adjusting your search.'
              : 'No courses available yet.'}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-sm font-medium text-gray-900 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Course grid */}
      {!isLoading && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course) => (
            <CourseCard
              key={course._id}
              id={course._id}
              title={course.title}
              description={course.description}
              price={course.price}
              duration={course.duration}
              category={
                typeof course.categoryId === 'object'
                  ? (course.categoryId as { name: string }).name
                  : ''
              }
              openModal={openModal}
            />
          ))}
        </div>
      )}

      {/* Course count */}
      {!isLoading && courses.length > 0 && (
        <p className="text-xs text-gray-400 mt-6 text-center">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      )}

      {isOpen && <EnrollModal closeModal={closeModal} courseId={courseId} />}
    </div>
  )
}

export default CoursesPage
