import ProjectService from '@/services/projects.service'
import TechStackService from '@/services/techstack.service'
import CustomerService from '@/services/customer.service'
import { createStore } from 'vuex'
import moment from 'moment/moment'
import type { TCustomer, TDates, TProject, TProjectType } from '@/views/Projects/ProjectTypes'
import type { TTechStack, TTechStackTypes } from '@/views/TechStack/TechStackTypes'

function updateLocalStorage(state: State) {
  localStorage.setItem('projects', JSON.stringify(state))
}

export enum techStackType {
  'FEDEV' = 'Frontend Development',
  'BEDEV' = 'Backend Development',
  'FEFRAME' = 'Frontend Frameworks',
  'BEFRAME' = 'Backend Frameworks',
  'FEBT' = 'Frontend Build Tools',
  'DEVOPS' = 'Devops',
  'DB' = 'Databases',
  'CMS' = 'CMS',
  'TEST' = 'Testing Frameworks',
  'PROJECTTOO' = 'Project Tools',
  'MISC' = 'Misc',
  'DESIGN' = 'Design',
  'LANG' = 'Spoken Languages'
}

export enum projectType {
  'FEST' = 'Festanstellung',
  'CUST' = 'Projektarbeit',
  'PRIV' = 'Private Projekte'
}

type TSelectObject = {
  name: string
  value: any
}

interface State {
  projects: TProject[]
  currentCustomer: {
    id: string
    name: string
    location: string
  }
  currentProject: TProject
  currentTechStack: {
    id: string
    name: string
    type: string
    expertise_level: string
    last_usage: string
    flag_important: boolean
    project_count: string
  }
  techStack: TTechStack[]
  customers: TCustomer[]
  techStackTypes: TSelectObject[]
  projectTypes: TProjectType[]
  loading: boolean
}

const initialState: State = {
  projects: [],
  currentCustomer: {
    id: '',
    name: '',
    location: ''
  },
  currentProject: {
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
  },
  currentTechStack: {
    id: '',
    name: '',
    type: '',
    expertise_level: '',
    last_usage: '',
    flag_important: false,
    project_count: ''
  },
  techStack: [],
  customers: [],
  techStackTypes: [],
  projectTypes: [],
  loading: true
}

export default createStore({
  state: initialState,
  getters: {
    techStackItems: (state: State) => state.techStack,
    techStackTypes: (state: State) => state.techStackTypes,
    projectTypes: (state: State) => state.projectTypes,
    currentTechStack: (state: State) => state.currentTechStack,
    projectItems: (state: State) => state.projects,
    customerItems: (state: State) => state.customers,
    currentProject: (state: State) => state.currentProject,
    currentCustomer: (state: State) => state.currentCustomer,
    isLoading: (state: State) => state.loading
  },
  mutations: {
    UPDATE_PROJECTS_FROM_LOCAL_STORAGE(state: State) {
      const projects = localStorage.getItem('projects')
      if (projects) {
        state.projects = JSON.parse(projects)
      }
    },

    UPDATE_CURRENT_PROJECT(state: State, updatedProject: TProject) {
      state.currentProject = { ...state.currentProject, ...updatedProject }
    },

    SET_ALL_TECHSTACKS(state: State, payload: TTechStack[]) {
      const cleanedObj = []
      for (let i = 0; i < payload.length; i++) {
        cleanedObj.push({
          id: payload[i].id,
          name: payload[i].name,
          type: payload[i].type,
          expertise_level: payload[i].expertise_level,
          flag_important: payload[i].flag_important,
          project_count: payload[i].project_count,
          last_usage: payload[i].last_usage
        })
      }
      state.techStack = cleanedObj
      state.loading = false
    },

    SET_ALL_TECHSTACK_TYPES(state: State, payload: TTechStackTypes[]) {
      const cleanedObj: TSelectObject[] = []
      for (let i = 0; i < payload.length; i++) {
        cleanedObj.push({
          value: payload[i].id,
          label: techStackType[payload[i].type]
        })
      }
      state.techStackTypes = cleanedObj
      state.loading = false
    },

    SET_ALL_PROJECT_TYPES(state: State, payload) {
      const cleanedObj = []
      for (let i = 0; i < payload.length; i++) {
        cleanedObj.push({
          value: payload[i].id,
          label: projectType[payload[i].type]
        })
      }
      state.projectTypes = cleanedObj
      state.loading = false
    },

    SET_CURRENT_TECHSTACK_ITEM(state: State, payload) {
      state.currentTechStack = {
        id: payload.id,
        name: payload.name,
        type: payload.type,
        expertise_level: payload.expertise_level,
        flag_important: payload.flag_important,
        project_count: payload.project_count,
        last_usage: payload.last_usage
      }
      state.loading = false
    },

    SET_ALL_CUSTOMERS(state: State, payload: TCustomer[]) {
      const cleanedObj: TCustomer[] = []

      for (let i = 0; i < payload.length; i++) {
        cleanedObj.push({
          id: payload[i].id,
          name: payload[i].name,
          location: payload[i].location
        })
      }

      state.customers = cleanedObj
      state.loading = false
    },

    SET_ALL_PROJECTS(state: State, payload: TProject[]) {
      const cleanedObj: TProject[] = []

      for (let i = 0; i < payload.length; i++) {
        const tech = payload[i].tech
        const cleanedTechObj = []
        for (let j = 0; j < tech.length; j++) {
          cleanedTechObj.push({
            id: tech[j].id,
            name: tech[j].name ?? '',
            type: tech[j].type ?? '',
            expertise_level: tech[j].expertise_level ?? '',
            flag_important: tech[j].flag_important ?? false,
            last_usage: tech[j].last_usage,
            project_count: tech[j].project_count
          })
        }

        cleanedObj.push({
          id: payload[i].id,
          name: payload[i].name,
          type: payload[i].type,
          show: payload[i].show,
          position: payload[i].position,
          location: payload[i].location,
          customer: payload[i].customer,
          customers: payload[i].customers,
          dates: payload[i].dates
            .map((date: TDates) => ({
              end_date: date.end_date ? date.end_date : null,
              start_date: date.start_date
            }))
            .sort((a: TDates, b: TDates) => {
              // Only sort on end_date if not identical
              if ((a.end_date ?? 0) < (b.end_date ?? 0)) return -1
              if ((a.end_date ?? 0) > (b.end_date ?? 0)) return 1
              // Both idential, return 0
              return 0
            }),
          content: payload[i].content,
          content_short: payload[i].content,
          content_long: payload[i].content,
          tech: cleanedTechObj.sort((a, b) => {
            // Only sort on type if not identical
            if (a.type < b.type) return -1
            if (a.type > b.type) return 1
            // Sort on name
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            // Both idential, return 0
            return 0
          })
        })
      }

      state.projects = cleanedObj
      state.loading = false
    },

    SET_CURRENT_CUSTOMER_ITEM(state: State, payload: TCustomer) {
      state.currentCustomer = {
        id: payload.id ?? '',
        name: payload.name ?? '',
        location: payload.location ?? ''
      }

      state.loading = false
    },

    SET_CURRENT_PROJECT_ITEM(state: State, payload: TProject) {
      const tech = payload.tech ?? []
      const cleanedTechObj = []

      for (let j = 0; j < tech.length; j++) {
        cleanedTechObj.push({
          id: tech[j].id,
          name: tech[j].name ?? '',
          type: tech[j].type ?? '',
          expertise_level: tech[j].expertise_level ?? '',
          flag_important: tech[j].flag_important ?? false,
          last_usage: tech[j].last_usage,
          project_count: tech[j].project_count
        })
      }
      const customers = payload.customers ?? []
      const cleanedCustomersObj: TCustomer[] = []

      for (let j = 0; j < customers.length; j++) {
        cleanedCustomersObj.push({
          id: customers[j].id,
          name: customers[j].name ?? '',
          location: customers[j].location ?? ''
        })
      }

      state.currentProject = {
        id: payload.id,
        name: payload.name,
        type: payload.type,
        show: payload.show ?? false,
        position: payload.position,
        location: payload.location,
        customer: payload.customer,
        content: payload.content,
        content_short: payload.content_short,
        content_long: payload.content_long,
        dates: payload.dates.map((entry: TDates) => ({
          start_date: moment(String(entry.start_date)).format('YYYY-MM-DD'),
          end_date: moment(String(entry.end_date)).format('YYYY-MM-DD')
        })),
        tech: cleanedTechObj.sort((a, b) => {
          // Only sort on type if not identical
          if (a.type < b.type) return -1
          if (a.type > b.type) return 1
          // Sort on name
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          // Both idential, return 0
          return 0
        }),
        customers: cleanedCustomersObj.sort((a, b) => {
          // Sort on name
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          // Both idential, return 0
          return 0
        })
      }

      state.loading = false
    },

    SET_LOADING(state: State, payload: boolean) {
      state.loading = payload
    }
  },
  actions: {
    async setCurrentProjectItem({ commit }, id) {
      commit('SET_LOADING', true)
      return await ProjectService.getProject(id).then(
        (response) => {
          if (response) commit('SET_CURRENT_PROJECT_ITEM', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },
    updateStateCurrentProject({ commit }, updatedProject) {
      commit('UPDATE_CURRENT_PROJECT', updatedProject)
    },
    async setCurrentCustomerItem({ commit }, id) {
      commit('SET_LOADING', true)
      return await CustomerService.getCustomer(id).then(
        (response) => {
          if (response) commit('SET_CURRENT_CUSTOMER_ITEM', response[0])
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllProjects({ commit }) {
      commit('SET_LOADING', true)
      return await ProjectService.getProjects().then(
        (response) => {
          if (response) commit('SET_ALL_PROJECTS', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllCustomers({ commit }) {
      commit('SET_LOADING', true)
      return await CustomerService.getCustomers().then(
        (response) => {
          if (response) commit('SET_ALL_CUSTOMERS', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async addCustomer({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      return await CustomerService.createCustomer(obj).then(
        (response) => {
          if (response) dispatch('getAllCustomers')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async addProject({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      return await ProjectService.createProject(obj).then(
        (response) => {
          if (response) dispatch('getAllProjects')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async updateCurrentProject({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      commit('UPDATE_CURRENT_PROJECT', obj)
      return await ProjectService.updateProject(obj).then(
        (response) => {
          if (response) dispatch('getAllProjects')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async deleteCurrentProject({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      return await ProjectService.deleteProject(obj).then(
        (response) => {
          if (response) dispatch('getAllProjects')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async setCurrentTechStackItem({ commit }, id) {
      commit('SET_LOADING', true)
      console.log(id)
      return await TechStackService.getTechStack(id).then(
        (response) => {
          console.log(response)
          if (response) commit('SET_CURRENT_TECHSTACK_ITEM', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllTechStackTypes({ commit }) {
      commit('SET_LOADING', true)
      return await TechStackService.getTechStackTypes().then(
        (response) => {
          if (response) commit('SET_ALL_TECHSTACK_TYPES', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllProjectTypes({ commit }) {
      commit('SET_LOADING', true)
      return await ProjectService.getProjectTypes().then(
        (response) => {
          if (response) commit('SET_ALL_PROJECT_TYPES', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllTechStacks({ commit }) {
      commit('SET_LOADING', true)
      return await TechStackService.getTechStacks().then(
        (response) => {
          if (response) commit('SET_ALL_TECHSTACKS', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async addTechStack({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      return await TechStackService.createTechStack(obj).then(
        (response) => {
          if (response) dispatch('getAllTechStacks')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async updateTechStack({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      return await TechStackService.updateTechStack(obj).then(
        (response) => {
          if (response) dispatch('getAllTechStacks')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async deleteTechStack({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      return await TechStackService.deleteTechStack(obj).then(
        (response) => {
          if (response) dispatch('getAllTechStacks')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async updateCurrentCustomer({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      return await CustomerService.updateCustomer(obj).then(
        (response) => {
          if (response) dispatch('getAllCustomers')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async deleteCurrentCustomer({ commit, dispatch }, obj) {
      commit('SET_LOADING', true)
      return await CustomerService.deleteCustomer(obj).then(
        (response) => {
          if (response) dispatch('getAllCustomers')
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    }
  },
  modules: {}
})
