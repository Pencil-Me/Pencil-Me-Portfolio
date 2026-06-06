import { apiClient } from '@/services/http-client'
import {
  convertITechStackToTTechStack,
  convertITechStackTypesToTTechStackTypes,
  type ITechStack,
  type ITechStackTypes,
  type TTechStack,
  type TTechStackTypes
} from '@/types/techstack'
import { convertTTechStackToSendPayload } from '@/utils/mappers/techstack-send.mapper'
import { normalizeTechStack, normalizeTechStacks } from '@/utils/mappers/techstack.mapper'

class TechStacksService {
  async getTechStackTypes(): Promise<TTechStackTypes[]> {
    const response = await apiClient.get<ITechStackTypes[]>('techstack_types')
    return response.data.map((entry) => convertITechStackTypesToTTechStackTypes(entry))
  }

  async getTechStacks(): Promise<TTechStack[]> {
    const response = await apiClient.get<ITechStack[]>('techstack')
    return normalizeTechStacks(response.data.map((entry) => convertITechStackToTTechStack(entry)))
  }

  async getTechStack(id: string): Promise<TTechStack> {
    const response = await apiClient.get<ITechStack[]>('techstack/' + id)
    return normalizeTechStack(convertITechStackToTTechStack(response.data[0]))
  }

  async createTechStack(payload: TTechStack) {
    const response = await apiClient.post('techstack', convertTTechStackToSendPayload(payload))
    return response.data
  }

  async updateTechStack(payload: TTechStack) {
    const response = await apiClient.put(
      'techstack/' + payload.id,
      convertTTechStackToSendPayload(payload)
    )
    return response.data
  }

  async deleteTechStack(payload: TTechStack) {
    const response = await apiClient.delete('techstack/' + payload.id)
    return response.data
  }
}

export default new TechStacksService()
