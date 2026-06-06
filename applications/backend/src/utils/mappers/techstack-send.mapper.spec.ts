import { describe, expect, it } from 'vitest'
import { convertTTechStackToSendPayload } from '@/utils/mappers/techstack-send.mapper'

describe('convertTTechStackToSendPayload', () => {
  it('maps tech stack to API payload', () => {
    const payload = convertTTechStackToSendPayload({
      id: 'id-1',
      name: 'Vue',
      type: 'FEDEV',
      expertise_level: '5',
      flag_important: true
    })

    expect(payload.uuid).toBe('id-1')
    expect(payload.name).toBe('Vue')
    expect(payload.flag_important).toBe(true)
  })
})
