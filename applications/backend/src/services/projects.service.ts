import axios from 'axios'
import {
  convertIProjectTypeToTProjectType,
  type IProject,
  type IProjectType,
  type TCustomer,
  type TDates,
  type TProject,
  type TProjectType,
  type TTech
} from '@/views/Projects/ProjectTypes'
import { convertIProjectToTProject } from '@/views/Projects/ProjectTypes'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

class ProjectsService {
  axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'API-Key': API_KEY
    }
  })

  async getProjectTypes(): Promise<TProjectType[]> {
    return await this.axiosInstance
      .get('project_types')
      .then((response: { data: IProjectType[] }) => {
        const returnObj = response.data.map((e) => convertIProjectTypeToTProjectType(e))
        return returnObj
      })
  }

  async getProjects(): Promise<TProject[]> {
    return await this.axiosInstance.get('project').then((response: { data: IProject[] }) => {
      return response.data.map((e) => convertIProjectToTProject(e))
    })
  }
  async getProject(id: string): Promise<TProject> {
    return await this.axiosInstance.get('project/' + id).then((response: { data: IProject }) => {
      return convertIProjectToTProject(response.data)
    })
  }

  convertTProjectToSendObj(payload: TProject) {
    const returnObj = {
      uuid: payload.id ?? undefined,
      name: payload.name ?? '',
      public: Number(payload.show),
      position: payload.position ?? '',
      type: payload.type ?? '-1',
      customer: payload.customer ?? '',
      location: payload.location ?? '',
      content: payload.content ?? '',
      content_short: payload.content_short ?? '',
      content_long: payload.content_long ?? '',
      dates: payload.dates.map((e) => this.convertTDatesToSendObj(e)) ?? [],
      tech: payload.tech.map((e) => this.convertTTechToSendObj(e)) ?? [],
      customers: payload.customers.map((e) => this.convertTCustomerToSendObj(e)) ?? []
    }
    return returnObj
  }

  convertTDatesToSendObj(payload: TDates) {
    const returnObj = {
      start_date: payload.start_date ?? new Date(),
      end_date: payload.end_date ?? undefined
    }
    return returnObj
  }

  convertTTechToSendObj(payload: TTech) {
    const returnObj = {
      id: payload.id,
      name: payload.name ?? '',
      type: payload.type ?? -1,
      expertise_level: payload.expertise_level ?? '0'
    }
    return returnObj
  }

  convertTCustomerToSendObj(payload: TCustomer) {
    const returnObj = {
      id: payload.id,
      name: payload.name ?? '',
      location: payload.location ?? ''
    }
    return returnObj
  }

  async createProject(payload: TProject) {
    const sendobject = this.convertTProjectToSendObj(payload)
    return await this.axiosInstance.post('project', sendobject).then((response) => {
      return response.data
    })
  }

  async updateProject(payload: TProject) {
    const sendobject = this.convertTProjectToSendObj(payload)
    return await this.axiosInstance.put('project/' + payload.id, sendobject).then((response) => {
      return response.data
    })
  }

  async deleteProject(payload: TProject) {
    return await this.axiosInstance.delete('project/' + payload.id).then((response) => {
      return response.data
    })
  }
}

export default new ProjectsService()
