'use client'

import React, { useState, useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import { Link2, Unlink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditorLinkDialogProps {
  editor: Editor
}

export function EditorLinkDialog({ editor }: EditorLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const isActive = editor.isActive('link')

  const handleOpen = useCallback(() => {
    const existingUrl = editor.getAttributes('link').href as string | undefined
    setUrl(existingUrl ?? '')
    setOpen(true)
  }, [editor])

  const handleClose = useCallback(() => {
    setOpen(false)
    setUrl('')
  }, [])

  const handleSave = useCallback(() => {
    const trimmed = url.trim()

    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      handleClose()
      return
    }

    try {
      const parsed = new URL(trimmed)
      if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
        return
      }
    } catch {
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: trimmed })
      .run()
    handleClose()
  }, [url, editor, handleClose])

  const handleRemove = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    handleClose()
  }, [editor, handleClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSave()
      }
      if (e.key === 'Escape') {
        handleClose()
      }
    },
    [handleSave, handleClose]
  )

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={!editor.can().chain().focus().toggleLink({ href: '' }).run()}
        className={cn(
          'inline-flex items-center justify-center size-8 rounded-md text-sm transition-colors',
          'hover:bg-muted hover:text-foreground',
          'disabled:pointer-events-none disabled:opacity-50',
          isActive && 'bg-muted text-foreground'
        )}
        aria-label={isActive ? 'Edit link' : 'Add link'}
        title={isActive ? 'Edit link' : 'Add link'}
      >
        <Link2 className="size-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black/50"
            onClick={handleClose}
          />
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-sm mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isActive ? 'Edit Link' : 'Add Link'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="link-url"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      URL
                    </label>
                    <input
                      id="link-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  {isActive && (
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <Unlink className="size-3.5" />
                      Remove
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
