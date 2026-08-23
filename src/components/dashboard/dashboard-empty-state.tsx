'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { BookOpen } from 'lucide-react'

const DashboardEmptyState = () => {
  const router = useRouter()

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No courses yet
      </h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
        You haven&apos;t enrolled in any courses yet. Explore our catalog and start learning today.
      </p>
      <button
        onClick={() => router.push(ROUTES.STUDENT_COURSES)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Browse Courses
      </button>
    </div>
  )
}

export default DashboardEmptyState
