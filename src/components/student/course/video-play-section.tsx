'use client'

import { getYoutubeEmbedUrl } from '@/lib/helper/getYoutubeEmbedUrl'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ROUTES } from '@/lib/constants'
import { ArrowLeft, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { Lesson } from '@/store/lesson/lessonApi'

interface VideoPlaySectionProps {
    lessons: Lesson[]
    activeLesson: Lesson | null
    isLoading?: boolean
}

const getCourseId = (courseId: string | { _id: string; title?: string }) =>
    typeof courseId === "string" ? courseId : courseId._id

const VideoPlaySection: React.FC<VideoPlaySectionProps> = ({
    lessons,
    activeLesson,
    isLoading = false,
}) => {
    const router = useRouter()

    const backButton = () => { router.push(ROUTES.studentCourseSyllabus(getCourseId(activeLesson?.courseId ?? ''))) }

    const currentIndex = activeLesson
        ? lessons.findIndex((l) => l._id === activeLesson._id)
        : -1

    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
    const nextLesson =
        currentIndex >= 0 && currentIndex < lessons.length - 1
            ? lessons[currentIndex + 1]
            : null

    const navigateToLesson = (lesson: Lesson) => {
        router.push(
            ROUTES.studentVideoPlay(getCourseId(lesson.courseId), lesson._id)
        )
    }

    const buttonClass =
        'px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-colors flex items-center justify-center gap-1 sm:gap-2'

    return (
        <div className="section animate-fadeIn">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                            Lessons
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Watch the lesson and follow along with the course
                        </p>
                    </div>
                    <button
                        onClick={() => backButton()}
                        className={`${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Syllabus</span>
                    </button>
                </div>

                {/* Video Player + Lessons */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Video Player */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="h-64 sm:h-96 bg-gray-900 flex items-center justify-center overflow-hidden">
                                {activeLesson?.videoUrl && (
                                    <iframe
                                        className="w-full h-full"
                                        src={getYoutubeEmbedUrl(activeLesson.videoUrl)}
                                        title="Video Player"
                                        frameBorder="0"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                )}
                            </div>
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                    {activeLesson?.title ?? (isLoading ? 'Loading lesson...' : '')}
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base mb-4">
                                    {activeLesson?.description}
                                </p>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between gap-2 sm:gap-4">
                                    <button
                                        onClick={() => prevLesson && navigateToLesson(prevLesson)}
                                        disabled={!prevLesson}
                                        className={`${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed`}
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </button>
                                    <button
                                        onClick={() => nextLesson && navigateToLesson(nextLesson)}
                                        disabled={!nextLesson}
                                        className={`${buttonClass} bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed`}
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lessons List */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Lessons</h3>

                        {lessons?.map((lesson, i) => {
                            const isActive = activeLesson?._id === lesson._id
                            return (
                                <div
                                    onClick={() =>
                                        router.push(
                                            ROUTES.studentVideoPlay(getCourseId(lesson.courseId), lesson._id)
                                        )}
                                    key={lesson._id}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            router.push(
                                                ROUTES.studentVideoPlay(getCourseId(lesson.courseId), lesson._id)
                                            )
                                        }
                                    }}
                                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-green-100 border border-green-200' : ''
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300">
                                        <Play className="w-3 h-3 text-white fill-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${isActive ? 'text-green-800' : 'text-gray-700'}`}>
                                            Day {i + 1} {lesson.title}
                                        </p>
                                        <p className="text-xs text-gray-500">{lesson.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlaySection
