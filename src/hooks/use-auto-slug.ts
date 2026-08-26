'use client'

import { useEffect } from 'react'
import { getSlug } from '@/lib/helper/helper'
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form'

interface UseAutoSlugOptions<T extends FieldValues> {
  form: UseFormReturn<T>
  sourceField: Path<T>
  slugField: Path<T>
  enabled?: boolean
}

export function useAutoSlug<T extends FieldValues>({
  form,
  sourceField,
  slugField,
  enabled = true,
}: UseAutoSlugOptions<T>) {
  const watchedSource = form.watch(sourceField)

  useEffect(() => {
    if (!enabled) return
    const slug = getSlug(String(watchedSource ?? ''))
    form.setValue(slugField, slug as any, { shouldValidate: true, shouldDirty: true })
  }, [watchedSource, enabled, form, slugField])
}
