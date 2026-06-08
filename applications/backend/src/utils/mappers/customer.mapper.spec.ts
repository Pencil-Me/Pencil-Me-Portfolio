import { describe, expect, it } from 'vitest'
import type { TCustomer } from '@/types/customer'
import {
  cloneCustomer,
  normalizeCustomer,
  normalizeCustomers
} from '@/utils/mappers/customer.mapper'

describe('normalizeCustomer', () => {
  it('fills missing id, name and location with empty strings', () => {
    const customer = {} as TCustomer

    expect(normalizeCustomer(customer)).toEqual({
      id: '',
      name: '',
      location: ''
    })
  })

  it('preserves existing values', () => {
    const customer: TCustomer = { id: '1', name: 'ACME', location: 'Berlin' }

    expect(normalizeCustomer(customer)).toEqual(customer)
  })
})

describe('normalizeCustomers', () => {
  it('normalizes each customer in the array', () => {
    const customers = [{ name: 'ACME' } as TCustomer, { id: '2', location: 'Hamburg' } as TCustomer]

    expect(normalizeCustomers(customers)).toEqual([
      { id: '', name: 'ACME', location: '' },
      { id: '2', name: '', location: 'Hamburg' }
    ])
  })
})

describe('cloneCustomer', () => {
  it('creates a shallow copy', () => {
    const source: TCustomer = { id: '1', name: 'ACME', location: 'Berlin' }
    const cloned = cloneCustomer(source)

    cloned.name = 'Other'

    expect(source.name).toBe('ACME')
    expect(cloned).toEqual({ id: '1', name: 'Other', location: 'Berlin' })
  })
})
