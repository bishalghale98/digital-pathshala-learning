"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteLesson, fetchLessons } from "@/store/lesson/lessonSlice";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ILesson } from "@/store/lesson/types";
import LessonModal from "@/components/lesson/modal";
import { Status } from "@/store/types";
import ConfirmationModal from "@/components/common/delete-modal";

const CourseLessonsPage = () => {
    const { id } = useParams();
    const { Lessons, status } = useAppSelector((store) => store.lessons);
    const dispatch = useAppDispatch();

    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState<ILesson | null>(null);

    const openAddModal = useCallback(() => {
        setIsOpenAddModal(true);
    }, []);

    const closeAddModal = useCallback(() => {
        setIsOpenAddModal(false);
    }, []);

    useEffect(() => {
        if (!id) return;
        dispatch(fetchLessons(id as string));
    }, [dispatch, id]);

    const openDeleteModal = useCallback((lesson: ILesson) => {
        setLessonToDelete(lesson);
    }, []);

    const handleDelete = useCallback(() => {
        if (!lessonToDelete) return;

        dispatch(deleteLesson(lessonToDelete._id));
        setLessonToDelete(null);
    }, [lessonToDelete, dispatch]);

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Course Lessons</h1>
                            <p className="text-gray-600 mt-1">
                                Lessons for Course ID: <span className="font-medium">{id}</span>
                            </p>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Lesson
                        </button>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {["Title", "Description", "video Url", "Course Name", "Action"].map(
                                            (header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    {header}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>



                                <tbody className="bg-white divide-y divide-gray-200">

                                    {/* Loading State */}
                                    {status === Status.Loading && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                Loading lessons...
                                            </td>
                                        </tr>
                                    )}

                                    {/* Empty State */}
                                    {status === Status.Success && Lessons.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                No lessons found for this course
                                            </td>
                                        </tr>
                                    )}

                                    {/* Data State */}
                                    {status === Status.Success &&
                                        Lessons.map((lesson: ILesson) => (
                                            <tr key={lesson._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">
                                                    {lesson.title}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {lesson.description}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {lesson.videoUrl}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {lesson.courseId?.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => openDeleteModal(lesson)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>

                            </table>
                        </div>
                    </div>

                    {
                        isOpenAddModal && <LessonModal closeModal={closeAddModal} id={id as string} />
                    }
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!lessonToDelete}
                onClose={() => setLessonToDelete(null)}
                onConfirm={handleDelete}
                title={lessonToDelete ? `Are you sure you want to delete "${lessonToDelete.title}"?` : ''}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default CourseLessonsPage;
