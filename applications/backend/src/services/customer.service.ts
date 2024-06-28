import axios from 'axios'
import {
  convertICustomerToTCustomer,
  type ICustomer,
  type TCustomer
} from '@/views/Customers/CustomerTypes'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

class CustomerService {
  axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'API-Key': API_KEY
    }
  })

  async getCustomers(): Promise<TCustomer[]> {
    return await this.axiosInstance.get('customer').then((response: { data: ICustomer[] }) => {
      return response.data.map((e) => convertICustomerToTCustomer(e))
    })
  }

  async getCustomer(id: string): Promise<TCustomer> {
    return await this.axiosInstance.get('customer/' + id).then((response: { data: ICustomer }) => {
      return convertICustomerToTCustomer(response.data)
    })
  }

  async createCustomer(payload: ICustomer) {
    const sendobject = convertICustomerToTCustomer(payload)
    return await this.axiosInstance.post('customer', sendobject).then((response) => {
      return response.data
    })
  }

  async updateCustomer(payload: ICustomer) {
    const sendobject = convertICustomerToTCustomer(payload)
    return await this.axiosInstance.put('customer/' + payload.id, sendobject).then((response) => {
      return response.data
    })
  }

  async deleteCustomer(payload: ICustomer) {
    return await this.axiosInstance.delete('customer/' + payload.id).then((response) => {
      return response.data
    })
  }
}

export default new CustomerService()
