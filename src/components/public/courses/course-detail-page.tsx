'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { BookOpen, Clock, Users, Tag, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextContent } from '@/components/editor/rich-text-content'
import EnrollModal from '@/components/student/course/enroll-modal'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { PublicCourse } from '@/lib/queries/course';
import { resolveImageUrl } from '@/lib/storage/url'


type CourseDetailPageProps = {
    course: PublicCourse
}

const CourseDetailPage = ({ course }: CourseDetailPageProps) => {
    const [showAllLessons, setShowAllLessons] = useState(false)
    const [enrollOpen, setEnrollOpen] = useState(false)
    const formattedPrice = course.price.toString()
    const thumbnailUrl = resolveImageUrl(course.thumbnail)

    console.log('thumbnailUrl', thumbnailUrl)






    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC0ydi0ySDE4djJoNHptNCAydi0ySDE4djJoNnptNCA0djItMjJoLTJ2MmgxeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    {/* Breadcrumb */}
                    <Link
                        href={ROUTES.COURSES}
                        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Courses
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Left: Course Info */}
                        <div className="space-y-6">
                            {/* Categories */}
                            {course.categories?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {course.categories.map((item) => (
                                        <span
                                            key={item.id}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {item.category.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                {course.title}
                            </h1>

                            {/* Short Description */}
                            {course.shortDescription && (
                                <p className="text-lg text-white/70 leading-relaxed">
                                    {course.shortDescription}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
                                {course.duration && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {course.duration}
                                    </span>
                                )}

                            </div>

                            {/* Price + CTA */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                                <span className="text-3xl font-bold text-white">
                                    {formattedPrice == "0" ? 'Free' : formattedPrice}
                                </span>
                                <Button
                                    size="lg"
                                    onClick={() => setEnrollOpen(true)}
                                    className="bg-white text-gray-900 hover:bg-white/90 px-8 py-3 text-base font-semibold"
                                >
                                    Enroll Now
                                </Button>
                            </div>
                        </div>

                        {/* Right: Thumbnail */}
                        <div className="hidden lg:block">
                            {thumbnailUrl ? (
                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                    <Image
                                        src={thumbnailUrl}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                                    <BookOpen className="w-20 h-20 text-white/20" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Thumbnail */}
            {thumbnailUrl && (
                <div className="lg:hidden -mt-8 relative z-10 px-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                        <Image
                            src={thumbnailUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        {course.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>About This Course</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RichTextContent content={course.description} />
                                </CardContent>
                            </Card>
                        )}


                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Course Info Card */}
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Course Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">Price</span>
                                    <span className="text-sm font-semibold">{formattedPrice == "0" ? 'free' : formattedPrice}</span>
                                </div>

                                {course.duration && (
                                    <div className="flex justify-between items-center py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">Duration</span>
                                        <span className="text-sm font-semibold">{course.duration}</span>
                                    </div>
                                )}

                                {course.categories?.length > 0 && (
                                    <div className="flex justify-between items-start py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">Categories</span>
                                        <div className="flex flex-wrap justify-end gap-1 max-w-[60%]">
                                            {course.categories.map((item) => (
                                                <span
                                                    key={item.id}
                                                    className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                                                >
                                                    {item.category.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}



                                {/* Enroll CTA */}
                                <Button
                                    onClick={() => setEnrollOpen(true)}
                                    className="w-full mt-4"
                                    size="lg"
                                >
                                    Enroll Now
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Enroll Modal */}
            {enrollOpen && (
                <EnrollModal
                    closeModal={() => setEnrollOpen(false)}
                    courseId={course.id}
                />
            )}
        </div>
    )
}

export default CourseDetailPage
