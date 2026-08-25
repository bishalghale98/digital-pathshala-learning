'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { Play, BookOpen } from 'lucide-react'
import type { MyCourse } from '@/store/student/studentApi'
import { getCourse } from '@/lib/utils/enrollment'

interface EnrolledCourseCardProps {
  enrollment: MyCourse
  totalLessons: number
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({
  enrollment,
  totalLessons,
}) => {
  const router = useRouter()
  const course = getCourse(enrollment)
  const completedCount = enrollment.completedLessons?.length || 0
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  if (!course) return null

  const courseId = enrollment.courseId as string
  const handleContinue = () => {
    router.push(ROUTES.studentCourseSyllabus(courseId))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Course header */}
      <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
        <BookOpen className="w-10 h-10 text-white/30" />
        {progress > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
            {progress}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
          {course.title}
        </h3>
        {course.duration && (
          <p className="text-xs text-gray-500 mb-3">{course.duration}</p>
        )}

        {/* Progress bar */}
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

        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          {progress > 0 ? 'Continue' : 'Start'}
        </button>
      </div>
    </div>
  )
}

export default EnrolledCourseCard
