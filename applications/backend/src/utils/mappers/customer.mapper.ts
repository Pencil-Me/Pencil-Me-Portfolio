import type { TCustomer } from '@/types/customer'

export function cloneCustomer(customer: TCustomer): TCustomer {
  return { ...customer }
}

export function normalizeCustomers(customers: TCustomer[]): TCustomer[] {
  return customers.map((customer) => ({
    id: customer.id ?? '',
    name: customer.name ?? '',
    location: customer.location ?? ''
  }))
}

export function normalizeCustomer(customer: TCustomer): TCustomer {
  return {
    id: customer.id ?? '',
    name: customer.name ?? '',
    location: customer.location ?? ''
  }
}
