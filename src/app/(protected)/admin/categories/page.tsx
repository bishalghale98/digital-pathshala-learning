'use client'

import React, { useCallback, useState, useMemo } from 'react'
import Modal from '@/components/category/modal'
import EmptyState from '@/components/category/EmptyState'
import ConfirmationModal from '@/components/common/delete-modal'
import {
    useDeleteCategoryMutation,
    useGetCategoriesQuery,
    type Category,
} from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { toast } from 'sonner'




const CategoriesPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

    const { data: categories = [], isLoading } = useGetCategoriesQuery()
    const [deleteCategory] = useDeleteCategoryMutation()

    // Memoize filtered categories to avoid recalculating on every render
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return categories

        return categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [categories, searchTerm])

    const openEditModal = useCallback((category: Category) => {
        setEditingCategory(category)
        setIsEditModalOpen(true)
    }, [])

    const openAddModal = useCallback(() => {
        setIsAddModalOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsAddModalOpen(false)
        setIsEditModalOpen(false)
        setEditingCategory(null)
    }, [])

    // Handle opening delete modal
    const openDeleteModal = useCallback((category: Category) => {
        setCategoryToDelete(category)
    }, [])

    const handleDelete = useCallback(async () => {
        if (!categoryToDelete) return
        try {
            await deleteCategory(categoryToDelete._id).unwrap()
            toast.success('Category deleted')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
        setCategoryToDelete(null)
    }, [categoryToDelete, deleteCategory])

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="w-full sm:w-auto">
                            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                            <p className="text-gray-600 mt-1">Manage your product categories</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                            {/* Search Input */}
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search categories..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-3 flex items-center"
                                    >
                                        <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={openAddModal}
                                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Category
                            </button>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['ID', 'Category Name', 'Description', 'Created At', 'Actions'].map((header) => (
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
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                                Loading categories...
                                            </td>
                                        </tr>
                                    ) : filteredCategories.length === 0 ? (
                                        <EmptyState openAddModal={openAddModal} />
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <tr
                                                key={category._id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                                                        {category._id}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {category.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600 line-clamp-2 max-w-[300px]">
                                                        {category.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(category.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(category)}
                                                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            onClick={() => openDeleteModal(category)}
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

                        {filteredCategories.length > 0 && (
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-medium">{filteredCategories.length}</span> of{' '}
                                    <span className="font-medium">{categories.length}</span> categories
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isAddModalOpen && <Modal closeModal={closeModal} />}

            {isEditModalOpen && editingCategory && (
                <Modal closeModal={closeModal} categoryData={editingCategory} />
            )}

            <ConfirmationModal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={handleDelete}
                title={categoryToDelete ? `Are you sure you want to delete "${categoryToDelete.name}"?` : ''}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    )
}

export default CategoriesPage