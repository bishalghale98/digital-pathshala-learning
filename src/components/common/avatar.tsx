import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image';

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

const bgColor = 'bg-gray-200'
const textColor = 'text-gray-600'

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || '?'
  const sizeClass = sizeClasses[size]

  if (src) {
    return (
      <Image
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizeClass, className)}
        width={size === 'sm' ? 32 : size === 'md' ? 36 : 48}
        height={size === 'sm' ? 32 : size === 'md' ? 36 : 48}
      />
    )
  }

  return (
    <div className={cn('rounded-full flex items-center justify-center font-medium', bgColor, textColor, sizeClass, className)}>
      <span>{initial}</span>
    </div>
  )
}
