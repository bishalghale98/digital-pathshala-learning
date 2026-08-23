import React from 'react'

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome skeleton */}
      <div>
        <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-96 bg-gray-200 rounded" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-7 w-12 bg-gray-200 rounded" />
              </div>
              <div className="w-11 h-11 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Continue learning skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg" />
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-8 bg-gray-200 rounded" />
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Course cards skeleton */}
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gray-200" />
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
                <div className="h-1.5 w-full bg-gray-200 rounded-full mb-3" />
                <div className="h-9 w-full bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton
