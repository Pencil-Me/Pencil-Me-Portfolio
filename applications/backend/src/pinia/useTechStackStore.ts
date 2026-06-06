import { defineStore } from 'pinia'
import TechStackService from '@/services/techstack.service'
import { withStoreAction } from '@/pinia/useAppStore'
import type { TSelectOption } from '@/types/select-option'
import type { TTechStack } from '@/types/techstack'
import { mapTechStackTypesToSelectOptions } from '@/utils/mappers/techstack.mapper'

const emptyTechStack = (): TTechStack => ({
  id: '',
  name: '',
  type: '',
  expertise_level: '',
  last_usage: '',
  flag_important: false,
  project_count: ''
})

export const useTechStackStore = defineStore('techstack', {
  state: () => ({
    items: [] as TTechStack[],
    current: emptyTechStack(),
    types: [] as TSelectOption[]
  }),
  getters: {
    techStackItems: (state) => state.items,
    techStackTypes: (state) => state.types,
    currentTechStack: (state) => state.current
  },
  actions: {
    async getAllTechStacks() {
      await withStoreAction(async () => {
        this.items = await TechStackService.getTechStacks()
      })
    },
    async setCurrentTechStackItem(id: string) {
      await withStoreAction(async () => {
        this.current = await TechStackService.getTechStack(id)
      })
    },
    async getAllTechStackTypes() {
      await withStoreAction(async () => {
        const response = await TechStackService.getTechStackTypes()
        this.types = mapTechStackTypesToSelectOptions(response)
      })
    },
    async addTechStack(techStack: TTechStack) {
      await withStoreAction(async () => {
        await TechStackService.createTechStack(techStack)
        await this.getAllTechStacks()
      })
    },
    async updateTechStack(techStack: TTechStack) {
      await withStoreAction(async () => {
        await TechStackService.updateTechStack(techStack)
        this.current = await TechStackService.getTechStack(techStack.id ?? '')
        await this.getAllTechStacks()
      })
    },
    async deleteTechStack(techStack: TTechStack) {
      await withStoreAction(async () => {
        await TechStackService.deleteTechStack(techStack)
        await this.getAllTechStacks()
      })
    }
  }
})
