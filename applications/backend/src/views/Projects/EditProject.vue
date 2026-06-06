<script lang="ts">
import EditProjectMask from '@/views/Projects/EditProjectMask.vue'
import { mapActions, mapState } from 'pinia'
import { useAppStore } from '@/pinia/useAppStore'
import { useProjectsStore } from '@/pinia/useProjectsStore'
import { runValidatedAction } from '@/composables/useCrudForm'
import { validateProject } from '@/utils/validation'
import type { TProject } from '@/types/project'

export default {
  components: {
    EditProjectMask
  },
  props: ['id'],
  data() {
    return {
      loadFailed: false,
      isReady: false
    }
  },
  async created() {
    if (!this.id || String(this.id).trim() === '') {
      this.loadFailed = true
      return
    }

    try {
      await this.setCurrentProjectItem(this.id as string)
      this.isReady = true
    } catch {
      this.loadFailed = true
    }
  },
  computed: {
    ...mapState(useProjectsStore, ['currentProject']),
    project() {
      return { ...this.currentProject }
    }
  },
  methods: {
    ...mapActions(useProjectsStore, [
      'setCurrentProjectItem',
      'updateCurrentProject',
      'deleteCurrentProject'
    ]),
    ...mapActions(useAppStore, ['showError']),
    async submitEvent(project: TProject) {
      await runValidatedAction(
        project,
        validateProject,
        this.showError,
        () => this.updateCurrentProject(project),
        () => this.$router.push({ name: 'ProjectList' })
      )
    },
    async deleteEvent(project: TProject) {
      try {
        await this.deleteCurrentProject(project)
        await this.$router.push({ name: 'ProjectList' })
      } catch {
        // Fehlerbanner wird von withStoreAction gesetzt
      }
    },
    cancelEvent() {
      this.$router.push({ name: 'ProjectList' })
    }
  }
}
</script>

<template>
  <div v-if="loadFailed" class="container px-4 pt-10 mx-auto">
    <p class="mb-4">Eintrag nicht gefunden oder konnte nicht geladen werden.</p>
    <router-link
      :to="{ name: 'ProjectList' }"
      class="text-blue-400 hover:text-blue-300"
    >
      Zurück zur Liste
    </router-link>
  </div>
  <edit-project-mask
    v-else-if="isReady"
    v-bind:current-project="project"
    @delete-event="deleteEvent($event)"
    @submit-event="submitEvent($event)"
    @cancel-event="cancelEvent()"
  ></edit-project-mask>
</template>

<style></style>
