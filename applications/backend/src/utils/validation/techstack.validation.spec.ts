import { describe, expect, it } from 'vitest'
import { validateTechStack } from '@/utils/validation/techstack.validation'

describe('validateTechStack', () => {
  it('accepts valid tech stack', () => {
    expect(
      validateTechStack({
        name: 'Vue',
        type: '1',
        expertise_level: '5',
        flag_important: false
      }).valid
    ).toBe(true)
  })

  it('rejects empty expertise level', () => {
    const result = validateTechStack({
      name: 'Vue',
      type: '1',
      expertise_level: ' ',
      flag_important: false
    })
    expect(result.valid).toBe(false)
  })
})
