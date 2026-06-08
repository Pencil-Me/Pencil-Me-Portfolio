import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  mockApiDelete,
  mockApiGet,
  mockApiPost,
  mockApiPut,
  resetApiClientMocks
} from '@/testing/api-client.mock'

describe('CustomerService', () => {
  beforeEach(() => {
    resetApiClientMocks()
    vi.resetModules()
  })

  it('loads customers from the API', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: [{ uuid: 'cust-1', name: 'Acme', location: 'Berlin' }]
    })

    const { default: customerService } = await import('./customer.service')
    const customers = await customerService.getCustomers()

    expect(mockApiGet).toHaveBeenCalledWith('customer')
    expect(customers[0].name).toBe('Acme')
    expect(customers[0].id).toBe('cust-1')
  })

  it('creates a customer', async () => {
    mockApiPost.mockResolvedValueOnce({ data: {} })

    const { default: customerService } = await import('./customer.service')
    await customerService.createCustomer({ id: 'new', name: 'Test', location: 'Hamburg' })

    expect(mockApiPost).toHaveBeenCalledWith('customer', {
      uuid: 'new',
      name: 'Test',
      location: 'Hamburg'
    })
  })

  it('updates a customer', async () => {
    mockApiPut.mockResolvedValueOnce({ data: {} })

    const { default: customerService } = await import('./customer.service')
    await customerService.updateCustomer({ id: 'cust-1', name: 'Acme', location: 'München' })

    expect(mockApiPut).toHaveBeenCalledWith('customer/cust-1', {
      uuid: 'cust-1',
      name: 'Acme',
      location: 'München'
    })
  })

  it('deletes a customer', async () => {
    mockApiDelete.mockResolvedValueOnce({ data: {} })

    const { default: customerService } = await import('./customer.service')
    await customerService.deleteCustomer({ id: 'cust-1', name: 'Acme', location: 'Berlin' })

    expect(mockApiDelete).toHaveBeenCalledWith('customer/cust-1')
  })
})
