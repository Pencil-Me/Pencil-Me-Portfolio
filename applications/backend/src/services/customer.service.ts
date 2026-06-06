import { apiClient } from '@/services/http-client'
import { convertTCustomerToSendPayload } from '@/utils/mappers/customer-send.mapper'
import {
  convertICustomerToTCustomer,
  type ICustomer,
  type TCustomer
} from '@/types/customer'
import { normalizeCustomer, normalizeCustomers } from '@/utils/mappers/customer.mapper'

class CustomerService {
  async getCustomers(): Promise<TCustomer[]> {
    const response = await apiClient.get<ICustomer[]>('customer')
    return normalizeCustomers(response.data.map((entry) => convertICustomerToTCustomer(entry)))
  }

  async getCustomer(id: string): Promise<TCustomer> {
    const response = await apiClient.get<ICustomer>('customer/' + id)
    return normalizeCustomer(convertICustomerToTCustomer(response.data))
  }

  async createCustomer(payload: TCustomer) {
    const response = await apiClient.post('customer', convertTCustomerToSendPayload(payload))
    return response.data
  }

  async updateCustomer(payload: TCustomer) {
    const response = await apiClient.put(
      'customer/' + payload.id,
      convertTCustomerToSendPayload(payload)
    )
    return response.data
  }

  async deleteCustomer(payload: TCustomer) {
    const response = await apiClient.delete('customer/' + payload.id)
    return response.data
  }
}

export default new CustomerService()
