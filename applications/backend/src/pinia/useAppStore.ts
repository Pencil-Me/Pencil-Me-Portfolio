import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '@/utils/api-error.util'

export const useAppStore = defineStore('app', {
  state: () => ({
    pendingRequests: 0,
    error: null as string | null,
    lastErrorAt: null as number | null
  }),
  getters: {
    isLoading: (state) => state.pendingRequests > 0,
    errorMessage: (state) => state.error,
    hasError: (state) => state.error !== null
  },
  actions: {
    beginRequest() {
      this.pendingRequests += 1
    },
    endRequest() {
      this.pendingRequests = Math.max(0, this.pendingRequests - 1)
    },
    setError(message: string) {
      this.error = message
      this.lastErrorAt = Date.now()
    },
    clearError() {
      this.error = null
    },
    showError(message: string) {
      this.setError(message)
    }
  }
})

export async function withStoreAction(action: () => Promise<void>): Promise<void> {
  const app = useAppStore()
  app.beginRequest()
  app.clearError()

  try {
    await action()
  } catch (error) {
    app.setError(extractApiErrorMessage(error))
    throw error
  } finally {
    app.endRequest()
  }
}
