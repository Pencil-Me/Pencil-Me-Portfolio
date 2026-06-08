import { describe, expect, it } from 'vitest'
import type { TTechStack, TTechStackTypes } from '@/types/techstack'
import {
  cloneTechStack,
  mapTechStackTypesToSelectOptions,
  normalizeTechStack,
  normalizeTechStacks
} from '@/utils/mappers/techstack.mapper'

describe('normalizeTechStack', () => {
  it('fills missing string fields and defaults flag_important to false', () => {
    const item = { id: '1' } as TTechStack

    expect(normalizeTechStack(item)).toEqual({
      id: '1',
      name: '',
      type: '',
      expertise_level: '',
      flag_important: false,
      project_count: undefined,
      last_usage: undefined
    })
  })

  it('preserves optional project_count and last_usage', () => {
    const item: TTechStack = {
      id: '2',
      name: 'Vue',
      type: 'FEFRAME',
      expertise_level: '5',
      flag_important: true,
      project_count: '3',
      last_usage: '2024-01-01'
    }

    expect(normalizeTechStack(item)).toEqual(item)
  })
})

describe('normalizeTechStacks', () => {
  it('normalizes each tech stack entry', () => {
    const items = [{ id: '1' } as TTechStack]

    expect(normalizeTechStacks(items)).toEqual([
      {
        id: '1',
        name: '',
        type: '',
        expertise_level: '',
        flag_important: false,
        project_count: undefined,
        last_usage: undefined
      }
    ])
  })
})

describe('mapTechStackTypesToSelectOptions', () => {
  it('maps known enum types to labels', () => {
    const types: TTechStackTypes[] = [{ id: '1', type: 'FEDEV' }]

    expect(mapTechStackTypesToSelectOptions(types)).toEqual([
      { value: '1', label: 'Frontend Development' }
    ])
  })

  it('falls back to raw type when label is unknown', () => {
    const types: TTechStackTypes[] = [{ id: '2', type: 'CUSTOM' }]

    expect(mapTechStackTypesToSelectOptions(types)).toEqual([{ value: '2', label: 'CUSTOM' }])
  })

  it('uses empty value when id is missing', () => {
    const types = [{ type: 'DB' } as TTechStackTypes]

    expect(mapTechStackTypesToSelectOptions(types)).toEqual([{ value: '', label: 'Databases' }])
  })
})

describe('cloneTechStack', () => {
  it('creates a shallow copy', () => {
    const source: TTechStack = {
      id: '1',
      name: 'Vue',
      type: 'FEFRAME',
      expertise_level: '5',
      flag_important: false
    }
    const cloned = cloneTechStack(source)

    cloned.name = 'React'

    expect(source.name).toBe('Vue')
    expect(cloned.name).toBe('React')
  })
})
