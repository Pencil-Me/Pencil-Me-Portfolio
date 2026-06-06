import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

export { useAppStore, withStoreAction } from '@/pinia/useAppStore'
export { useProjectsStore } from '@/pinia/useProjectsStore'
export { useCustomersStore } from '@/pinia/useCustomersStore'
export { useTechStackStore } from '@/pinia/useTechStackStore'
