import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {Icon && <Icon className="w-12 h-12 text-gray-300 mb-3" />}
      <p className="text-sm font-medium text-gray-900">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

interface TableEmptyStateProps {
  icon?: LucideIcon
  colSpan: number
  filteredLabel: string
  emptyLabel: string
  filteredSubtitle?: string
  emptySubtitle?: string
  hasFilter: boolean
}

export function TableEmptyState({
  icon: Icon,
  colSpan,
  filteredLabel,
  emptyLabel,
  filteredSubtitle,
  emptySubtitle,
  hasFilter,
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center py-12">
          {Icon && <Icon className="w-12 h-12 text-gray-300 mb-3" />}
          <p className="text-sm font-medium text-gray-900">
            {hasFilter ? filteredLabel : emptyLabel}
          </p>
          {(hasFilter ? filteredSubtitle : emptySubtitle) && (
            <p className="text-xs text-gray-500 mt-1">
              {hasFilter ? filteredSubtitle : emptySubtitle}
            </p>
          )}
        </div>
      </td>
    </tr>
  )
}

interface TableLoadingProps {
  colSpan: number
  message?: string
}

export function TableLoading({ colSpan, message = 'Loading...' }: TableLoadingProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-sm text-gray-500">
        {message}
      </td>
    </tr>
  )
}

interface TableFooterProps {
  filteredCount: number
  totalCount: number
  label: string
}

export function TableFooter({ filteredCount, totalCount, label }: TableFooterProps) {
  return (
    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
      <p className="text-xs text-gray-500">
        Showing <span className="font-medium">{filteredCount}</span> of{' '}
        <span className="font-medium">{totalCount}</span> {label}
      </p>
    </div>
  )
}
