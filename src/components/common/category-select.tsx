'use client'

import React from 'react'

interface CategorySelectProps {
  categories: Array<{ id: string; name: string; children?: Array<{ id: string; name: string }> }>
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CategorySelect({ categories, value, onChange, placeholder = 'All categories', className }: CategorySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors min-w-[180px] ${className ?? ''}`}
    >
      <option value="">{placeholder}</option>
      {categories.map((cat) =>
        cat.children && cat.children.length > 0 ? (
          <optgroup key={cat.id} label={cat.name}>
            <option value={cat.id}>{cat.name}</option>
            {cat.children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </optgroup>
        ) : (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        )
      )}
    </select>
  )
}
