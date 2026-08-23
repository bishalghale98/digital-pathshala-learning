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
import { Search, X, Plus, Tag, ChevronRight, ChevronDown, Pencil, Trash2 } from 'lucide-react'

const CategoriesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())

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

  const sortedCategories = useMemo(() => {
    const parentCats = filteredCategories.filter((c) => !c.parent)
    const subCats = filteredCategories.filter((c) => c.parent)

    const result: { category: Category; level: number }[] = []

    for (const parent of parentCats) {
      result.push({ category: parent, level: 0 })
      if (expandedParents.has(parent._id)) {
        const children = subCats.filter(
          (c) => c.parent?._id === parent._id
        )
        for (const child of children) {
          result.push({ category: child, level: 1 })
        }
      }
    }

    return result
  }, [filteredCategories, expandedParents])

  const toggleExpand = useCallback((parentId: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev)
      if (next.has(parentId)) {
        next.delete(parentId)
      } else {
        next.add(parentId)
      }
      return next
    })
  }, [])

  const hasSubcategories = useCallback(
    (categoryId: string) => {
      return categories.some(
        (c) => c.parent?._id === categoryId
      )
    },
    [categories]
  )

  const getSubcategoryCount = useCallback(
    (categoryId: string) => {
      return categories.filter(
        (c) => c.parent?._id === categoryId
      ).length
    },
    [categories]
  )

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
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
    setCategoryToDelete(null)
  }, [categoryToDelete, deleteCategory])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize your courses with categories and subcategories
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-medium rounded-lg hover:bg-[#6D28D9] transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subcategories
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                      <p className="mt-3 text-sm text-gray-500">Loading categories...</p>
                    </div>
                  </td>
                </tr>
              ) : sortedCategories.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Tag className="w-7 h-7 text-gray-400" />
                      </div>
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
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Add Category
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sortedCategories.map(({ category, level }) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center"
                        style={{ paddingLeft: `${level * 24}px` }}
                      >
                        {level === 0 && hasSubcategories(category._id) ? (
                          <button
                            onClick={() => toggleExpand(category._id)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                          >
                            {expandedParents.has(category._id) ? (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        ) : level === 0 ? (
                          <span className="mr-2 w-6" />
                        ) : (
                          <span className="mr-2 w-6 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                          </span>
                        )}
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            level === 0 ? 'bg-[#7C3AED]/10' : 'bg-gray-100'
                          }`}>
                            <Tag className={`w-4 h-4 ${
                              level === 0 ? 'text-[#7C3AED]' : 'text-gray-500'
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {category.name}
                            </p>
                            {level === 0 && (
                              <p className="text-xs text-gray-500">
                                {getSubcategoryCount(category._id)} subcategories
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                        {category.slug || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {category.subcategories?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 text-gray-500 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!isLoading && sortedCategories.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium">{sortedCategories.length}</span> of{' '}
              <span className="font-medium">{categories.length}</span> categories
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && <Modal closeModal={closeModal} />}
      {isEditModalOpen && editingCategory && (
        <Modal closeModal={closeModal} categoryData={editingCategory} />
      )}
      <ConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title={categoryToDelete ? `Delete "${categoryToDelete.name}"?` : ''}
        description="This action cannot be undone. Category will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default CategoriesPage
