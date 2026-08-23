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
import { Search, X, Plus, Tag, ChevronRight, ChevronDown } from 'lucide-react'

const CategoriesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())

  const { data: categories = [], isLoading } = useGetCategoriesQuery()
  const [deleteCategory] = useDeleteCategoryMutation()

  const mainCategories = useMemo(
    () => categories.filter((c) => !c.parent),
    [categories]
  )

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories
    const term = searchTerm.toLowerCase()
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term)
    )
  }, [categories, searchTerm])

  const filteredMainCategories = useMemo(
    () => filteredCategories.filter((c) => !c.parent),
    [filteredCategories]
  )

  const getSubcategoriesFor = useCallback(
    (parentId: string) =>
      filteredCategories.filter((c) => c.parent === parentId),
    [filteredCategories]
  )

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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your courses into categories and subcategories</p>
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

      {/* Category Tree */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Loading categories...
          </div>
        ) : filteredMainCategories.length === 0 ? (
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
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMainCategories.map((mainCategory) => {
              const subs = getSubcategoriesFor(mainCategory._id)
              const isExpanded = expandedParents.has(mainCategory._id) || searchTerm.trim().length > 0

              return (
                <div key={mainCategory._id}>
                  {/* Main Category Row */}
                  <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {subs.length > 0 ? (
                        <button
                          onClick={() => toggleExpand(mainCategory._id)}
                          className="p-0.5 text-gray-400 hover:text-gray-600"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <div className="w-5" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {mainCategory.name}
                        </p>
                        {mainCategory.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[300px]">
                            {mainCategory.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 hidden sm:block">
                        {subs.length} sub{subs.length !== 1 ? 'categories' : 'category'}
                      </span>
                      <span className="text-xs text-gray-500 hidden md:block">
                        {formatDate(mainCategory.createdAt)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(mainCategory)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(mainCategory)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {isExpanded && subs.length > 0 && (
                    <div className="bg-gray-50 divide-y divide-gray-100">
                      {subs.map((sub) => (
                        <div
                          key={sub._id}
                          className="flex items-center justify-between pl-14 pr-6 py-3 hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="text-sm text-gray-700">{sub.name}</p>
                            {sub.description && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[280px]">
                                {sub.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 hidden md:block">
                              {formatDate(sub.createdAt)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditModal(sub)}
                                className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(sub)}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {!isLoading && filteredMainCategories.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium">{filteredMainCategories.length}</span> main{' '}
              {filteredMainCategories.length !== 1 ? 'categories' : 'category'} with{' '}
              <span className="font-medium">
                {filteredCategories.filter((c) => c.parent).length}
              </span>{' '}
              subcategories
            </p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <Modal closeModal={closeModal} mainCategories={mainCategories} />
      )}
      {isEditModalOpen && editingCategory && (
        <Modal
          closeModal={closeModal}
          categoryData={editingCategory}
          mainCategories={mainCategories}
        />
      )}
      <ConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"?`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default CategoriesPage
