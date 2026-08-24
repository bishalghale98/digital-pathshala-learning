'use client'

import React from 'react'
import { BookOpen, Plus } from 'lucide-react'

interface CourseEmptyStateProps {
  hasFilters: boolean
  onAddCourse: () => void
}

export const CourseEmptyState: React.FC<CourseEmptyStateProps> = ({ hasFilters, onAddCourse }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
      <p className="text-sm font-medium text-gray-900">
        {hasFilters ? 'No courses found' : 'No courses yet'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {hasFilters ? 'Try adjusting your filters' : 'Create your first course to get started'}
      </p>
      {!hasFilters && (
        <button
          onClick={onAddCourse}
          className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      )}
    </div>
  )
}
