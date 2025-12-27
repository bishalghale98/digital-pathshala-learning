'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchMyCourses, fetchMyLesson, fetchMyLessons } from '@/store/student/studentSlice'
import { ILesson, IMyCourse } from '@/store/student/types'
import React, { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CourseSyallabus from '@/components/student/course/course-syllabus'
import VideoPlaySection from '@/components/student/course/video-play-section';

const MyCoursePage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { MyCourses, Lessons }: { MyCourses: IMyCourse[], Lessons: ILesson[] } = useAppSelector(
        (store) => store.students
    )

    useEffect(() => {
        dispatch(fetchMyCourses())
    }, [dispatch])

    const searchParams = useSearchParams()



    const { section, courseId, lessonId } = useMemo(() => ({
        section: searchParams.get('section'),
        courseId: searchParams.get('courseId'),
        lessonId: searchParams.get('lessonId'),
    }), [searchParams])

    useEffect(() => {
        if (courseId) {
            dispatch(fetchMyLessons(courseId))
        }
    }, [dispatch, courseId])

    useEffect(() => {
        if (section === 'video_play' && courseId && lessonId && Lessons.length > 0) {
            dispatch(fetchMyLesson(lessonId))
        }
    }, [dispatch, section, courseId, lessonId, Lessons])




    if (section === 'course-syllabus' && courseId) {
        return (
            <CourseSyallabus courseId={courseId} />
        )
    }

    if (section === 'video_play' && courseId && lessonId) {
        return (
            <VideoPlaySection lessonId={lessonId} />
        )
    }





    return (
        <div className="p-6 ">
            {/* Page Title */}
            <h1 className="text-2xl font-semibold mb-6">My Courses</h1>

            {/* Empty State */}
            {MyCourses?.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    You are not enrolled in any course yet.
                </div>
            )}

            {/* Course Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-white">
                {MyCourses?.map((enroll) => (
                    <div
                        key={enroll._id}
                        className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                        {/* Card Header */}
                        <div className="p-5 border-b dark:border-gray-800">
                            <h2 className="text-lg font-semibold line-clamp-1">
                                {enroll.courseId.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {enroll.courseId.description}
                            </p>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                                <span>Duration</span>
                                <span className="font-medium">
                                    {enroll.courseId.duration}
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
                                        `/student/mycourse?section=course-syllabus&courseId=${enroll.courseId._id}`
                                    )
                                }
                                className="px-4 py-2 text-sm rounded-md bg-primary text-white
                  hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Study
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyCoursePage
