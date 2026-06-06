import type { TCustomer } from '@/types/customer'
import { invalid, valid, type ValidationResult } from '@/utils/validation/types'

export function validateCustomer(customer: TCustomer): ValidationResult {
  if (customer.name.trim() === '') {
    return invalid('Bitte Name ausfüllen.')
  }
  if (customer.location.trim() === '') {
    return invalid('Bitte Standort ausfüllen.')
  }
  return valid()
}
