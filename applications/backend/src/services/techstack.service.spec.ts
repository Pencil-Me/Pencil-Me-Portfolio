import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  mockApiDelete,
  mockApiGet,
  mockApiPost,
  mockApiPut,
  resetApiClientMocks
} from '@/testing/api-client.mock'

describe('TechStacksService', () => {
  beforeEach(() => {
    resetApiClientMocks()
    vi.resetModules()
  })

  it('loads tech stacks from the API', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: [{ uuid: 'ts-1', name: 'Vue', type: 'FEFRAME', expertise_level: '3' }]
    })

    const { default: techStackService } = await import('./techstack.service')
    const items = await techStackService.getTechStacks()

    expect(mockApiGet).toHaveBeenCalledWith('techstack')
    expect(items[0].name).toBe('Vue')
  })

  it('creates a tech stack entry', async () => {
    mockApiPost.mockResolvedValueOnce({ data: {} })

    const { default: techStackService } = await import('./techstack.service')
    await techStackService.createTechStack({
      id: 'new',
      name: 'Pinia',
      type: 'FEFRAME',
      expertise_level: '4',
      flag_important: false
    })

    expect(mockApiPost).toHaveBeenCalledWith('techstack', {
      uuid: 'new',
      name: 'Pinia',
      type: 'FEFRAME',
      expertise_level: '4',
      flag_important: false
    })
  })

  it('updates a tech stack entry', async () => {
    mockApiPut.mockResolvedValueOnce({ data: {} })

    const { default: techStackService } = await import('./techstack.service')
    await techStackService.updateTechStack({
      id: 'ts-1',
      name: 'Vue 3',
      type: 'FEFRAME',
      expertise_level: '5',
      flag_important: true
    })

    expect(mockApiPut).toHaveBeenCalledWith(
      'techstack/ts-1',
      expect.objectContaining({ name: 'Vue 3' })
    )
  })

  it('deletes a tech stack entry', async () => {
    mockApiDelete.mockResolvedValueOnce({ data: {} })

    const { default: techStackService } = await import('./techstack.service')
    await techStackService.deleteTechStack({
      id: 'ts-1',
      name: 'Vue',
      type: 'FEFRAME',
      expertise_level: '3',
      flag_important: false
    })

    expect(mockApiDelete).toHaveBeenCalledWith('techstack/ts-1')
  })
})
