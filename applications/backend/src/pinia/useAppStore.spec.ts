import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore, withStoreAction } from '@/pinia/useAppStore'

describe('withStoreAction', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tracks loading and clears errors on success', async () => {
    const app = useAppStore()
    app.setError('alt')

    await withStoreAction(async () => {})

    expect(app.isLoading).toBe(false)
    expect(app.hasError).toBe(false)
  })

  it('sets error message when action fails', async () => {
    const app = useAppStore()

    await expect(
      withStoreAction(async () => {
        throw new Error('Speichern fehlgeschlagen')
      })
    ).rejects.toThrow('Speichern fehlgeschlagen')

    expect(app.errorMessage).toBe('Speichern fehlgeschlagen')
    expect(app.isLoading).toBe(false)
  })
})
