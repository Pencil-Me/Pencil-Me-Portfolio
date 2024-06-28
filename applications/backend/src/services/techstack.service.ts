import axios from 'axios'
import {
  convertITechStackToTTechStack,
  convertITechStackTypesToTTechStackTypes,
  type ITechStack,
  type ITechStackTypes,
  type TTechStack,
  type TTechStackTypes
} from '@/views/TechStack/TechStackTypes'

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

class TechStacksService {
  axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'API-Key': API_KEY
    }
  })

  async getTechStackTypes(): Promise<TTechStackTypes[]> {
    return await this.axiosInstance
      .get('techstack_types')
      .then((response: { data: ITechStackTypes[] }) => {
        return response.data.map((e) => convertITechStackTypesToTTechStackTypes(e))
      })
  }

  async getTechStacks(): Promise<ITechStack[]> {
    return await this.axiosInstance.get('techstack').then((response: { data: ITechStack[] }) => {
      return response.data.map((e) => convertITechStackToTTechStack(e))
    })
  }

  async getTechStack(id: string): Promise<ITechStack> {
    return await this.axiosInstance
      .get('techstack/' + id)
      .then((response: { data: ITechStack[] }) => {
        return convertITechStackToTTechStack(response.data[0])
      })
  }

  convertTTechStackToSendObj(payload: TTechStack): ITechStack {
    const returnObj: ITechStack = {
      uuid: payload.id ?? undefined,
      name: payload.name ?? '',
      type: payload.type ?? '',
      expertise_level: payload.expertise_level ?? '',
      flag_important: payload.flag_important
    }
    return returnObj
  }

  async createTechStack(payload: TTechStack) {
    const sendobject = this.convertTTechStackToSendObj(payload)
    return await this.axiosInstance.post('techstack', sendobject).then((response) => {
      return response.data
    })
  }

  async updateTechStack(payload: TTechStack) {
    const sendobject = this.convertTTechStackToSendObj(payload)
    return await this.axiosInstance.put('techstack/' + payload.id, sendobject).then((response) => {
      return response.data
    })
  }

  async deleteTechStack(payload: TTechStack) {
    return await this.axiosInstance.delete('techstack/' + payload.id).then((response) => {
      return response.data
    })
  }
}

export default new TechStacksService()
