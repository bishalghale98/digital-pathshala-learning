"use client";

import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import LessonModal from "@/components/lesson/modal";
import ConfirmationModal from "@/components/common/delete-modal";
import {
    useDeleteLessonMutation,
    useGetLessonsByCourseQuery,
    type Lesson,
} from "@/store/lesson/lessonApi";
import { getErrorMessage } from "@/store/api/base";
import { toast } from "sonner";

const CourseLessonsPage = () => {
    const { id } = useParams();
    const courseId = typeof id === "string" ? id : "";

    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    const { data: lessons = [], isLoading, isSuccess } = useGetLessonsByCourseQuery(courseId, {
        skip: !courseId,
    });
    const [deleteLesson] = useDeleteLessonMutation();

    const openAddModal = useCallback(() => {
        setEditingLesson(null);
        setIsOpenAddModal(true);
    }, []);

    const closeAddModal = useCallback(() => {
        setIsOpenAddModal(false);
        setEditingLesson(null);
    }, []);

    const openEditModal = useCallback((lesson: Lesson) => {
        setEditingLesson(lesson);
        setIsOpenAddModal(true);
    }, []);

    const openDeleteModal = useCallback((lesson: Lesson) => {
        setLessonToDelete(lesson);
    }, []);

    const handleDelete = useCallback(async () => {
        if (!lessonToDelete) return;

        try {
            await deleteLesson({ id: lessonToDelete.id, courseId }).unwrap();
            toast.success("Lesson deleted");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
        setLessonToDelete(null);
    }, [lessonToDelete, deleteLesson, courseId]);

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
                            <Plus className="w-5 h-5" />
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
                                    {isLoading && (
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
                                    {isSuccess && lessons.length === 0 && (
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
                                    {isSuccess &&
                                        lessons.map((lesson) => (
                                            <tr key={lesson.id} className="hover:bg-gray-50">
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
                                                    {typeof lesson.courseId === "object" ? lesson.courseId.title : ""}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEditModal(lesson)}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                        >
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
                        isOpenAddModal && (
                            <LessonModal
                                closeModal={closeAddModal}
                                id={courseId}
                                lessonData={editingLesson
                                    ? {
                                        id: editingLesson.id,
                                        title: editingLesson.title,
                                        description: editingLesson.description,
                                        videoUrl: editingLesson.videoUrl,
                                        courseId: typeof editingLesson.courseId === "object"
                                            ? editingLesson.courseId.id
                                            : editingLesson.courseId,
                                    }
                                    : null
                                }
                            />
                        )
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
