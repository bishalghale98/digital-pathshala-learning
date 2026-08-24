'use client'

import React from 'react'
import { Plus } from 'lucide-react'

interface CourseHeaderProps {
  onAddCourse: () => void
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ onAddCourse }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all courses</p>
      </div>
      <button
        onClick={onAddCourse}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Course
      </button>
    </div>
  )
}
