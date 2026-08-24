'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditorFloatingMenuProps {
  editor: Editor
}

interface FloatingButtonProps {
  onClick: () => void
  label: string
  children: React.ReactNode
}

function FloatingButton({ onClick, label, children }: FloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center size-7 rounded text-xs transition-colors',
        'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

export function EditorFloatingMenu({ editor }: EditorFloatingMenuProps) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { empty, $anchor } = editor.state.selection
      const isAtStartOfParagraph =
        empty &&
        $anchor.parent.type.name === 'paragraph' &&
        $anchor.parent.content.size === 0 &&
        $anchor.parentOffset === 0

      if (isAtStartOfParagraph) {
        const { view } = editor
        const coords = view.coordsAtPos($anchor.pos)
        const editorRect = view.dom.getBoundingClientRect()

        setPosition({
          top: coords.top - editorRect.top,
          left: editorRect.left - editorRect.left + 8,
        })
        setShow(true)
      } else {
        setShow(false)
      }
    }

    editor.on('selectionUpdate', handleSelectionUpdate)
    editor.on('transaction', handleSelectionUpdate)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.off('transaction', handleSelectionUpdate)
    }
  }, [editor])

  if (!show) return null

  return (
    <div
      ref={menuRef}
      className="absolute z-40 flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-lg px-1.5 py-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <FloatingButton
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run()
          setShow(false)
        }}
        label="Heading 1"
      >
        <Heading1 className="size-3.5" />
      </FloatingButton>

      <FloatingButton
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run()
          setShow(false)
        }}
        label="Heading 2"
      >
        <Heading2 className="size-3.5" />
      </FloatingButton>

      <FloatingButton
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 3 }).run()
          setShow(false)
        }}
        label="Heading 3"
      >
        <Heading3 className="size-3.5" />
      </FloatingButton>

      <FloatingButton
        onClick={() => {
          editor.chain().focus().toggleBulletList().run()
          setShow(false)
        }}
        label="Bullet list"
      >
        <List className="size-3.5" />
      </FloatingButton>

      <FloatingButton
        onClick={() => {
          editor.chain().focus().toggleOrderedList().run()
          setShow(false)
        }}
        label="Ordered list"
      >
        <ListOrdered className="size-3.5" />
      </FloatingButton>

      <FloatingButton
        onClick={() => {
          editor.chain().focus().toggleBlockquote().run()
          setShow(false)
        }}
        label="Blockquote"
      >
        <Quote className="size-3.5" />
      </FloatingButton>

      <FloatingButton
        onClick={() => {
          editor.chain().focus().toggleCodeBlock().run()
          setShow(false)
        }}
        label="Code block"
      >
        <Code2 className="size-3.5" />
      </FloatingButton>
    </div>
  )
}
