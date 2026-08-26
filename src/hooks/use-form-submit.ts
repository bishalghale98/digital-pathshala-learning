'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/store/api/base'

interface UseFormSubmitOptions {
  successMessage?: string
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

interface MutationResult {
  unwrap: () => Promise<any>
}

export function useFormSubmit<T>(
  mutationFn: (data: T) => MutationResult,
  options: UseFormSubmitOptions = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = useCallback(
    async (data: T) => {
      setIsSubmitting(true)
      try {
        await mutationFn(data).unwrap()
        if (options.successMessage) {
          toast.success(options.successMessage)
        }
        options.onSuccess?.()
      } catch (error) {
        if (options.onError) {
          options.onError(error)
        } else {
          toast.error(getErrorMessage(error))
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [mutationFn, options]
  )

  return { submit, isSubmitting }
}
