// components/course/EmptyState.tsx
import React from 'react'

interface EmptyStateProps {
    openAddModal: () => void
    title?: string
    description?: string
    buttonText?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
    openAddModal,
    title = "No courses found",
    description = "Get started by creating your first course",
    buttonText = "Add Course"
}) => {
    return (
        <div className="py-12 px-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
            <button
                onClick={openAddModal}
                className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-colors flex items-center justify-center gap-2 mx-auto"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {buttonText}
            </button>
        </div>
    )
}

export default EmptyState