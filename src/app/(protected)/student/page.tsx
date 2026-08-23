'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'
import { useGetMyCoursesQuery } from '@/store/student/studentApi'
import { useGetLessonsByCourseQuery } from '@/store/lesson/lessonApi'
import DashboardStatCard from '@/components/dashboard/dashboard-stat-card'
import ContinueLearningCard from '@/components/dashboard/continue-learning-card'
import EnrolledCourseCard from '@/components/dashboard/enrolled-course-card'
import DashboardSkeleton from '@/components/dashboard/dashboard-skeleton'
import DashboardEmptyState from '@/components/dashboard/dashboard-empty-state'
import type { MyCourse } from '@/store/student/studentApi'
import type { Course } from '@/store/course/courseApi'

const getCourseId = (courseId: string | Course): string => {
  if (typeof courseId === 'string') return courseId
  return courseId.id
}

const CourseCardWithProgress = ({
  enrollment,
}: {
  enrollment: MyCourse
}) => {
  const courseId = getCourseId(enrollment.courseId)
  const { data: lessons = [] } = useGetLessonsByCourseQuery(courseId)

  return (
    <EnrolledCourseCard
      enrollment={enrollment}
      totalLessons={lessons.length}
    />
  )
}

const ContinueWithProgress = ({
  enrollment,
}: {
  enrollment: MyCourse
}) => {
  const courseId = getCourseId(enrollment.courseId)
  const { data: lessons = [] } = useGetLessonsByCourseQuery(courseId)

  return (
    <ContinueLearningCard
      enrollment={enrollment}
      totalLessons={lessons.length}
    />
  )
}

const StudentDashboardPage = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const { data: myCourses = [], isLoading } = useGetMyCoursesQuery()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (myCourses.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user.name || 'Student'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Start your learning journey by exploring our courses.
          </p>
        </div>
        <DashboardEmptyState />
      </div>
    )
  }

  // Find the continue learning course (most recently accessed)
  const continueCourse = [...myCourses].sort((a, b) => {
    if (!a.lastAccessedAt) return 1
    if (!b.lastAccessedAt) return -1
    return (
      new Date(b.lastAccessedAt).getTime() -
      new Date(a.lastAccessedAt).getTime()
    )
  })[0]

  // Stats
  const totalCourses = myCourses.length
  const coursesInProgress = myCourses.filter(
    (c) => (c.completedLessons?.length || 0) > 0
  ).length

  // Preview courses (first 4)
  const previewCourses = myCourses.slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user.name || 'Student'} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Continue your learning journey and pick up where you left off.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Enrolled Courses"
          value={totalCourses}
          icon={<BookOpen className="w-5 h-5" />}
          color="blue"
        />
        <DashboardStatCard
          title="In Progress"
          value={coursesInProgress}
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
        />
        <DashboardStatCard
          title="Completed"
          value={0}
          icon={<GraduationCap className="w-5 h-5" />}
          color="green"
        />
        <DashboardStatCard
          title="Total Courses"
          value={totalCourses}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Continue Learning */}
      {continueCourse && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Continue Learning
          </h2>
          <ContinueWithProgress enrollment={continueCourse} />
        </div>
      )}

      {/* My Courses Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
          <button
            onClick={() => router.push(ROUTES.STUDENT_MY_COURSES)}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewCourses.map((enrollment) => (
            <CourseCardWithProgress
              key={enrollment.id}
              enrollment={enrollment}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage
