"use client";

import React, { useCallback, useState } from "react";
import CourseModal from "@/components/course/modal";
import ConfirmationModal from "@/components/common/delete-modal";
import { useRouter } from "next/navigation";
import {
    useDeleteCourseMutation,
    useGetCoursesQuery,
    type Course,
} from "@/store/course/courseApi";
import { getErrorMessage } from "@/store/api/base";
import { toast } from "sonner";

const Courses = () => {
    const router = useRouter();

    const [openAddModal, setOpenAddModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

    const { data: courses = [], isLoading } = useGetCoursesQuery();
    const [deleteCourse] = useDeleteCourseMutation();

    const addModalOpen = useCallback(() => setOpenAddModal(true), []);

    const editModalOpen = useCallback((course: Course) => {
        setEditingCourse(course);
        setIsEditModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setOpenAddModal(false);
        setIsEditModalOpen(false);
        setEditingCourse(null);
    }, []);



    const openDeleteModal = useCallback((course: Course) => {
        setCourseToDelete(course)
    }, [])

    const handleDelete = useCallback(async () => {
        if (!courseToDelete) return;
        try {
            await deleteCourse(courseToDelete._id).unwrap();
            toast.success("Course deleted");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
        setCourseToDelete(null)
    }, [courseToDelete, deleteCourse])

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="w-full sm:w-auto">
                            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                            <p className="text-gray-600 mt-1">View all courses</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                />
                            </div>

                            <button
                                onClick={addModalOpen}
                                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Course
                            </button>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {["Title", "Description", "Duration", "Price", "Category", "Created At", "Action"].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                Loading courses...
                                            </td>
                                        </tr>
                                    ) : courses.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                No courses found
                                            </td>
                                        </tr>
                                    ) : (
                                        courses.map((course) => (
                                            <tr
                                                key={course._id}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/admin/courses/${course._id}/lessons`)}
                                            >
                                                <td className="px-6 py-4 font-medium">{course.title}</td>
                                                <td className="px-6 py-4 text-gray-600 truncate line-clamp-2 max-w-[300px]">
                                                    {course.description}
                                                </td>
                                                <td className="px-6 py-4">{course.duration}</td>
                                                <td className="px-6 py-4 font-medium text-green-600">
                                                    Rs. {course.price}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {typeof course.categoryId === "object" ? course.categoryId.name : ""}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(course.createdAt).toLocaleDateString()}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => editModalOpen(course)}
                                                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            onClick={() => openDeleteModal(course)}
                                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {openAddModal && (
                <CourseModal closeModal={closeModal} />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingCourse && (
                <CourseModal
                    closeModal={closeModal}
                    courseData={editingCourse}
                />
            )}

            <ConfirmationModal
                isOpen={!!courseToDelete}
                onClose={() => setCourseToDelete(null)}
                onConfirm={handleDelete}
                title={courseToDelete ? `Are you sure you want to delete "${courseToDelete.title}"?` : ''}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default Courses;
