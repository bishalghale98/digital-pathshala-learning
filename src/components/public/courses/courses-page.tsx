'use client'

import React from 'react';
import Link from 'next/link';
import { useGetPublicCoursesQuery } from '@/store/public/publicApi';
import { ROUTES } from '@/lib/constants';
import { BookOpen, Clock, ArrowRight, Loader2 } from 'lucide-react';

export default function CoursesPage() {
    const { data: courses = [], isLoading, error } = useGetPublicCoursesQuery();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
                    <p className="mt-2 text-gray-600">Explore our full catalog of courses</p>
                </div>
            </section>

            {/* Course Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">Failed to load courses. Please try again later.</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No courses available yet.</p>
                        <p className="text-gray-400 mt-1">Check back soon for new courses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link
                                key={course._id}
                                href={ROUTES.courseDetail(course._id)}
                                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-white/80" />
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        {typeof course.categoryId === 'object' && course.categoryId && (
                                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                {course.categoryId.name}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            {course.duration && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {course.duration}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            View <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
