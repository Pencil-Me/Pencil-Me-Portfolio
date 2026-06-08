import { describe, expect, it } from 'vitest'
import type { TProject } from '@/types/project'
import { cloneProject } from '@/utils/mappers/project.mapper'

describe('cloneProject', () => {
  it('deep-clones nested arrays so mutations do not affect the source', () => {
    const source: TProject = {
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
      dates: [{ start_date: '2024-01-01', end_date: '2024-06-01' }],
      tech: [{ id: 't1', name: 'Vue', type: '1', expertise_level: '5', flag_important: false }],
      customers: [{ id: 'c1', name: 'ACME', location: 'Berlin' }],
      featured_rank: 0,
      featured_tag: '',
      featured_problem: '',
      featured_role: '',
      featured_outcome: ''
    }

    const cloned = cloneProject(source)

    cloned.dates[0].start_date = '2099-01-01'
    cloned.tech[0].name = 'React'
    cloned.customers[0].name = 'Other'

    expect(source.dates[0].start_date).toBe('2024-01-01')
    expect(source.tech[0].name).toBe('Vue')
    expect(source.customers[0].name).toBe('ACME')
  })
})
