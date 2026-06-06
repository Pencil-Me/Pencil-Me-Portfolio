import { onMounted, ref } from 'vue'

export function useEditEntityLoad(loadFn: (id: string) => Promise<void>, id: string) {
  const loadFailed = ref(false)
  const isReady = ref(false)

  onMounted(async () => {
    if (!id?.trim()) {
      loadFailed.value = true
      return
    }

    try {
      await loadFn(id)
      isReady.value = true
    } catch {
      loadFailed.value = true
    }
  })

  return { loadFailed, isReady }
}
