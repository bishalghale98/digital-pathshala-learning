'use client'

import React, { useMemo } from 'react'
import { useGetStudentsQuery } from '@/store/student/studentApi'
import { useGetCoursesQuery } from '@/store/course/courseApi'
import { useGetEnrollmentsQuery } from '@/store/enrollment/enrollmentApi'
import { useGetCategoriesQuery } from '@/store/category/categoryApi'
import { EnrollmentStatus } from '@/types/models'
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'

const AnalyticsPage = () => {
  const { data: students = [], isLoading: loadingStudents } = useGetStudentsQuery()
  const { data: courses = [], isLoading: loadingCourses } = useGetCoursesQuery()
  const { data: enrollments = [], isLoading: loadingEnrollments } = useGetEnrollmentsQuery()
  const { data: categories = [] } = useGetCategoriesQuery()

  const isLoading = loadingStudents || loadingCourses || loadingEnrollments

  const analytics = useMemo(() => {
    let approved = 0
    let pending = 0
    let rejected = 0

    for (const e of enrollments) {
      if (e.enrollmentStatus === EnrollmentStatus.Approved) approved++
      if (e.enrollmentStatus === EnrollmentStatus.Pending) pending++
      if (e.enrollmentStatus === EnrollmentStatus.Rejected) rejected++
    }

    // Enrollment by month (last 6 months)
    const monthlyEnrollments: { month: string; count: number }[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      const count = enrollments.filter((e) => {
        const enrolled = new Date(e.enrolledAt)
        return (
          enrolled.getMonth() === date.getMonth() &&
          enrolled.getFullYear() === date.getFullYear()
        )
      }).length
      monthlyEnrollments.push({ month: monthName, count })
    }

    // Top courses by enrollment
    const courseEnrollmentMap = new Map<string, { title: string; count: number }>()
    for (const e of enrollments) {
      const courseId = typeof e.courseId === 'string' ? e.courseId : e.courseId._id
      const courseTitle = typeof e.courseId === 'object' ? e.courseId.title : ''
      const existing = courseEnrollmentMap.get(courseId)
      if (existing) {
        existing.count++
      } else {
        courseEnrollmentMap.set(courseId, { title: courseTitle, count: 1 })
      }
    }
    const topCourses = Array.from(courseEnrollmentMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalStudents: students.length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      totalCategories: categories.length,
      approvedEnrollments: approved,
      pendingEnrollments: pending,
      rejectedEnrollments: rejected,
      monthlyEnrollments,
      topCourses,
      approvalRate: enrollments.length > 0 ? Math.round((approved / enrollments.length) * 100) : 0,
    }
  }, [students.length, courses.length, enrollments, categories.length])

  const maxMonthly = Math.max(...analytics.monthlyEnrollments.map((m) => m.count), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform performance and insights
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label="Total Students"
          value={analytics.totalStudents}
          icon={<Users className="w-5 h-5" />}
          color="blue"
          loading={isLoading}
        />
        <StatBox
          label="Total Courses"
          value={analytics.totalCourses}
          icon={<BookOpen className="w-5 h-5" />}
          color="purple"
          loading={isLoading}
        />
        <StatBox
          label="Total Enrollments"
          value={analytics.totalEnrollments}
          icon={<ClipboardList className="w-5 h-5" />}
          color="green"
          loading={isLoading}
        />
        <StatBox
          label="Approval Rate"
          value={`${analytics.approvalRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="yellow"
          loading={isLoading}
        />
      </div>

      {/* Enrollment Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Enrollments Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Enrollment Trends</h2>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              {analytics.monthlyEnrollments.map((item) => (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8">{item.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gray-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / maxMonthly) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enrollment Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Enrollment Status</h2>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-4">
              <StatusRow
                label="Approved"
                count={analytics.approvedEnrollments}
                total={analytics.totalEnrollments}
                icon={<CheckCircle className="w-4 h-4 text-green-500" />}
                color="bg-green-500"
              />
              <StatusRow
                label="Pending"
                count={analytics.pendingEnrollments}
                total={analytics.totalEnrollments}
                icon={<Clock className="w-4 h-4 text-yellow-500" />}
                color="bg-yellow-500"
              />
              <StatusRow
                label="Rejected"
                count={analytics.rejectedEnrollments}
                total={analytics.totalEnrollments}
                icon={<XCircle className="w-4 h-4 text-red-500" />}
                color="bg-red-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Most Popular Courses</h2>
        {isLoading ? (
          <div className="h-32 flex items-center justify-center text-sm text-gray-500">Loading...</div>
        ) : analytics.topCourses.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-sm text-gray-500">No enrollment data yet</div>
        ) : (
          <div className="space-y-3">
            {analytics.topCourses.map((course, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title || 'Unknown Course'}</p>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {course.count} enrollment{course.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Platform Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{analytics.totalCategories}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{analytics.totalStudents}</p>
            <p className="text-xs text-gray-500">Students</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{analytics.totalCourses}</p>
            <p className="text-xs text-gray-500">Courses</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ClipboardList className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{analytics.totalEnrollments}</p>
            <p className="text-xs text-gray-500">Enrollments</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatBox = ({
  label,
  value,
  icon,
  color,
  loading,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'yellow'
  loading: boolean
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? '—' : value}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

const StatusRow = ({
  label,
  count,
  total,
  icon,
  color,
}: {
  label: string
  count: number
  total: number
  icon: React.ReactNode
  color: string
}) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default AnalyticsPage
