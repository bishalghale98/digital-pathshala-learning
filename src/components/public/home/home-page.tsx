'use client'

import React from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { getDashboardPath } from '@/lib/dashboard';
import { ROUTES } from '@/lib/constants';
import { useGetPublicCoursesQuery, useGetPublicCategoriesQuery, useGetPublicStatsQuery } from '@/store/public/publicApi';
import {
    BookOpen, Users, Clock, Award, ArrowRight, CheckCircle,
    Monitor, TrendingUp, Lightbulb, Zap, GraduationCap,
    Loader2, ChevronRight
} from 'lucide-react';

export default function HomePage() {
    const { data: session } = authClient.useSession();
    const { data: courses = [], isLoading: coursesLoading } = useGetPublicCoursesQuery();
    const { data: categories = [] } = useGetPublicCategoriesQuery();
    const { data: stats } = useGetPublicStatsQuery();

    const isAuthenticated = !!session?.user;
    const role = session?.user?.role;

    const displayCourses = courses.slice(0, 6);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC00aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-sm text-blue-100">Platform is live</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                Learn New Skills.
                                <br />
                                <span className="text-blue-200">Advance Your Career.</span>
                            </h1>
                            <p className="mt-6 text-lg text-blue-100 max-w-lg leading-relaxed">
                                Structured courses designed to help you build practical knowledge
                                and grow in your field. Start learning at your own pace.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={ROUTES.COURSES}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Browse Courses
                                </Link>
                                {isAuthenticated ? (
                                    <Link
                                        href={getDashboardPath(role)}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={ROUTES.SIGN_IN}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Start Learning
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="hidden lg:flex justify-center">
                            <div className="relative">
                                <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <BookOpen className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="h-3 bg-white/30 rounded w-24"></div>
                                                <div className="h-2 bg-white/20 rounded w-16 mt-1"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                                <Monitor className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="h-3 bg-white/30 rounded w-28"></div>
                                                <div className="h-2 bg-white/20 rounded w-20 mt-1"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="h-3 bg-white/30 rounded w-20"></div>
                                                <div className="h-2 bg-white/20 rounded w-14 mt-1"></div>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-white/10 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-white/80">Progress</span>
                                                <span className="text-sm text-white font-medium">72%</span>
                                            </div>
                                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-400 rounded-full" style={{ width: '72%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl"></div>
                                <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900">
                                {stats?.courses ?? 0}+
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Courses</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900">
                                {stats?.categories ?? 0}+
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Categories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900">100%</div>
                            <div className="text-sm text-gray-500 mt-1">Online Learning</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900">24/7</div>
                            <div className="text-sm text-gray-500 mt-1">Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
                        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                            Explore courses designed to help you build practical skills and grow your knowledge.
                        </p>
                    </div>

                    {coursesLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    ) : displayCourses.length === 0 ? (
                        <div className="text-center py-16">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Courses coming soon. Check back later.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayCourses.map((course) => (
                                    <Link
                                        key={course._id}
                                        href={ROUTES.courseDetail(course._id)}
                                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="h-44 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
                                            <BookOpen className="w-10 h-10 text-white/70" />
                                            {typeof course.categoryId === 'object' && course.categoryId && (
                                                <span className="absolute top-3 left-3 text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                                    {course.categoryId.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5">
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
                            <div className="text-center mt-10">
                                <Link
                                    href={ROUTES.COURSES}
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    View All Courses
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why Learn With Us</h2>
                        <p className="mt-3 text-gray-600">
                            Everything you need to learn effectively and reach your goals.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <GraduationCap className="w-6 h-6" />,
                                title: 'Structured Learning',
                                description: 'Follow organized courses designed to build knowledge step by step.',
                                color: 'bg-blue-50 text-blue-600',
                            },
                            {
                                icon: <Monitor className="w-6 h-6" />,
                                title: 'Learn Anywhere',
                                description: 'Access your courses from any device, anytime, anywhere.',
                                color: 'bg-purple-50 text-purple-600',
                            },
                            {
                                icon: <TrendingUp className="w-6 h-6" />,
                                title: 'Track Progress',
                                description: 'Monitor your learning progress and pick up where you left off.',
                                color: 'bg-green-50 text-green-600',
                            },
                            {
                                icon: <Award className="w-6 h-6" />,
                                title: 'Practical Skills',
                                description: 'Build real knowledge through hands-on, project-based courses.',
                                color: 'bg-amber-50 text-amber-600',
                            },
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
                            <p className="mt-3 text-gray-600">
                                Find courses in the topics that matter to you.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.slice(0, 6).map((category) => (
                                <Link
                                    key={category._id}
                                    href={ROUTES.COURSES}
                                    className="group flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* How It Works */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Start Learning in 3 Steps</h2>
                        <p className="mt-3 text-gray-600">
                            Getting started is simple and takes just a few minutes.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200"></div>
                        {[
                            {
                                step: '1',
                                title: 'Create Your Account',
                                description: 'Sign up with your Google account to get started instantly.',
                                icon: <Users className="w-6 h-6" />,
                            },
                            {
                                step: '2',
                                title: 'Choose a Course',
                                description: 'Browse our catalog and find the course that fits your goals.',
                                icon: <BookOpen className="w-6 h-6" />,
                            },
                            {
                                step: '3',
                                title: 'Start Learning',
                                description: 'Enroll and begin learning at your own pace from your dashboard.',
                                icon: <Zap className="w-6 h-6" />,
                            },
                        ].map((item, index) => (
                            <div key={index} className="relative text-center">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 relative z-10">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Learning Experience */}
            <section className="py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Everything You Need to Learn
                            </h2>
                            <p className="mt-4 text-gray-600 leading-relaxed">
                                Our platform provides a complete learning environment designed to
                                help you succeed. From structured lessons to progress tracking,
                                you have all the tools you need.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {[
                                    'Structured lessons organized by topic',
                                    'Track your course progress in real-time',
                                    'Pick up right where you left off',
                                    'Access learning materials on any device',
                                    'Learn at your own pace, on your schedule',
                                    'Enroll in courses that match your goals',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <div className="space-y-4">
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <BookOpen className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Web Development Basics</div>
                                            <div className="text-xs text-gray-500">12 lessons</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">65%</span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Lightbulb className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">JavaScript Fundamentals</div>
                                            <div className="text-xs text-gray-500">18 lessons</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '40%' }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">40%</span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">React for Beginners</div>
                                            <div className="text-xs text-gray-500">15 lessons</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '20%' }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">20%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Ready to Start Learning?
                    </h2>
                    <p className="mt-4 text-blue-100 text-lg max-w-2xl mx-auto">
                        Build new skills and take the next step in your learning journey.
                        Join the platform and start growing today.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href={ROUTES.COURSES}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            <BookOpen className="w-5 h-5" />
                            Explore Courses
                        </Link>
                        {!isAuthenticated && (
                            <Link
                                href={ROUTES.SIGN_IN}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Create Free Account
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">BISAN LMS</span>
                            </Link>
                            <p className="text-sm leading-relaxed max-w-sm">
                                Learn practical skills through structured online courses.
                                Track your progress and grow your knowledge at your own pace.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
                            <ul className="space-y-2">
                                <li><Link href={ROUTES.COURSES} className="text-sm hover:text-white transition-colors">Courses</Link></li>
                                <li><Link href={ROUTES.ABOUT} className="text-sm hover:text-white transition-colors">About</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h3>
                            <ul className="space-y-2">
                                {isAuthenticated ? (
                                    <li><Link href={getDashboardPath(role)} className="text-sm hover:text-white transition-colors">Dashboard</Link></li>
                                ) : (
                                    <>
                                        <li><Link href={ROUTES.SIGN_IN} className="text-sm hover:text-white transition-colors">Log In</Link></li>
                                        <li><Link href={ROUTES.SIGN_IN} className="text-sm hover:text-white transition-colors">Sign Up</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm">
                        <p>&copy; {new Date().getFullYear()} BISAN LMS. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
