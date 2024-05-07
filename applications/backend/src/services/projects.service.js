import axios from 'axios'
import authHeader from './auth-header'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

class ProjectsService {
  axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'API-Key': API_KEY
    }
  })

  async getProjectTypes() {
    return await this.axiosInstance.get('project_types').then((response) => {
      return response.data
    })
  }

  async getProjects() {
    return await this.axiosInstance.get('project').then((response) => {
      return response.data
    })
  }
  async getProject(id) {
    return await this.axiosInstance.get('project/' + id).then((response) => {
      return response.data
    })
  }

  async createProject(payload) {
    const sendobject = {
      name: payload.name ?? '',
      position: payload.position ?? '',
      type: payload.type ?? '',
      customer: payload.customer ?? '',
      location: payload.location ?? '',
      content: payload.content ?? '',
      dates: payload.dates ?? [],
      tech: payload.tech ?? [],
      customers: payload.customers ?? []
    }
    return await this.axiosInstance.post('project', sendobject).then((response) => {
      return response.data
    })
  }

  async updateProject(payload) {
    const sendobject = {
      uuid: payload.id ?? '',
      name: payload.name ?? '',
      type: payload.type ?? '',
      position: payload.position ?? '',
      customer: payload.customer ?? '',
      location: payload.location ?? '',
      content: payload.content ?? '',
      dates: payload.dates ?? [],
      tech: payload.tech ?? [],
      customers: payload.customers ?? []
    }
    return await this.axiosInstance.put('project/' + payload.id, sendobject).then((response) => {
      return response.data
    })
  }

  async deleteProject(payload) {
    return await this.axiosInstance.delete('project/' + payload.id).then((response) => {
      return response.data
    })
  }
}

export default new ProjectsService()
