'use client'

import PaymentModal from '@/components/enrollment/payment-modal'
import { EnrollmentStatus } from '@/schemas/enrollmentSchema'
import {
    useChangeEnrollmentStatusMutation,
    useGetEnrollmentsQuery,
    type Enrollment,
} from '@/store/enrollment/enrollmentApi'
import { getErrorMessage } from '@/store/api/base'
import { useState } from 'react'
import { toast } from 'sonner'

const getStudent = (enrollment: Enrollment) =>
    typeof enrollment.studentId === "object" ? enrollment.studentId : null

const getCourse = (enrollment: Enrollment) =>
    typeof enrollment.courseId === "object" ? enrollment.courseId : null

const EnrollmentPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectedId, setSelectedId] = useState('')

    const { data: enrollments = [], isLoading, refetch } = useGetEnrollmentsQuery()
    const [changeEnrollmentStatus] = useChangeEnrollmentStatusMutation()

    const filterEnrollments = enrollments.filter(enrollment =>
        getStudent(enrollment)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCourse(enrollment)?.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleApprove = async (id: string) => {
        try {
            await changeEnrollmentStatus({ id, body: { enrollmentStatus: EnrollmentStatus.Approved } }).unwrap();
            toast.success('Enrollment approved');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleReject = async (id: string) => {
        try {
            await changeEnrollmentStatus({ id, body: { enrollmentStatus: EnrollmentStatus.Rejected } }).unwrap();
            toast.success('Enrollment rejected');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };








    // Show empty state
    if (!isLoading && enrollments.length === 0) {
        return (
            <div className="flex flex-col">
                <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white rounded-xl border border-gray-200">
                    <div className="mb-4">
                        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Enrollments Found</h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                        There are no enrollments in the system yet. New enrollments will appear here once students enroll from the student portal.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        )
    }

    // Show no search results state
    if (filterEnrollments.length === 0 && searchTerm) {
        return (
            <div className="flex flex-col">
                <div className="mb-6">
                    <div className="relative text-gray-500 focus-within:text-gray-900">
                        <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z" stroke="black" strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </div>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            className="block w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
                            placeholder="Search enrollments..."
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white rounded-xl border border-gray-200">
                    <div className="mb-4">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                        No enrollments match your search for &quot;<span className="font-medium text-gray-700">&quot;{searchTerm}&quot;</span>&quot;. Try different keywords or clear your search.
                    </p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Clear Search
                    </button>
                </div>
            </div>
        )
    }

    // Main table view
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    <div className="relative text-gray-500 focus-within:text-gray-900 mb-4">
                        <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z" stroke="black" strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </div>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            className="block w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
                            placeholder="Search by student name or course title..."
                        />
                        {searchTerm && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
                        <p className="text-gray-600">
                            Showing {filterEnrollments.length} of {enrollments.length} enrollment{enrollments.length !== 1 ? 's' : ''}
                            {searchTerm && ` matching "${searchTerm}"`}
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Enrollment ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Student Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Course Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Enrolled At</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">WhatsApp</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            Loading enrollments...
                                        </td>
                                    </tr>
                                )}
                                {filterEnrollments.map((enrollment) => (
                                    <tr key={enrollment._id} className="hover:bg-gray-50 transition-colors">
                                        <td
                                            onClick={() => {
                                                setSelectedId(enrollment._id)
                                                setIsOpenModal(true)
                                            }}
                                            className="px-6 py-4 whitespace-nowrap cursor-pointer">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] underline decoration-dotted underline-offset-4" title={enrollment._id}>
                                                {enrollment._id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{getStudent(enrollment)?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{getCourse(enrollment)?.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${enrollment.enrollmentStatus === EnrollmentStatus.Approved ? 'bg-green-100 text-green-800' :
                                                    enrollment.enrollmentStatus === EnrollmentStatus.Pending ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {enrollment.enrollmentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{enrollment.whatsapp}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleReject(enrollment._id)}
                                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => handleApprove(enrollment._id)}
                                                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>{
                isOpenModal && <PaymentModal
                    isOpen={isOpenModal}
                    onClose={() => setIsOpenModal(false)}
                    selectedId={selectedId}
                />
            }
        </div>
    )
}

export default EnrollmentPage