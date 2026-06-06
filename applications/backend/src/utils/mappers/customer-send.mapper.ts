import type { TCustomer } from '@/types/customer'

export function convertTCustomerToSendPayload(payload: TCustomer) {
  return {
    uuid: payload.id,
    name: payload.name ?? '',
    location: payload.location ?? ''
  }
}
