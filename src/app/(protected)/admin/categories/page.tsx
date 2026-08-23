'use client'

import React, { useCallback, useState, useMemo } from 'react'
import Modal from '@/components/category/modal'
import ConfirmationModal from '@/components/common/delete-modal'
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  type Category,
} from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { toast } from 'sonner'
import { Search, X, Plus, Tag } from 'lucide-react'

const CategoriesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const { data: categories = [], isLoading } = useGetCategoriesQuery()
  const [deleteCategory] = useDeleteCategoryMutation()

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your courses</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <Tag className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-sm font-medium text-gray-900">
                        {searchTerm ? 'No categories found' : 'No categories yet'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {searchTerm
                          ? 'Try a different search term'
                          : 'Create your first category to organize courses'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={openAddModal}
                          className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Category
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-[300px]">
                        {category.slug || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(category)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredCategories.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium">{filteredCategories.length}</span> of{' '}
              <span className="font-medium">{categories.length}</span> categories
            </p>
          </div>
        )}
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
