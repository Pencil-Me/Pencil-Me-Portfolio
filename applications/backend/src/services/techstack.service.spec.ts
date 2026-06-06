import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()
const mockDelete = vi.fn()

vi.mock('./http-client', () => ({
  apiClient: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete
  }
}))

describe('TechStacksService', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockPost.mockReset()
    mockPut.mockReset()
    mockDelete.mockReset()
    vi.resetModules()
  })

  it('loads tech stacks from the API', async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ uuid: 'ts-1', name: 'Vue', type: 'FEFRAME', expertise_level: '3' }]
    })

    const { default: techStackService } = await import('./techstack.service')
    const items = await techStackService.getTechStacks()

    expect(mockGet).toHaveBeenCalledWith('techstack')
    expect(items[0].name).toBe('Vue')
  })

  it('creates a tech stack entry', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })

    const { default: techStackService } = await import('./techstack.service')
    await techStackService.createTechStack({
      id: 'new',
      name: 'Pinia',
      type: 'FEFRAME',
      expertise_level: '4',
      flag_important: false
    })

    expect(mockPost).toHaveBeenCalledWith('techstack', {
      uuid: 'new',
      name: 'Pinia',
      type: 'FEFRAME',
      expertise_level: '4',
      flag_important: false
    })
  })

  it('updates a tech stack entry', async () => {
    mockPut.mockResolvedValueOnce({ data: {} })

    const { default: techStackService } = await import('./techstack.service')
    await techStackService.updateTechStack({
      id: 'ts-1',
      name: 'Vue 3',
      type: 'FEFRAME',
      expertise_level: '5',
      flag_important: true
    })

    expect(mockPut).toHaveBeenCalledWith('techstack/ts-1', expect.objectContaining({ name: 'Vue 3' }))
  })

  it('deletes a tech stack entry', async () => {
    mockDelete.mockResolvedValueOnce({ data: {} })

    const { default: techStackService } = await import('./techstack.service')
    await techStackService.deleteTechStack({
      id: 'ts-1',
      name: 'Vue',
      type: 'FEFRAME',
      expertise_level: '3',
      flag_important: false
    })

    expect(mockDelete).toHaveBeenCalledWith('techstack/ts-1')
  })
})
