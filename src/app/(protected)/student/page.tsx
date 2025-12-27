'use client'

import React, { useEffect } from 'react'
import { BookOpen, CheckCircle, Clock } from 'lucide-react'
import StatCard from '@/components/dashboard/admin-stat-card'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { IMyCourse } from '@/store/student/types'
import { fetchMyCourses } from '@/store/student/studentSlice'

const StudentDashboardPage = () => {
  const dispatch = useAppDispatch()

  const { MyCourses }: { MyCourses: IMyCourse[] } = useAppSelector(
    (store) => store.students
  )

  useEffect(() => {
    dispatch(fetchMyCourses())
  }, [dispatch])


  const totalCourses = MyCourses.length


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Student!</h1>
          <p className="text-sm text-gray-500 mt-1">Your learning progress at a glance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="My Courses"
            value={totalCourses}
            icon={<BookOpen size={22} />}
            color="blue"
          />

        </div>

        {/* Recent Courses / Activity */}
        {/* <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Courses</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex justify-between border-b pb-2">
              <span>React.js Basics</span>
              <span className="text-gray-400">In Progress</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span>Node.js & Express</span>
              <span className="text-gray-400">Completed</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span>Database Fundamentals</span>
              <span className="text-gray-400">Pending</span>
            </li>
          </ul>
        </div> */}
      </div>


    </div>
  )
}

export default StudentDashboardPage
