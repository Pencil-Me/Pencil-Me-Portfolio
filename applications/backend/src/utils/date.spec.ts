import { describe, expect, it } from 'vitest'
import { formatDate, formatIsoDate, parseDate } from '@/utils/date'

describe('parseDate', () => {
  it('returns null for null', () => {
    expect(parseDate(null)).toBeNull()
  })

  it('returns null for invalid strings', () => {
    expect(parseDate('not-a-date')).toBeNull()
    expect(parseDate('')).toBeNull()
  })

  it('parses valid ISO date strings', () => {
    const date = parseDate('2024-06-15T12:00:00.000Z')

    expect(date).toBeInstanceOf(Date)
    expect(date?.toISOString()).toBe('2024-06-15T12:00:00.000Z')
  })
})

describe('formatDate', () => {
  it('formats valid dates in de-DE locale', () => {
    expect(formatDate('2024-06-15T12:00:00.000Z')).toBe('15. Juni 2024')
  })

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('')
  })

  it('returns original value as string when parsing fails', () => {
    expect(formatDate('invalid')).toBe('invalid')
  })
})

describe('formatIsoDate', () => {
  it('returns YYYY-MM-DD for valid dates', () => {
    expect(formatIsoDate('2024-06-15T12:00:00.000Z')).toBe('2024-06-15')
  })

  it('returns empty string for null', () => {
    expect(formatIsoDate(null)).toBe('')
  })

  it('returns original value as string when parsing fails', () => {
    expect(formatIsoDate('invalid')).toBe('invalid')
  })
})
