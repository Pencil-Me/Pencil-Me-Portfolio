import { describe, expect, it } from 'vitest'
import { validateProject } from '@/utils/validation/project.validation'
import type { TProject } from '@/types/project'

const baseProject = (): TProject => ({
  id: '',
  name: 'Test',
  show: 0,
  type: 0,
  position: '',
  location: '',
  content: '',
  content_short: '',
  content_long: '',
  customer: '',
  dates: [],
  customers: [],
  tech: [],
  featured_rank: 0,
  featured_tag: '',
  featured_problem: '',
  featured_role: '',
  featured_outcome: ''
})

describe('validateProject', () => {
  it('accepts valid project', () => {
    expect(validateProject(baseProject()).valid).toBe(true)
  })

  it('rejects empty name', () => {
    const result = validateProject({ ...baseProject(), name: '   ' })
    expect(result.valid).toBe(false)
    expect(result.message).toContain('Name')
  })

  it('rejects missing type', () => {
    const result = validateProject({ ...baseProject(), type: -1 })
    expect(result.valid).toBe(false)
  })
})
