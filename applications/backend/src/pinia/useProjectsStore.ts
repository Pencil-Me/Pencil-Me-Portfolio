import { defineStore } from 'pinia'
import ProjectService from '@/services/projects.service'
import { withStoreAction } from '@/pinia/useAppStore'
import type { TProject } from '@/types/project'
import type { TSelectOption } from '@/types/select-option'
import { mapProjectTypesToSelectOptions } from '@/utils/mappers/project.mapper'
import { mapProjectsForListDisplay } from '@/utils/mappers/project-display.mapper'

const emptyProject = (): TProject => ({
  id: '',
  name: '',
  show: 0,
  type: -1,
  position: '',
  location: '',
  content: '',
  content_long: '',
  content_short: '',
  customer: '',
  dates: [],
  customers: [],
  tech: []
})

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as TProject[],
    current: emptyProject(),
    types: [] as TSelectOption[]
  }),
  getters: {
    projectItems: (state) => state.projects,
    projectListItems: (state) => mapProjectsForListDisplay(state.projects),
    projectTypes: (state) => state.types,
    currentProject: (state) => state.current
  },
  actions: {
    async getAllProjects() {
      await withStoreAction(async () => {
        this.projects = await ProjectService.getProjects()
      })
    },
    async setCurrentProjectItem(id: string) {
      await withStoreAction(async () => {
        this.current = await ProjectService.getProject(id)
      })
    },
    async getAllProjectTypes() {
      await withStoreAction(async () => {
        const response = await ProjectService.getProjectTypes()
        this.types = mapProjectTypesToSelectOptions(response)
      })
    },
    async addProject(project: TProject) {
      await withStoreAction(async () => {
        await ProjectService.createProject(project)
        await this.getAllProjects()
      })
    },
    async updateCurrentProject(project: TProject) {
      await withStoreAction(async () => {
        await ProjectService.updateProject(project)
        this.current = await ProjectService.getProject(project.id ?? '')
        await this.getAllProjects()
      })
    },
    async deleteCurrentProject(project: TProject) {
      await withStoreAction(async () => {
        await ProjectService.deleteProject(project)
        await this.getAllProjects()
      })
    }
  }
})
