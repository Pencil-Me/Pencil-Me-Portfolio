import { describe, expect, it } from 'vitest'
import axios from 'axios'
import { extractApiErrorMessage } from '@/utils/api-error.util'

describe('extractApiErrorMessage', () => {
  it('reads message from JSON response body', () => {
    const error = new axios.AxiosError('fail')
    error.response = {
      status: 400,
      data: { message: 'Ungültige Eingabe' },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never
    }

    expect(extractApiErrorMessage(error)).toBe('Ungültige Eingabe')
  })

  it('returns API-Key hint for 401', () => {
    const error = new axios.AxiosError('Unauthorized')
    error.response = {
      status: 401,
      data: '',
      statusText: 'Unauthorized',
      headers: {},
      config: {} as never
    }

    expect(extractApiErrorMessage(error)).toBe('Nicht autorisiert. Bitte API-Key prüfen.')
  })

  it('falls back for generic errors', () => {
    expect(extractApiErrorMessage(new Error('Netzwerk'))).toBe('Netzwerk')
  })
})
