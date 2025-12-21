"use client";

import React, { useCallback, useEffect, useState } from "react";
import { fetchCourses } from "@/store/course/courseSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import CourseModal from "@/components/course/modal";
import { ICourse } from "@/store/course/types";

const Courses = () => {
    const { Courses } = useAppSelector((store) => store.courses);
    const dispatch = useAppDispatch();

    const [openAddModal, setOpenAddModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const addModalOpen = useCallback(() => setOpenAddModal(true), []);

    const editModalOpen = useCallback((course: ICourse) => {
        setEditingCourse(course);
        setIsEditModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setOpenAddModal(false);
        setIsEditModalOpen(false);
        setEditingCourse(null);
    }, []);

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
                                    {Courses.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                No courses found
                                            </td>
                                        </tr>
                                    ) : (
                                        Courses.map((course: ICourse) => (
                                            <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{course.title}</td>
                                                <td className="px-6 py-4 text-gray-600 line-clamp-2 max-w-[300px]">
                                                    {course.description}
                                                </td>
                                                <td className="px-6 py-4">{course.duration}</td>
                                                <td className="px-6 py-4 font-medium text-green-600">
                                                    Rs. {course.price}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {course.categoryId?.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(course.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => editModalOpen(course)}
                                                        className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        ✎
                                                    </button>
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
        </div>
    );
};

export default Courses;
