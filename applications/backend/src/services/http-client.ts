import axios from 'axios'
import { extractApiErrorMessage } from '@/utils/api-error.util'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000,
  headers: {
    'API-Key': import.meta.env.VITE_API_KEY
  }
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        error.message = 'Nicht autorisiert. Bitte API-Key prüfen.'
      } else if (error.response?.status && error.response.status >= 500) {
        error.message = extractApiErrorMessage(error)
      }
    }
    return Promise.reject(error)
  }
)
