import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProjectsStore } from '@/pinia/useProjectsStore'
import { useAppStore } from '@/pinia/useAppStore'

vi.mock('@/services/projects.service', () => ({
  default: {
    getProjects: vi.fn(),
    getProject: vi.fn(),
    getProjectTypes: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn()
  }
}))

describe('useProjectsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads projects on success', async () => {
    const ProjectService = (await import('@/services/projects.service')).default
    vi.mocked(ProjectService.getProjects).mockResolvedValue([
      {
        id: '1',
        name: 'Test',
        show: 1,
        type: 0,
        position: '',
        location: '',
        content: '',
        content_short: '',
        content_long: '',
        customer: '',
        dates: [],
        customers: [],
        tech: []
      }
    ])

    const store = useProjectsStore()
    await store.getAllProjects()

    expect(store.projectItems).toHaveLength(1)
  })

  it('sets error when fetch fails', async () => {
    const ProjectService = (await import('@/services/projects.service')).default
    vi.mocked(ProjectService.getProjects).mockRejectedValue(new Error('fail'))

    const store = useProjectsStore()
    const app = useAppStore()

    await expect(store.getAllProjects()).rejects.toThrow()
    expect(app.hasError).toBe(true)
  })
})
