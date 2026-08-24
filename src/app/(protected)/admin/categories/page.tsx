'use client'

import React, { useCallback, useState, useMemo } from 'react'
import ConfirmationModal from '@/components/common/delete-modal'
import CategoryAdd from '@/components/category/category-add'
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  type CategoryTree,
} from '@/store/category/categoryApi'
import { getErrorMessage } from '@/store/api/base'
import { toast } from 'sonner'
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react'


const CategoriesPage = () => {
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryTree | null>(null)
  const [editingCategory, setEditingCategory] = useState<CategoryTree | null>(null)
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())

  const { data: categories = [], isLoading } = useGetCategoriesQuery()
  const [deleteCategory] = useDeleteCategoryMutation()

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
      const cat = categories.find((c) => c.id === categoryId)
      return (cat?.children?.length ?? 0) > 0
    },
    [categories]
  )

  const getSubcategoryCount = useCallback(
    (category: CategoryTree) => {
      return category.children?.length ?? 0
    },
    []
  )

  const parentOptions = categories

  const sortedCategories = useMemo(() => {
    const result: { category: CategoryTree; level: number }[] = []

    for (const parent of categories) {
      result.push({ category: parent, level: 0 })
      if (expandedParents.has(parent.id)) {
        for (const child of parent.children ?? []) {
          result.push({ category: child, level: 1 })
        }
      }
    }

    return result
  }, [categories, expandedParents])

  const handleDelete = useCallback(async () => {
    if (!categoryToDelete) return
    try {
      await deleteCategory(categoryToDelete.id).unwrap()
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
    setCategoryToDelete(null)
  }, [categoryToDelete, deleteCategory])

  const handleEdit = useCallback((category: CategoryTree) => {
    setEditingCategory(category)
  }, [])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Add New Category Form */}
          <CategoryAdd
            parentOptions={parentOptions}
            editingCategory={editingCategory}
            onSuccess={() => setEditingCategory(null)}
          />

          {/* Right Column: Search, Table, and Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedCategories.map(({ category, level }) => (
                        <tr
                          key={category.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div
                              className="flex items-center"
                              style={{ paddingLeft: `${level * 24}px` }}
                            >
                              {level === 0 && hasSubcategories(category.id) ? (
                                <button
                                  onClick={() => toggleExpand(category.id)}
                                  className="mr-1.5 p-0.5 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                                >
                                  {expandedParents.has(category.id) ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  )}
                                </button>
                              ) : level === 0 ? (
                                <span className="mr-1.5 w-5" />
                              ) : (
                                <span className="mr-1.5 w-5 flex items-center justify-center">
                                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                </span>
                              )}
                              <span
                                className="text-sm font-medium text-gray-900"
                              >
                                {category.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                            {category.description || '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {category.slug || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer">
                              {getSubcategoryCount(category)}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(category)}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setCategoryToDelete(category)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                title="Delete"
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

            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
