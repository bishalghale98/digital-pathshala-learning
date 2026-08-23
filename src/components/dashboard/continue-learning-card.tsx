'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Play, Clock, BookOpen } from 'lucide-react'
import type { MyCourse } from '@/store/student/studentApi'
import type { Course } from '@/store/course/courseApi'
import type { Lesson } from '@/store/lesson/lessonApi'

interface ContinueLearningCardProps {
  enrollment: MyCourse
  totalLessons: number
}

const getCourse = (enrollment: MyCourse): Course | null => {
  if (typeof enrollment.courseId === 'object' && enrollment.courseId !== null) {
    return enrollment.courseId as Course
  }
  return null
}

const getLesson = (
  lesson: string | Lesson | undefined
): Lesson | null => {
  if (lesson && typeof lesson === 'object' && '_id' in lesson) {
    return lesson as Lesson
  }
  return null
}

const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  enrollment,
  totalLessons,
}) => {
  const router = useRouter()
  const course = getCourse(enrollment)
  const lastLesson = getLesson(enrollment.lastAccessedLesson)
  const completedCount = enrollment.completedLessons?.length || 0
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  if (!course) return null

  const handleContinue = () => {
    if (lastLesson) {
      const courseId =
        typeof enrollment.courseId === 'string'
          ? enrollment.courseId
          : (enrollment.courseId as Course)._id
      router.push(
        `/student/mycourse?section=video_play&courseId=${courseId}&lessonId=${lastLesson._id}`
      )
    } else {
      const courseId =
        typeof enrollment.courseId === 'string'
          ? enrollment.courseId
          : (enrollment.courseId as Course)._id
      router.push(`/student/mycourse?section=course-syllabus&courseId=${courseId}`)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                <Play className="w-3 h-3" />
                Continue
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {course.title}
            </h3>
            {lastLesson && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {lastLesson.title}
              </p>
            )}
          </div>
          <button
            onClick={handleContinue}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Play className="w-4 h-4" />
            Continue
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">
              {completedCount} of {totalLessons} lessons
            </span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {enrollment.lastAccessedAt && (
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last accessed {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default ContinueLearningCard
