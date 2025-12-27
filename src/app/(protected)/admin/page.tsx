'use client'

import React, { useEffect, useMemo } from 'react'
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react'
import StatCard from '@/components/dashboard/admin-stat-card'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchStudents } from '@/store/student/studentSlice'
import { fetchCourses } from '@/store/course/courseSlice'
import { fetchEnrollements } from '@/store/enrollment/enrollmentSlice'
import { EnrollmentStatus } from '@/types/models'

const AdminPage = () => {
    const dispatch = useAppDispatch()

    const { Students } = useAppSelector((store) => store.students)
    const { Courses } = useAppSelector((store) => store.courses)
    const { Enrollments } = useAppSelector((store) => store.enrollments)



    useEffect(() => {
        dispatch(fetchStudents())
        dispatch(fetchCourses());
        dispatch(fetchEnrollements());
    }, [dispatch])

    const stats = useMemo(() => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        let approved = 0
        let pending = 0
        let last7Days = 0

        for (const e of Enrollments) {
            if (e.enrollmentStatus === EnrollmentStatus.Approved) approved++
            if (e.enrollmentStatus === EnrollmentStatus.Pending) pending++
            if (new Date(e.createdAt) >= sevenDaysAgo) last7Days++
        }

        return {
            totalStudents: Students.length,
            totalCourses: Courses.length,
            approvedEnrollments: approved,
            pendingEnrollments: pending,
            newEnrollmentsLast7Days: last7Days,
        }
    }, [Students.length, Courses.length, Enrollments])



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
