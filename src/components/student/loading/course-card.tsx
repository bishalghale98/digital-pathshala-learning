import React from 'react'

export const CourseCardSkeleton = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            {/* Header skeleton */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="h-10 w-64 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Course cards grid skeleton */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl bg-gray-200 shadow-lg animate-pulse"
                        >
                            {/* Decorative top corner skeleton */}
                            <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 rounded-full bg-gray-300" />

                            {/* Card content skeleton */}
                            <div className="relative p-6 h-full flex flex-col">
                                {/* Icon and title row skeleton */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 w-full">
                                        {/* Icon skeleton */}
                                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                        <div className="flex-1">
                                            {/* Title skeleton */}
                                            <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                                            {/* Metadata skeleton */}
                                            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                    {/* Progress badge skeleton */}
                                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                </div>

                                {/* Description skeleton */}
                                <div className="space-y-2 mb-6 grow">
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                                </div>

                                {/* Progress bar skeleton */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-20 bg-gray-300 rounded"></div>
                                        <div className="h-4 w-16 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="w-full bg-gray-300 rounded-full h-2"></div>
                                </div>

                                {/* Action button skeleton */}
                                <div className="w-full px-4 py-3 bg-gray-300 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats summary skeleton */}
                <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="text-center p-4">
                                <div className="h-10 w-16 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse"></div>
                                <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
