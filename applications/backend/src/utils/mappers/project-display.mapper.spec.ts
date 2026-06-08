import { describe, expect, it } from 'vitest'
import { mapProjectsForListDisplay } from '@/utils/mappers/project-display.mapper'
import type { TProject } from '@/types/project'

describe('mapProjectsForListDisplay', () => {
  it('formats dates and computes last_date', () => {
    const projects: TProject[] = [
      {
        id: '1',
        name: 'A',
        show: 1,
        type: 0,
        position: 'Dev/Ops',
        location: 'Berlin',
        content: '',
        content_short: '',
        content_long: '',
        customer: '',
        dates: [
          { start_date: '2023-01-01', end_date: '2023-06-01' },
          { start_date: '2024-01-01', end_date: '2024-06-01' }
        ],
        customers: [],
        tech: [],
        featured_rank: 0,
        featured_tag: '',
        featured_problem: '',
        featured_role: '',
        featured_outcome: ''
      }
    ]

    const result = mapProjectsForListDisplay(projects)

    expect(result[0].position).toBe('Dev / Ops')
    expect(result[0].last_date).toBe('2024-06-01')
    expect(result[0].dates[0].start_date).toMatch(/\d/)
  })
})
