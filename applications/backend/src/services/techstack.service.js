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

  async getTechStackTypes() {
    return await this.axiosInstance.get('techstack_types').then((response) => {
      return response.data
    })
  }

  async getTechStacks() {
    return await this.axiosInstance.get('techstack').then((response) => {
      return response.data
    })
  }

  async getTechStack(id) {
    return await this.axiosInstance.get('techstack/' + id).then((response) => {
      return response.data
    })
  }

  async createTechStack(project) {
    const sendobject = {
      name: project.name ?? '',
      type: project.type ?? '',
      expertise_level: project.expertise_level ?? '',
      flag_important: project.flag_important ?? '0'
    }
    return await this.axiosInstance.post('techstack', sendobject).then((response) => {
      return response.data
    })
  }

  async updateTechStack(payload) {
    const sendobject = {
      name: payload.name ?? '',
      type: payload.type ?? '',
      expertise_level: payload.expertise_level ?? '',
      flag_important: payload.flag_important ?? false
    }
    return await this.axiosInstance.put('techstack/' + payload.id, sendobject).then((response) => {
      return response.data
    })
  }

  async deleteTechStack(payload) {
    return await this.axiosInstance.delete('techstack/' + payload.id).then((response) => {
      return response.data
    })
  }
}

export default new TechStacksService()
