<script lang="ts">
import { mapActions } from 'pinia'
import EditProjectMask from '@/views/Projects/EditProjectMask.vue'
import { useAppStore } from '@/pinia/useAppStore'
import { useProjectsStore } from '@/pinia/useProjectsStore'
import { runValidatedAction } from '@/composables/useCrudForm'
import { validateProject } from '@/utils/validation'
import { convertIProjectToTProject, type TProject } from '@/types/project'

export default {
  components: {
    EditProjectMask
  },
  data() {
    return {
      project: convertIProjectToTProject({})
    }
  },
  methods: {
    ...mapActions(useProjectsStore, ['addProject']),
    ...mapActions(useAppStore, ['showError']),
    async submit(project: TProject) {
      await runValidatedAction(
        project,
        validateProject,
        this.showError,
        () => this.addProject(project),
        () => this.cancelProject()
      )
    },
    cancelProject() {
      this.project = convertIProjectToTProject({})
      this.$router.push({ name: 'ProjectList' })
    }
  }
}
</script>

<template>
  <edit-project-mask
    :current-project="project"
    @cancel-event="cancelProject()"
    @submit-event="submit($event)"
  ></edit-project-mask>
</template>

<style></style>
