'use client'

import { getYoutubeEmbedUrl } from '@/lib/helper/getYoutubeEmbedUrl'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import React from 'react'



const VideoPlaySection = () => {
    const router = useRouter()
    const { ActiveLesson, Lessons } = useAppSelector(store => store.students)



    const buttonClass =
        'px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-colors flex items-center justify-center gap-1 sm:gap-2'

    return (
        <div className="section animate-fadeIn">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                            {ActiveLesson?.courseId?.title}
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            {ActiveLesson?.courseId?.description}
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className={`${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Syllabus</span>
                    </button>
                </div>

                {/* Video Player + Lessons */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Video Player */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="h-64 sm:h-96 bg-gray-900 flex items-center justify-center overflow-hidden">
                                {ActiveLesson?.videoUrl && (
                                    <iframe
                                        className="w-full h-full"
                                        src={getYoutubeEmbedUrl(ActiveLesson.videoUrl)}
                                        title="Video Player"
                                        frameBorder="0"
                                        allowFullScreen
                                    />
                                )}
                            </div>
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                    {ActiveLesson?.title}
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base mb-4">
                                    {ActiveLesson?.description}
                                </p>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between gap-2 sm:gap-4">
                                    <button className={`${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}>
                                        <i className="fas fa-chevron-left"></i> Previous
                                    </button>
                                    <button className={`${buttonClass} bg-green-600 text-white hover:bg-green-700`}>
                                        Next <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lessons List */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Lessons</h3>

                        {Lessons?.map((lesson, i) => {
                            const isActive = ActiveLesson?._id === lesson._id
                            return (
                                <div
                                    onClick={() =>
                                        router.push(
                                            `/student/mycourse?section=video_play&courseId=${lesson.courseId._id}&lessonId=${lesson._id}`
                                        )}
                                    key={lesson._id}
                                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-green-100 border border-green-200' : ''
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300">
                                        <i className="fas fa-play text-white text-xs"></i>
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
