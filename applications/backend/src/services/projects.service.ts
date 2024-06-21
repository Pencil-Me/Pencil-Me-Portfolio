import axios from 'axios'
import {
  convertIProjectTypeToTProjectType,
  type IProject,
  type IProjectType,
  type TProject,
  type TProjectType
} from "@/views/Projects/ProjectTypes";
import {convertIProjectToTProject} from "@/views/Projects/ProjectTypes";

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
    return await
      this.axiosInstance
        .get('project_types')
        .then((response: { data: IProjectType[] }) => {
          const returnObj = response.data.map(e => convertIProjectTypeToTProjectType(e))
          console.log(returnObj)
          return returnObj
        })
  }

  async getProjects(): Promise<TProject[]> {
    return await
      this.axiosInstance
        .get('project')
        .then((response: { data: IProject[] }) => {
          return response.data.map(e => convertIProjectToTProject(e));
        })
  }
  async getProject(id: string): Promise<TProject> {
    return await
      this.axiosInstance
        .get('project/' + id)
        .then((response: { data: IProject }) => {
          return convertIProjectToTProject(response.data)
        })
  }
  async createProject(payload: TProjectType) {
    const sendobject = convertIProjectToTProject(payload)
    return await
      this.axiosInstance
        .post('project', sendobject)
        .then((response) => {
          return response.data
        })
  }

  async updateProject(payload: TProjectType) {
    const sendobject = convertIProjectToTProject(payload)
    return await
      this.axiosInstance
        .put('project/' + payload.id, sendobject)
        .then((response) => {
          return response.data
        })
  }

  async deleteProject(payload: TProjectType) {
    return await
      this.axiosInstance
        .delete('project/' + payload.id)
        .then((response) => {
          return response.data
        })
  }
}

export default new ProjectsService()
