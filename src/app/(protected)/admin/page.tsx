'use client'

import React, { useMemo } from 'react'
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react'
import StatCard from '@/components/dashboard/admin-stat-card'
import { useGetStudentsQuery } from '@/store/student/studentApi'
import { useGetCoursesQuery } from '@/store/course/courseApi'
import { useGetEnrollmentsQuery } from '@/store/enrollment/enrollmentApi'
import { EnrollmentStatus } from '@/types/models'

const AdminPage = () => {
    const { data: students = [] } = useGetStudentsQuery()
    const { data: courses = [] } = useGetCoursesQuery()
    const { data: enrollments = [] } = useGetEnrollmentsQuery()



    const stats = useMemo(() => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        let approved = 0
        let pending = 0
        let last7Days = 0

        for (const e of enrollments) {
            if (e.enrollmentStatus === EnrollmentStatus.Approved) approved++
            if (e.enrollmentStatus === EnrollmentStatus.Pending) pending++
            if (e.createdAt && new Date(e.createdAt) >= sevenDaysAgo) last7Days++
        }

        return {
            totalStudents: students.length,
            totalCourses: courses.length,
            approvedEnrollments: approved,
            pendingEnrollments: pending,
            newEnrollmentsLast7Days: last7Days,
        }
    }, [students.length, courses.length, enrollments])



    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Platform overview & statistics
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalStudents}
                    icon={<Users size={22} />}
                    color="blue"
                />
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={<BookOpen size={22} />}
                    color="purple"
                />
                <StatCard
                    title="Approved Enrollments"
                    value={stats.approvedEnrollments}
                    icon={<CheckCircle size={22} />}
                    color="green"
                />
                <StatCard
                    title="Pending Enrollments"
                    value={stats.pendingEnrollments}
                    icon={<Clock size={22} />}
                    color="yellow"
                />
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left */}
                <div className="lg:col-span-2 bg-white rounded-xl border p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Enrollment Activity
                    </h2>
                    <div className="h-64 flex items-center justify-center text-gray-400 border rounded-lg">
                        Chart / Graph Placeholder
                    </div>
                </div>

                {/* Right */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Recent Actions
                    </h2>
                    <ul className="space-y-3 text-sm ">
                        <li className="flex justify-between text-gray-800">
                            <span>Enrollments from the last 7 days</span>
                            <span className="text-gray-600">{stats.newEnrollmentsLast7Days}</span>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdminPage
