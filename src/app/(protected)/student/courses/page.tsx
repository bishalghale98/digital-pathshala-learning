'use client'

import CourseCard from '@/components/student/course/course-card'
import EnrollModal from '@/components/student/course/enroll-modal';
import { CourseCardSkeleton } from '@/components/student/loading/course-card';
import { fetchCourses } from '@/store/course/courseSlice';
import { ICourse } from '@/store/course/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Status } from '@/store/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

const CoursesPage = () => {

    const { Courses, status }: { Courses: ICourse[], status: Status } = useAppSelector((store) => store.courses)
    const { PaymentUrl } = useAppSelector((store) => store.enrollments)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [courseId, setCourseId] = useState<string>('')


    const openModal = useCallback((id: string) => {
        setIsOpen(true)
        setCourseId(id)
    }, [])

    const closeModal = useCallback(() => {
        setIsOpen(false)
    }, [])


    useEffect(() => {
        if (PaymentUrl) {
            window.open(PaymentUrl, "_blank", "noopener,noreferrer");

        }
    }, [PaymentUrl])


    useEffect(() => {
        const pidx = new URLSearchParams(window.location.search).get("pidx");
        if (!pidx) return;

        axios.post("/api/payment/verify", { pidx }).then(() => router.replace('/student/courses'))

    }, [router]);


    useEffect(() => {
        dispatch(fetchCourses())
    }, [dispatch])

    if (status === Status.Loading && Courses.length === 0) {
        return <CourseCardSkeleton />
    }

    const coursesLength = Courses.length


    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    My Courses
                </h1>
                <p className="text-gray-600">
                    Continue your learning journey with these courses
                </p>
            </div>

            {/* Course cards grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Courses.map((course) => (
                        <CourseCard
                            key={course._id}
                            id={course._id}
                            title={course.title}
                            description={course.description}
                            price={course.price}
                            duration={course.duration}
                            category={course.categoryId.name}
                            openModal={openModal}
                        />
                    ))}
                </div>

                {/* Stats summary */}
                <div className=" mt-12 p-6 bg-white rounded-2xl shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-blue-600">{coursesLength}</div>
                            <div className="text-gray-600 mt-1">Total Courses</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-emerald-600">222</div>
                            <div className="text-gray-600 mt-1">Lessons</div>
                        </div>
                        {/* <div className="text-center p-4">
                            <div className="text-3xl font-bold text-purple-600">344h</div>
                            <div className="text-gray-600 mt-1">Total Duration</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-amber-600">52%</div>
                            <div className="text-gray-600 mt-1">Avg. Progress</div>
                        </div> */}
                    </div>
                </div>
            </div>
            {
                isOpen && <EnrollModal closeModal={closeModal} courseId={courseId} />

            }
        </div>
    )
}

export default CoursesPage