import axios from 'axios'
import authHeader from './auth-header'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

class TechStacksService {
  axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'API-Key': API_KEY
    }
  })

  async getCustomers() {
    return await this.axiosInstance.get('customer').then((response) => {
      return response.data
    })
  }

  async getCustomer(id) {
    return await this.axiosInstance.get('customer/' + id).then((response) => {
      return response.data
    })
  }

  async createCustomer(project) {
    const sendobject = {
      name: project.name ?? '',
      location: payload.location ?? ''
    }
    return await this.axiosInstance.post('customer', sendobject).then((response) => {
      return response.data
    })
  }

  async updateCustomer(payload) {
    const sendobject = {
      uuid: payload.id ?? '',
      name: payload.name ?? '',
      location: payload.location ?? ''
    }
    return await this.axiosInstance.put('customer/' + payload.id, sendobject).then((response) => {
      return response.data
    })
  }

  async deleteCustomer(payload) {
    return await this.axiosInstance.delete('customer/' + payload.id).then((response) => {
      return response.data
    })
  }
}

export default new TechStacksService()
