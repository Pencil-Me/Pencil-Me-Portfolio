import { apiClient } from '@/services/http-client'
import {
  convertIProjectToTProject,
  convertIProjectTypeToTProjectType,
  type IProject,
  type IProjectType,
  type TProject,
  type TProjectType
} from '@/types'
import { convertTProjectToSendPayload } from '@/utils/mappers/project-send.mapper'
import {
  normalizeProjectForEdit,
  normalizeProjects
} from '@/utils/mappers/project.mapper'

class ProjectsService {
  async getProjectTypes(): Promise<TProjectType[]> {
    const response = await apiClient.get<IProjectType[]>('project_types')
    return response.data.map((entry) => convertIProjectTypeToTProjectType(entry))
  }

  async getProjects(): Promise<TProject[]> {
    const response = await apiClient.get<IProject[]>('project')
    return normalizeProjects(response.data.map((entry) => convertIProjectToTProject(entry)))
  }

  async getProject(id: string): Promise<TProject> {
    const response = await apiClient.get<IProject>('project/' + id)
    return normalizeProjectForEdit(convertIProjectToTProject(response.data))
  }

  async createProject(payload: TProject) {
    const response = await apiClient.post('project', convertTProjectToSendPayload(payload))
    return response.data
  }

  async updateProject(payload: TProject) {
    const response = await apiClient.put(
      'project/' + payload.id,
      convertTProjectToSendPayload(payload)
    )
    return response.data
  }

  async deleteProject(payload: TProject) {
    const response = await apiClient.delete('project/' + payload.id)
    return response.data
  }
}

export default new ProjectsService()
