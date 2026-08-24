'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
} from 'lucide-react'
import StatCard from '@/components/dashboard/admin-stat-card'
import { useGetStudentsQuery } from '@/store/student/studentApi'
import { useGetCoursesQuery } from '@/store/course/courseApi'
import {
  useGetEnrollmentsQuery,
  type Enrollment,
} from '@/store/enrollment/enrollmentApi'
import { useGetCategoriesQuery } from '@/store/category/categoryApi'
import { EnrollmentStatus } from '@/types/models'
import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'

const getStudent = (e: Enrollment) =>
  typeof e.studentId === 'object' ? e.studentId : null
const getCourse = (e: Enrollment) =>
  typeof e.courseId === 'object' ? e.courseId : null

const AdminPage = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const { data: students = [], isLoading: loadingStudents } = useGetStudentsQuery()
  const { data: courses = [], isLoading: loadingCourses } = useGetCoursesQuery()
  const { data: enrollments = [], isLoading: loadingEnrollments } = useGetEnrollmentsQuery()
  const { data: categories = [] } = useGetCategoriesQuery()

  const stats = useMemo(() => {
    let approved = 0
    let pending = 0
    let rejected = 0

    for (const e of enrollments) {
      if (e.enrollmentStatus === EnrollmentStatus.Approved) approved++
      if (e.enrollmentStatus === EnrollmentStatus.Pending) pending++
      if (e.enrollmentStatus === EnrollmentStatus.Rejected) rejected++
    }

    return {
      totalStudents: students.length,
      totalCourses: courses.length,
      totalCategories: categories.reduce((acc, cat) => acc + 1 + (cat.children?.length ?? 0), 0),
      approvedEnrollments: approved,
      pendingEnrollments: pending,
      rejectedEnrollments: rejected,
      totalEnrollments: enrollments.length,
    }
  }, [students.length, courses.length, categories, enrollments])

  const recentEnrollments = useMemo(() => {
    return [...enrollments]
      .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
      .slice(0, 5)
  }, [enrollments])

  const recentStudents = useMemo(() => {
    return [...students].slice(0, 5)
  }, [students])

  const isLoading = loadingStudents || loadingCourses || loadingEnrollments

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {session?.user.name || 'Admin'} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your LMS today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users size={20} />}
          color="blue"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<BookOpen size={20} />}
          color="purple"
        />
        <StatCard
          title="Approved Enrollments"
          value={stats.approvedEnrollments}
          icon={<CheckCircle size={20} />}
          color="green"
        />
        <StatCard
          title="Pending Enrollments"
          value={stats.pendingEnrollments}
          icon={<Clock size={20} />}
          color="yellow"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enrollments - 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Recent Enrollments</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest student enrollments</p>
            </div>
            <button
              onClick={() => router.push(ROUTES.ADMIN_ENROLLMENTS)}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-6 text-sm text-gray-500 text-center">Loading...</div>
          ) : recentEnrollments.length === 0 ? (
            <div className="p-6 text-sm text-gray-500 text-center">No enrollments yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentEnrollments.map((enrollment) => {
                    const student = getStudent(enrollment)
                    const course = getCourse(enrollment)
                    return (
                      <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3">
                          <p className="text-sm font-medium text-gray-900">{student?.name || '—'}</p>
                          <p className="text-xs text-gray-500">{student?.email || ''}</p>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-sm text-gray-900">{course?.title || '—'}</p>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-sm text-gray-600">
                            {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-3">
                          <StatusBadge status={enrollment.enrollmentStatus} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Users - 1/3 width */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Recent Users</h2>
              <p className="text-xs text-gray-500 mt-0.5">Newly registered</p>
            </div>
            <button
              onClick={() => router.push(ROUTES.ADMIN_STUDENTS)}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-6 text-sm text-gray-500 text-center">Loading...</div>
          ) : recentStudents.length === 0 ? (
            <div className="p-6 text-sm text-gray-500 text-center">No users yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
                  {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                  {student.image ? (
                    <img src={student.image} alt={student.name} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {student.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{student.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 truncate">{student.email || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Course Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Course Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
            <div className="text-xs text-gray-500 mt-1">Total Courses</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.totalCategories}</div>
            <div className="text-xs text-gray-500 mt-1">Categories</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.approvedEnrollments}</div>
            <div className="text-xs text-gray-500 mt-1">Active Enrollments</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingEnrollments}</div>
            <div className="text-xs text-gray-500 mt-1">Pending Review</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => router.push(ROUTES.ADMIN_COURSES)}
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <BookOpen className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Manage Courses</p>
              <p className="text-xs text-gray-500">Create, edit, or remove courses</p>
            </div>
          </button>
          <button
            onClick={() => router.push(ROUTES.ADMIN_ENROLLMENTS)}
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Review Enrollments</p>
              <p className="text-xs text-gray-500">Approve or reject pending</p>
            </div>
          </button>
          <button
            onClick={() => router.push(ROUTES.ADMIN_CATEGORIES)}
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <Tag className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Manage Categories</p>
              <p className="text-xs text-gray-500">Organize your courses</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

const StatusBadge = ({ status }: { status: EnrollmentStatus }) => {
  const styles: Record<string, string> = {
    [EnrollmentStatus.Approved]: 'bg-green-50 text-green-700',
    [EnrollmentStatus.Pending]: 'bg-yellow-50 text-yellow-700',
    [EnrollmentStatus.Rejected]: 'bg-red-50 text-red-700',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-50 text-gray-700'}`}>
      {status}
    </span>
  )
}

export default AdminPage
