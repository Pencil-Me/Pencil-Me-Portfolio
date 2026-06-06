import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCustomersStore } from '@/pinia/useCustomersStore'
import { useAppStore } from '@/pinia/useAppStore'

vi.mock('@/services/customer.service', () => ({
  default: {
    getCustomers: vi.fn(),
    getCustomer: vi.fn(),
    createCustomer: vi.fn(),
    updateCustomer: vi.fn(),
    deleteCustomer: vi.fn()
  }
}))

describe('useCustomersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads customers on success', async () => {
    const CustomerService = (await import('@/services/customer.service')).default
    vi.mocked(CustomerService.getCustomers).mockResolvedValue([
      { id: '1', name: 'ACME', location: 'Berlin' }
    ])

    const store = useCustomersStore()
    await store.getAllCustomers()

    expect(store.customerItems).toHaveLength(1)
    expect(store.customerItems[0].name).toBe('ACME')
  })

  it('sets error when fetch fails', async () => {
    const CustomerService = (await import('@/services/customer.service')).default
    vi.mocked(CustomerService.getCustomers).mockRejectedValue(new Error('Network error'))

    const store = useCustomersStore()
    const app = useAppStore()

    await expect(store.getAllCustomers()).rejects.toThrow()
    expect(app.hasError).toBe(true)
    expect(app.isLoading).toBe(false)
  })
})
