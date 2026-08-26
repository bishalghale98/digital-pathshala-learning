import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md'
  className?: string
}

export function ProgressBar({ progress, size = 'sm', className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress))
  return (
    <div className={cn('w-full bg-gray-100 rounded-full', size === 'sm' ? 'h-1.5' : 'h-2', className)}>
      <div
        className="bg-gray-900 rounded-full transition-all"
        style={{ width: `${clamped}%`, height: size === 'sm' ? 'h-1.5' : 'h-2' }}
      />
    </div>
  )
}
