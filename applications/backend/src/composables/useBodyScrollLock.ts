import { onUnmounted, watch, type Ref } from 'vue'

export function useBodyScrollLock(isLocked: Ref<boolean>): void {
  watch(
    isLocked,
    (locked) => {
      document.body.classList.toggle('overflow-hidden', locked)
    },
    { immediate: true }
  )

  onUnmounted(() => {
    document.body.classList.remove('overflow-hidden')
  })
}
