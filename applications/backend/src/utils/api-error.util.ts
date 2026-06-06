import axios from 'axios'

export function extractApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String((data as { message: unknown }).message)
    }

    if (typeof data === 'string' && data.length > 0) {
      return data
    }

    if (error.response?.status === 401) {
      return 'Nicht autorisiert. Bitte API-Key prüfen.'
    }

    return error.message || 'API-Anfrage fehlgeschlagen.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ein unerwarteter Fehler ist aufgetreten.'
}
