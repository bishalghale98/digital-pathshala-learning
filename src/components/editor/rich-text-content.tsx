import React from 'react'
import { cn } from '@/lib/utils'

interface RichTextContentProps {
  content: string
  className?: string
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  if (!content) return null

  return (
    <div
      className={cn(
        'prose prose-sm sm:prose-base prose-gray max-w-none',
        'first:mt-0 last:mb-0',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
