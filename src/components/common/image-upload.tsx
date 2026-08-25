'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInputClass } from '@/lib/utils/form'
import { resolveImageUrl } from '@/lib/storage/url'

interface ImageUploadProps {
  value?: string
  onChange?: (value: string) => void
  context?: 'course' | 'article' | 'avatar' | 'editor'
  entityId?: string
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function ImageUpload({
  value = '',
  onChange,
  context = 'course',
  entityId,
  className,
  disabled = false,
  placeholder = 'Upload an image or paste a URL',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const displayUrl = previewUrl || resolveImageUrl(value)

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('context', context)
        if (entityId) formData.append('entityId', entityId)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (!data.success) {
          throw new Error(data.message || 'Upload failed')
        }

        setPreviewUrl(null)
        onChange?.(data.data.key)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
        setPreviewUrl(null)
      } finally {
        setIsUploading(false)
      }
    },
    [context, entityId, onChange]
  )

  const handleFileSelect = useCallback(
    (file: File) => {
      const maxSize = context === 'avatar' ? 2 * 1024 * 1024 : 5 * 1024 * 1024
      if (file.size > maxSize) {
        setError(`File too large. Max: ${context === 'avatar' ? '2 MB' : '5 MB'}`)
        return
      }

      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
      if (!allowed.includes(file.type)) {
        setError('Invalid file type. Allowed: JPEG, PNG, WebP, AVIF')
        return
      }

      setPreviewUrl(URL.createObjectURL(file))
      uploadFile(file)
    },
    [context, uploadFile]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleRemove = () => {
    setPreviewUrl(null)
    onChange?.('')
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <input
        type="text"
        value={value}
        onChange={handleUrlChange}
        disabled={disabled || isUploading}
        className={getInputClass(!!error)}
        placeholder={placeholder}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {isUploading ? (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click or drag to upload
            </span>
            <span className="text-xs text-gray-400">
              JPEG, PNG, WebP, AVIF up to {context === 'avatar' ? '2' : '5'} MB
            </span>
          </>
        )}
      </div>

      {displayUrl && (
        <div className="relative inline-block">
          <Image
            src={displayUrl}
            alt="Preview"
            width={200}
            height={120}
            className="rounded-lg border border-gray-200 object-cover"
            unoptimized
          />
          {!disabled && !isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
