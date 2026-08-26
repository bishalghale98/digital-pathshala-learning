const DATE_SHORT: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}

const DATE_LONG: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

const DATE_MONTH_ONLY: Intl.DateTimeFormatOptions = {
  month: 'short',
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'month' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const options = format === 'long' ? DATE_LONG : format === 'month' ? DATE_MONTH_ONLY : DATE_SHORT
  return d.toLocaleDateString('en-US', options)
}
