'use client'

import React, { Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CourseSyallabus from '@/components/student/course/course-syllabus'
import VideoPlaySection from '@/components/student/course/video-play-section'
import {
  useGetMyCoursesQuery,
  useGetStudentLessonsQuery,
} from '@/store/student/studentApi'
import { useGetLessonsByCourseQuery } from '@/store/lesson/lessonApi'
import { BookOpen, Play, Clock, ArrowRight } from 'lucide-react'
import type { Lesson } from '@/store/lesson/lessonApi'
import type { MyCourse } from '@/store/student/studentApi'
import type { Course } from '@/store/course/courseApi'

const getCourse = (enroll: MyCourse): Course | null =>
  typeof enroll.courseId === 'object' ? (enroll.courseId as Course) : null

const getCourseId = (courseId: string | { _id: string }) =>
  typeof courseId === 'string' ? courseId : courseId._id

type FilterTab = 'all' | 'in-progress' | 'completed'

const MyCourseCard = ({
  enrollment,
  filter,
}: {
  enrollment: MyCourse
  filter: FilterTab
}) => {
  const router = useRouter()
  const course = getCourse(enrollment)
  const courseId = getCourseId(enrollment.courseId)
  const { data: lessons = [] } = useGetLessonsByCourseQuery(courseId)

  const completedCount = enrollment.completedLessons?.length || 0
  const totalLessons = lessons.length
  const progress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isCompleted = totalLessons > 0 && completedCount === totalLessons
  const isInProgress = completedCount > 0 && !isCompleted

  // Filter logic
  if (filter === 'in-progress' && !isInProgress) return null
  if (filter === 'completed' && !isCompleted) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Course header */}
      <div className="h-36 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
        <BookOpen className="w-10 h-10 text-white/30" />
        {progress > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
            {progress}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
          {course?.title}
        </h3>
        {course?.duration && (
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.duration}
          </p>
        )}

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500">
              {completedCount}/{totalLessons} lessons
            </span>
            <span className="font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gray-900 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enrolled date */}
        <p className="text-xs text-gray-400 mb-3">
          Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
        </p>

        <button
          onClick={() =>
            router.push(
              `/student/mycourse?section=course-syllabus&courseId=${courseId}`
            )
          }
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {isInProgress ? (
            <>
              <Play className="w-3.5 h-3.5" />
              Continue
            </>
          ) : isCompleted ? (
            <>
              <ArrowRight className="w-3.5 h-3.5" />
              Review
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Start
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function MyCourseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const { section, courseId, lessonId } = useMemo(
    () => ({
      section: searchParams.get('section'),
      courseId: searchParams.get('courseId'),
      lessonId: searchParams.get('lessonId'),
    }),
    [searchParams]
  )

  const { data: myCourses = [], isLoading } = useGetMyCoursesQuery()
  const {
    data: lessons = [],
    isLoading: lessonsLoading,
  } = useGetStudentLessonsQuery(courseId ?? '', { skip: !courseId })

  const activeLesson: Lesson | undefined = useMemo(
    () => lessons.find((lesson) => lesson._id === lessonId),
    [lessons, lessonId]
  )

  if (section === 'course-syllabus' && courseId) {
    return <CourseSyallabus lessons={lessons} isLoading={lessonsLoading} />
  }

  if (section === 'video_play' && courseId && lessonId) {
    return (
      <VideoPlaySection
        lessons={lessons}
        activeLesson={activeLesson ?? null}
        isLoading={lessonsLoading}
      />
    )
  }

  const filters: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your progress and continue learning.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === f.key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-36 bg-gray-200" />
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
                <div className="h-1.5 w-full bg-gray-200 rounded-full mb-3" />
                <div className="h-9 w-full bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && myCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No courses yet
          </h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            You haven&apos;t enrolled in any courses yet. Explore our catalog
            and start learning today.
          </p>
          <button
            onClick={() => router.push('/student/courses')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      )}

      {/* No results for filter */}
      {!isLoading && myCourses.length > 0 && (
        <CourseGrid courses={myCourses} filter={activeFilter} />
      )}
    </div>
  )
}

const CourseGrid = ({
  courses,
  filter,
}: {
  courses: MyCourse[]
  filter: FilterTab
}) => {
  const filtered = courses.filter((enrollment) => {
    if (filter === 'all') return true
    // We need to compute progress per-course
    // For filtering, we approximate based on completedLessons
    const completed = enrollment.completedLessons?.length || 0
    if (filter === 'in-progress') return completed > 0
    if (filter === 'completed') return false // Can't determine without total lessons
    return true
  })

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">
          No courses match this filter.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((enrollment) => (
        <MyCourseCard
          key={enrollment._id}
          enrollment={enrollment}
          filter={filter}
        />
      ))}
    </div>
  )
}

const MyCoursePage = () => (
  <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
    <MyCourseContent />
  </Suspense>
)

export default MyCoursePage
