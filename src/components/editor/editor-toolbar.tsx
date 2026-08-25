'use client'

import React, { useState, useCallback, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  ImagePlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EditorLinkDialog } from './editor-link-dialog'
import { resolveImageUrl } from '@/lib/storage/url'

interface EditorToolbarProps {
  editor: Editor | null
}

interface ToolbarButtonProps {
  onClick: () => void
  disabled?: boolean
  isActive?: boolean
  label: string
  children: React.ReactNode
}

function ToolbarButton({
  onClick,
  disabled = false,
  isActive = false,
  label,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center size-8 rounded-md text-sm transition-colors',
        'hover:bg-muted hover:text-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-muted text-foreground'
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

interface HeadingDropdownProps {
  editor: Editor
}

function HeadingDropdown({ editor }: HeadingDropdownProps) {
  const [open, setOpen] = useState(false)

  const currentLevel = (() => {
    for (let i = 1; i <= 3; i++) {
      if (editor.isActive('heading', { level: i })) return i
    }
    return 0
  })()

  const currentLabel = currentLevel === 0 ? 'Paragraph' : `Heading ${currentLevel}`

  const handleSelect = useCallback(
    (level: 0 | 1 | 2 | 3) => {
      if (level === 0) {
        editor.chain().focus().setParagraph().run()
      } else {
        editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
      }
      setOpen(false)
    },
    [editor]
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1 h-8 px-2 rounded-md text-sm transition-colors',
          'hover:bg-muted hover:text-foreground',
          currentLevel !== 0 && 'bg-muted text-foreground'
        )}
        aria-label="Text style"
        title="Text style"
      >
        {currentLevel === 0 && <Pilcrow className="size-3.5" />}
        {currentLevel === 1 && <Heading1 className="size-3.5" />}
        {currentLevel === 2 && <Heading2 className="size-3.5" />}
        {currentLevel === 3 && <Heading3 className="size-3.5" />}
        <span className="text-xs">{currentLabel}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-20 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1">
            <button
              type="button"
              onClick={() => handleSelect(0)}
              className={cn(
                'w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2',
                currentLevel === 0 && 'bg-gray-100 font-medium'
              )}
            >
              <Pilcrow className="size-3.5" />
              Paragraph
            </button>
            {[1, 2, 3].map((level) => {
              const Icon = level === 1 ? Heading1 : level === 2 ? Heading2 : Heading3
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleSelect(level as 1 | 2 | 3)}
                  className={cn(
                    'w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2',
                    currentLevel === level && 'bg-gray-100 font-medium'
                  )}
                >
                  <Icon className="size-3.5" />
                  Heading {level}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function ImageUploadButton({ editor }: { editor: Editor }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('context', 'editor')

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!data.success) throw new Error(data.message || 'Upload failed')

      const src = resolveImageUrl(data.data.key)
      if (src) {
        editor.chain().focus().setImage({ src }).run()
      }
    } catch (err) {
      console.error('Image upload failed:', err)
    } finally {
      setUploading(false)
    }
  }, [editor])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    e.target.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleChange}
        className="hidden"
      />
      <ToolbarButton
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        label={uploading ? 'Uploading image...' : 'Insert image'}
      >
        <ImagePlus className="size-4" />
      </ToolbarButton>
    </>
  )
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 rounded-t-md">
      <HeadingDropdown editor={editor} />

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        label="Bold"
      >
        <Bold className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        label="Italic"
      >
        <Italic className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        label="Underline"
      >
        <Underline className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        label="Strikethrough"
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        label="Inline code"
      >
        <Code className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        label="Highlight"
      >
        <Highlighter className="size-4" />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        label="Bullet list"
      >
        <List className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        label="Ordered list"
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        label="Blockquote"
      >
        <Quote className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={!editor.can().chain().focus().setHorizontalRule().run()}
        label="Horizontal rule"
      >
        <Minus className="size-4" />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <EditorLinkDialog editor={editor} />

      <ImageUploadButton editor={editor} />

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        label="Undo"
      >
        <Undo2 className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        label="Redo"
      >
        <Redo2 className="size-4" />
      </ToolbarButton>
    </div>
  )
}
