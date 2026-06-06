export function parseDate(value: unknown): Date | null {
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value: unknown): string {
  const date = parseDate(value)
  if (!date) {
    return String(value ?? '')
  }

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function formatIsoDate(value: unknown): string {
  const date = parseDate(value)
  if (!date) {
    return String(value ?? '')
  }

  return date.toISOString().slice(0, 10)
}
