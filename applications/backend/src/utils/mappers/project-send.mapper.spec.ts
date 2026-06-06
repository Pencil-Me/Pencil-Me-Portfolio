import { describe, expect, it } from 'vitest'
import { convertTProjectToSendPayload } from '@/utils/mappers/project-send.mapper'
import type { TProject } from '@/types/project'

describe('convertTProjectToSendPayload', () => {
  it('maps domain fields to API payload', () => {
    const project: TProject = {
      id: 'abc',
      name: 'Portfolio',
      show: 1,
      type: 2,
      position: 'Dev',
      location: 'Berlin',
      content: 'c',
      content_short: 'cs',
      content_long: 'cl',
      customer: 'x',
      dates: [{ start_date: '2024-01-01', end_date: '2024-02-01' }],
      tech: [
        {
          id: '1',
          name: 'Vue',
          type: '1',
          expertise_level: '5',
          flag_important: false
        }
      ],
      customers: [{ id: 'c1', name: 'ACME', location: 'Berlin' }]
    }

    const payload = convertTProjectToSendPayload(project)

    expect(payload.uuid).toBe('abc')
    expect(payload.public).toBe(1)
    expect(payload.name).toBe('Portfolio')
    expect(payload.dates).toHaveLength(1)
    expect(payload.tech[0].name).toBe('Vue')
  })
})
