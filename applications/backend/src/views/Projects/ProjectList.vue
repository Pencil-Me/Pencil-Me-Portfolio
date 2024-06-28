<template>
  <div v-if="isLoading"><loading-bar /></div>
  <div v-else class="container px-4 pt-10 mx-auto">
    <div>
      <h2 class="pb-6 text-lg font-semibold tracking-wider uppercase text-myyellow">
        Alle Projekte
      </h2>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="$router.push({ name: 'AddProject' })"
        >
          Add Project
        </button>
      </div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div class="mt-3" v-for="project in sortedProjects" :key="project.id">
          <ProjectCard :project="project" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectCard from '@/views/Projects/ProjectCard.vue'
import { mapActions, mapGetters } from 'vuex'
import LoadingBar from '@/components/LoadingBar.vue'
import SelectInput from '@/components/inputs/SelectInput.vue'
import formatDate from '@/composables/formatDate'

export default {
  components: {
    SelectInput,
    LoadingBar,
    ProjectCard
  },
  computed: {
    ...mapGetters(['projectItems', 'isLoading']),
    sortedProjects() {
      return (
        this.projectItems
          .map((s) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            show: s.show,
            position: s.position.replace(/\//g, ' / '),
            customers: s.customers,
            location: s.location,
            dates:
              s.dates
                .sort((a, b) => {
                  // Only sort on end_date if not identical
                  if (a.end_date < b.end_date) return -1
                  if (a.end_date > b.end_date) return 1
                  // Both idential, return 0
                  return 0
                })
                .map((date) => ({
                  start_date: formatDate(date.start_date),
                  end_date: date.end_date ? formatDate(date.end_date) : 'heute'
                })) ?? [],
            last_date: (s.dates.sort((a, b) => {
              // Only sort on end_date if not identical
              if (a.end_date < b.end_date) return -1
              if (a.end_date > b.end_date) return 1
              // Both idential, return 0
              return 0
            }) ??
              [].map((date) => ({
                start_date: date.start_date,
                end_date: date.end_date ?? new Date()
              })))[0]?.end_date,
            tech:
              s.tech.sort((a, b) => {
                // Only sort on type if not identical
                if (a.type < b.type) return -1
                if (a.type > b.type) return 1
                // Sort on name
                if (a.name < b.name) return -1
                if (a.name > b.name) return 1
                // Both idential, return 0
                return 0
              }) ?? []
          }))
          .sort((a, b) => {
            // Only sort on type if not identical
            if (a.type < b.type) return -1
            if (a.type > b.type) return 1
            // Sort on name
            if (new Date(a.last_date) > new Date(b.last_date)) return -1
            if (new Date(a.last_date) < new Date(b.last_date)) return 1
            // Both idential, return 0
            return 0
          }) ?? []
      )
    }
  },
  created() {
    this.getAllProjects()
    this.getAllTechStacks()
  },
  methods: {
    ...mapActions(['getAllProjects', 'getAllTechStacks'])
  }
}
</script>
