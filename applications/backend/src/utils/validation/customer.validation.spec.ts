import { describe, expect, it } from 'vitest'
import { validateCustomer } from '@/utils/validation/customer.validation'

describe('validateCustomer', () => {
  it('accepts valid customer', () => {
    expect(validateCustomer({ name: 'ACME', location: 'Berlin' }).valid).toBe(true)
  })

  it('rejects empty name', () => {
    expect(validateCustomer({ name: ' ', location: 'Berlin' }).valid).toBe(false)
  })

  it('rejects empty location', () => {
    expect(validateCustomer({ name: 'ACME', location: ' ' }).valid).toBe(false)
  })
})
