'use client'


import { useRouter } from 'next/navigation'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import type { Lesson } from '@/store/lesson/lessonApi'
import { getCourseId } from '@/lib/utils/enrollment'

interface CourseSyallabusProps {
    lessons: Lesson[]
    isLoading?: boolean
}

const CourseSyallabus: React.FC<CourseSyallabusProps> = ({ lessons, isLoading = false }) => {
    const router = useRouter()

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                {/* Title & Lesson Count */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Course Syllabus</h2>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">{lessons.length} lessons</p>
                </div>

                {/* Back Button */}
                <div className="mt-3 sm:mt-0">
                    <button
                        onClick={() => router.push(ROUTES.STUDENT_MY_COURSES)}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                </div>
            </div>


            {/* Lesson Cards */}
            <div className="space-y-4">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 animate-pulse rounded-lg sm:rounded-xl p-4 lg:p-6 h-20 sm:h-24"
                        />
                    ))
                    : lessons.length === 0
                        ? <p className="text-gray-500 text-sm">No lessons available for this course.</p>
                        : lessons.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                onClick={() =>
                                    router.push(
                                        ROUTES.studentVideoPlay(getCourseId(lesson.courseId), lesson.id)
                                    )
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        router.push(
                                            ROUTES.studentVideoPlay(getCourseId(lesson.courseId), lesson.id)
                                        )
                                    }
                                }}
                                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                                    {/* Lesson Number */}
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="text-gray-600 font-semibold text-xs sm:text-sm lg:text-base">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* Lesson Title & Description */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate mb-1 sm:mb-2">
                                            {lesson.title}
                                        </h3>
                                        {lesson.description && (
                                            <p className="text-gray-500 text-xs sm:text-sm truncate hidden sm:block">
                                                {lesson.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Chevron Icon */}
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 ml-2 sm:ml-4" />
                            </div>
                        ))}
            </div>
        </div>
    )
}

export default CourseSyallabus
