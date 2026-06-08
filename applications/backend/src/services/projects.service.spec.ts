import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockApiGet, resetApiClientMocks } from '@/testing/api-client.mock'

describe('ProjectsService', () => {
  beforeEach(() => {
    resetApiClientMocks()
    vi.resetModules()
  })

  it('loads projects from the API', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: [
        {
          uuid: '11111111-2222-3333-4444-555555555555',
          name: 'Portfolio',
          public: 1,
          type: 1,
          position: 'Developer',
          customer: 'Acme',
          location: 'Berlin',
          content: 'Short',
          content_short: 'Short',
          content_long: 'Long',
          customers: [],
          dates: [],
          tech: []
        }
      ]
    })

    const { default: projectsService } = await import('./projects.service')
    const projects = await projectsService.getProjects()

    expect(mockApiGet).toHaveBeenCalledWith('project')
    expect(projects).toHaveLength(1)
    expect(projects[0].name).toBe('Portfolio')
    expect(projects[0].show).toBe(1)
  })

  it('loads project types from the API', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: [{ id: '1', type: 'Festanstellung' }]
    })

    const { default: projectsService } = await import('./projects.service')
    const types = await projectsService.getProjectTypes()

    expect(mockApiGet).toHaveBeenCalledWith('project_types')
    expect(types[0].type).toBe('Festanstellung')
  })
})
