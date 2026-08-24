'use client'

import React, { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'
import { EditorToolbar } from './editor-toolbar'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minHeight?: string
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  className,
  minHeight = '200px',
}: RichTextEditorProps) {
  const lastExternalUpdate = useRef(value)
  const isUpdatingFromEditor = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor: e }) => {
      if (isUpdatingFromEditor.current) return
      isUpdatingFromEditor.current = true
      const html = e.getHTML()
      lastExternalUpdate.current = html
      onChange?.(html)
      isUpdatingFromEditor.current = false
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base prose-gray max-w-none',
          'focus:outline-none min-h-[100px] px-4 py-3',
          'first:mt-0 last:mb-0'
        ),
        style: `min-height: ${minHeight}`,
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (isUpdatingFromEditor.current) return

    const currentContent = editor.getHTML()
    if (value !== currentContent && value !== lastExternalUpdate.current) {
      editor.commands.setContent(value || '', { emitUpdate: false })
      lastExternalUpdate.current = value
    }
  }, [editor, value])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [editor, disabled])

  return (
    <div
      className={cn(
        'rounded-md border border-gray-300 bg-white overflow-hidden',
        'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
        disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
        className
      )}
    >
      <EditorToolbar editor={editor} />

      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
