'use client'

import React, { Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CourseSyallabus from '@/components/student/course/course-syllabus'
import VideoPlaySection from '@/components/student/course/video-play-section';
import {
    useGetMyCoursesQuery,
    useGetStudentLessonsQuery,
} from '@/store/student/studentApi'
import type { Lesson } from '@/store/lesson/lessonApi'
import type { MyCourse } from '@/store/student/studentApi'

const getCourse = (enroll: MyCourse) =>
    typeof enroll.courseId === "object" ? enroll.courseId : null

const getCourseId = (courseId: string | { _id: string }) =>
    typeof courseId === "string" ? courseId : courseId._id

function MyCourseContent() {
    const router = useRouter()

    const searchParams = useSearchParams()

    const { section, courseId, lessonId } = useMemo(() => ({
        section: searchParams.get('section'),
        courseId: searchParams.get('courseId'),
        lessonId: searchParams.get('lessonId'),
    }), [searchParams])

    const { data: myCourses = [] } = useGetMyCoursesQuery()
    const { data: lessons = [], isLoading: lessonsLoading } = useGetStudentLessonsQuery(
        courseId ?? '',
        { skip: !courseId }
    )

    const activeLesson: Lesson | undefined = useMemo(
        () => lessons.find((lesson) => lesson._id === lessonId),
        [lessons, lessonId]
    )

    if (section === 'course-syllabus' && courseId) {
        return (
            <CourseSyallabus lessons={lessons} isLoading={lessonsLoading} />
        )
    }

    if (section === 'video_play' && courseId && lessonId) {
        return (
            <VideoPlaySection
                lessons={lessons}
                activeLesson={activeLesson ?? null}
                isLoading={lessonsLoading}
            />
        )
    }

    return (
        <div className="p-6 ">
            {/* Page Title */}
            <h1 className="text-2xl font-semibold mb-6">My Courses</h1>

            {/* Empty State */}
            {myCourses.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    You are not enrolled in any course yet.
                </div>
            )}

            {/* Course Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-white">
                {myCourses.map((enroll) => {
                    const course = getCourse(enroll)
                    return (
                    <div
                        key={enroll?._id}
                        className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                        {/* Card Header */}
                        <div className="p-5 border-b dark:border-gray-800">
                            <h2 className="text-lg font-semibold line-clamp-1">
                                {course?.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {course?.description}
                            </p>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                                <span>Duration</span>
                                <span className="font-medium">
                                    {course?.duration}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Enrolled At</span>
                                <span className="font-medium">
                                    {new Date(enroll.enrolledAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-5 flex items-center justify-between border-t dark:border-gray-800">
                            {/* Status */}
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium
                  ${enroll.enrollmentStatus === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {enroll.enrollmentStatus}
                            </span>

                            {/* Action Button */}
                            <button
                                disabled={enroll.enrollmentStatus !== 'Approved'}
                                onClick={() =>
                                    router.push(
                                        `/student/mycourse?section=course-syllabus&courseId=${getCourseId(enroll.courseId)}`
                                    )
                                }
                                className="px-4 py-2 text-sm rounded-md bg-primary text-white
                  hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Study
                            </button>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}

const MyCoursePage = () => (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <MyCourseContent />
    </Suspense>
)

export default MyCoursePage
