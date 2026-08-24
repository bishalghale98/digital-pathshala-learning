'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EditorLinkDialog } from './editor-link-dialog'

interface EditorBubbleMenuProps {
  editor: Editor
}

interface BubbleButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}

function BubbleButton({
  onClick,
  isActive = false,
  disabled = false,
  label,
  children,
}: BubbleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center size-7 rounded text-xs transition-colors',
        'hover:bg-gray-200',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-gray-200 text-gray-900'
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection
      const isTextSelection = from !== to

      if (isTextSelection) {
        const { view } = editor
        const start = view.coordsAtPos(from)
        const end = view.coordsAtPos(to)
        const editorRect = view.dom.getBoundingClientRect()

        setPosition({
          top: start.top - editorRect.top - 44,
          left: (start.left + end.left) / 2 - editorRect.left,
        })
        setShow(true)
      } else {
        setShow(false)
      }
    }

    const handleBlur = (e: FocusEvent) => {
      if (menuRef.current && menuRef.current.contains(e.relatedTarget as Node)) {
        return
      }
      setTimeout(() => {
        if (!editor.isFocused) {
          setShow(false)
        }
      }, 150)
    }

    editor.on('selectionUpdate', handleSelectionUpdate)
    editor.view.dom.addEventListener('blur', handleBlur)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.view.dom.removeEventListener('blur', handleBlur)
    }
  }, [editor])

  if (!show) return null

  return (
    <div
      ref={menuRef}
      className="absolute z-50 flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-lg px-1.5 py-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <BubbleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        label="Bold"
      >
        <Bold className="size-3.5" />
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        label="Italic"
      >
        <Italic className="size-3.5" />
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        label="Underline"
      >
        <Underline className="size-3.5" />
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        label="Strikethrough"
      >
        <Strikethrough className="size-3.5" />
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        label="Highlight"
      >
        <Highlighter className="size-3.5" />
      </BubbleButton>

      <div className="w-px h-4 bg-gray-200 mx-0.5" />

      <EditorLinkDialog editor={editor} />
    </div>
  )
}
