'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import type { CategoryTree } from '@/store/category/categoryApi'

interface CourseFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  categories: CategoryTree[]
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search courses..."
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors min-w-[180px]"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <optgroup key={cat.id} label={cat.name}>
            <option value={cat.id}>{cat.name}</option>
            {cat.children?.map((child) => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
