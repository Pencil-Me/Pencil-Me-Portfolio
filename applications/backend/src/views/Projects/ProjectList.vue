<template>
  <ListPageShell :is-loading="isLoading">
    <div>
      <h2 class="pb-6 text-lg font-semibold tracking-wider uppercase text-myyellow">
        Alle Projekte
      </h2>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="$router.push({ name: 'AddProject' })"
        >
          Projekt hinzufügen
        </button>
      </div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div class="mt-3" v-for="project in projectListItems" :key="project.id">
          <ProjectCard :project="project" />
        </div>
      </div>
    </div>
  </ListPageShell>
</template>

<script>
import ProjectCard from '@/views/Projects/ProjectCard.vue'
import ListPageShell from '@/components/ListPageShell.vue'
import { mapActions, mapState } from 'pinia'
import { useAppStore } from '@/pinia/useAppStore'
import { useProjectsStore } from '@/pinia/useProjectsStore'
import { useTechStackStore } from '@/pinia/useTechStackStore'

export default {
  components: {
    ListPageShell,
    ProjectCard
  },
  computed: {
    ...mapState(useAppStore, ['isLoading']),
    ...mapState(useProjectsStore, ['projectListItems'])
  },
  created() {
    this.getAllProjects()
    this.getAllTechStacks()
  },
  methods: {
    ...mapActions(useProjectsStore, ['getAllProjects']),
    ...mapActions(useTechStackStore, ['getAllTechStacks'])
  }
}
</script>
