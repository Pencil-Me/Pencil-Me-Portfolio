import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()
const mockDelete = vi.fn()

vi.mock('./http-client', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete
  }
}))

describe('CustomerService', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockPost.mockReset()
    mockPut.mockReset()
    mockDelete.mockReset()
    vi.resetModules()
  })

  it('loads customers from the API', async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ uuid: 'cust-1', name: 'Acme', location: 'Berlin' }]
    })

    const { default: customerService } = await import('./customer.service')
    const customers = await customerService.getCustomers()

    expect(mockGet).toHaveBeenCalledWith('customer')
    expect(customers[0].name).toBe('Acme')
    expect(customers[0].id).toBe('cust-1')
  })

  it('creates a customer', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })

    const { default: customerService } = await import('./customer.service')
    await customerService.createCustomer({ id: 'new', name: 'Test', location: 'Hamburg' })

    expect(mockPost).toHaveBeenCalledWith('customer', {
      uuid: 'new',
      name: 'Test',
      location: 'Hamburg'
    })
  })

  it('updates a customer', async () => {
    mockPut.mockResolvedValueOnce({ data: {} })

    const { default: customerService } = await import('./customer.service')
    await customerService.updateCustomer({ id: 'cust-1', name: 'Acme', location: 'München' })

    expect(mockPut).toHaveBeenCalledWith('customer/cust-1', {
      uuid: 'cust-1',
      name: 'Acme',
      location: 'München'
    })
  })

  it('deletes a customer', async () => {
    mockDelete.mockResolvedValueOnce({ data: {} })

    const { default: customerService } = await import('./customer.service')
    await customerService.deleteCustomer({ id: 'cust-1', name: 'Acme', location: 'Berlin' })

    expect(mockDelete).toHaveBeenCalledWith('customer/cust-1')
  })
})
