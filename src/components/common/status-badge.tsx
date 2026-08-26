import React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray'

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-blue-50 text-blue-700',
  gray: 'bg-gray-50 text-gray-700',
}

interface StatusBadgeProps {
  label: string
  variant?: BadgeVariant
  className?: string
}

export function StatusBadge({ label, variant = 'gray', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  )
}

export const enrollmentStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'Approved':
      return 'green'
    case 'Pending':
      return 'yellow'
    case 'Rejected':
      return 'red'
    default:
      return 'gray'
  }
}
