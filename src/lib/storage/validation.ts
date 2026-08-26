export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const

export const MAX_FILE_SIZES: Record<string, number> = {
  course: 5 * 1024 * 1024,
  article: 5 * 1024 * 1024,
  avatar: 2 * 1024 * 1024,
  editor: 5 * 1024 * 1024,
}

export function isAllowedImageType(type: string): boolean {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)
}

export function getMaxFileSize(context: string): number {
  return MAX_FILE_SIZES[context] ?? MAX_FILE_SIZES.course
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`
}
