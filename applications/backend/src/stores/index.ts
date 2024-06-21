import ProjectService from '@/services/projects.service'
import TechStackService from '@/services/techstack.service'
import CustomerService from '@/services/customer.service'
import { createStore } from 'vuex'
import moment from 'moment/moment'

function updateLocalStorage(state) {
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

const initialState = {
  projects: [],
  currentCustomer: {
    id: '',
    name: '',
    location: ''
  },
  currentProject: {
    id: '',
    name: '',
    position: '',
    location: '',
    content: '',
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
    techStackItems: (state) => {
      return state.techStack
    },
    techStackTypes: (state) => {
      return state.techStackTypes
    },
    projectTypes: (state) => {
      return state.projectTypes
    },
    currentTechStack: (state) => {
      return state.currentTechStack
    },
    projectItems: (state) => {
      return state.projects
    },
    customerItems: (state) => {
      return state.customers
    },
    currentProject: (state) => {
      return state.currentProject
    },
    currentCustomer: (state) => {
      return state.currentCustomer
    },
    isLoading: (state) => {
      return state.loading
    }
  },
  mutations: {
    updateProjectsFromLocalStorage(state) {
      const projects = localStorage.getItem('projects')
      if (projects) {
        state.projects = JSON.parse(projects)
      }
    },

    setAllTechStacks(state, payload) {
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

    setAllTechStackTypes(state, payload) {
      const cleanedObj = []
      for (let i = 0; i < payload.length; i++) {
        cleanedObj.push({
          value: payload[i].id,
          label: techStackType[payload[i].type]
        })
      }
      state.techStackTypes = cleanedObj
      state.loading = false
    },

    setAllProjectTypes(state, payload) {
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

    setCurrentTechStackItem(state, payload) {
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

    setAllCustomers(state, payload) {
      const cleanedObj = []

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

    setAllProjects(state, payload) {
      const cleanedObj = []

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
          position: payload[i].position,
          location: payload[i].location,
          customers: payload[i].customers,
          dates: payload[i].dates
            .map((date) => ({
              end_date: date.end_date ? date.end_date : null,
              start_date: date.start_date
            }))
            .sort((a, b) => {
              // Only sort on end_date if not identical
              if (a.end_date < b.end_date) return -1
              if (a.end_date > b.end_date) return 1
              // Both idential, return 0
              return 0
            }),
          content: payload[i].content,
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

    setCurrentCustomerItem(state, payload) {
      state.currentCustomer = {
        id: payload.id ?? '',
        name: payload.name ?? '',
        location: payload.location ?? ''
      }

      state.loading = false
    },

    setCurrentProjectItem(state, payload) {
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
      const cleanedCustomersObj = []

      for (let j = 0; j < customers.length; j++) {
        cleanedCustomersObj.push({
          id: customers[j].id,
          name: customers[j].name ?? ''
        })
      }

      state.currentProject = {
        id: payload.id,
        name: payload.name,
        type: payload.type,
        position: payload.position,
        location: payload.location,
        content: payload.content,
        dates: payload.dates.map((entry) => ({
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

    setLoading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    async setCurrentProjectItem({ commit }, id) {
      commit('setLoading', true)
      return await ProjectService.getProject(id).then(
        (response) => {
          if (response) commit('setCurrentProjectItem', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },
    async setCurrentCustomerItem({ commit }, id) {
      commit('setLoading', true)
      return await CustomerService.getCustomer(id).then(
        (response) => {
          if (response) commit('setCurrentCustomerItem', response[0])
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllProjects({ commit }) {
      commit('setLoading', true)
      return await ProjectService.getProjects().then(
        (response) => {
          if (response) commit('setAllProjects', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllCustomers({ commit }) {
      commit('setLoading', true)
      return await CustomerService.getCustomers().then(
        (response) => {
          if (response) commit('setAllCustomers', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async addCustomer({ commit, dispatch }, obj) {
      commit('setLoading', true)
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
      commit('setLoading', true)
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
      commit('setLoading', true)
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
      commit('setLoading', true)
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
      commit('setLoading', true)
      return await TechStackService.getTechStack(id).then(
        (response) => {
          if (response) commit('setCurrentTechStackItem', response[0])
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllTechStackTypes({ commit }) {
      commit('setLoading', true)
      return await TechStackService.getTechStackTypes().then(
        (response) => {
          if (response) commit('setAllTechStackTypes', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllProjectTypes({ commit }) {
      commit('setLoading', true)
      return await ProjectService.getProjectTypes().then(
        (response) => {
          if (response) commit('setAllProjectTypes', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async getAllTechStacks({ commit }) {
      commit('setLoading', true)
      return await TechStackService.getTechStacks().then(
        (response) => {
          if (response) commit('setAllTechStacks', response)
        },
        (error) => {
          // @todo handle this error
          console.error(error)
        }
      )
    },

    async addTechStack({ commit, dispatch }, obj) {
      commit('setLoading', true)
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
      commit('setLoading', true)
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
      commit('setLoading', true)
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
      commit('setLoading', true)
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
      commit('setLoading', true)
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
