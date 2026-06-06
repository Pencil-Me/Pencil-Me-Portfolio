import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTechStackStore } from '@/pinia/useTechStackStore'
import { useAppStore } from '@/pinia/useAppStore'

vi.mock('@/services/techstack.service', () => ({
  default: {
    getTechStacks: vi.fn(),
    getTechStack: vi.fn(),
    getTechStackTypes: vi.fn(),
    createTechStack: vi.fn(),
    updateTechStack: vi.fn(),
    deleteTechStack: vi.fn()
  }
}))

describe('useTechStackStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads tech stacks on success', async () => {
    const TechStackService = (await import('@/services/techstack.service')).default
    vi.mocked(TechStackService.getTechStacks).mockResolvedValue([
      {
        id: '1',
        name: 'Vue',
        type: 'FEDEV',
        expertise_level: '5',
        flag_important: false
      }
    ])

    const store = useTechStackStore()
    await store.getAllTechStacks()

    expect(store.techStackItems).toHaveLength(1)
  })

  it('sets error when fetch fails', async () => {
    const TechStackService = (await import('@/services/techstack.service')).default
    vi.mocked(TechStackService.getTechStacks).mockRejectedValue(new Error('fail'))

    const store = useTechStackStore()
    const app = useAppStore()

    await expect(store.getAllTechStacks()).rejects.toThrow()
    expect(app.hasError).toBe(true)
  })
})
