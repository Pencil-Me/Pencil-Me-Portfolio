<script lang="ts">
import { mapActions } from 'vuex'
import EditProjectMask from '@/views/Projects/EditProjectMask.vue'
import { convertIProjectToTProject, type TProject } from '@/views/Projects/ProjectTypes'

export default {
  components: {
    EditProjectMask
  },
  computed: {},
  data() {
    return {
      project: convertIProjectToTProject({}),
      showAddStack: false,
      showingModal: false,
      techToAdd: '',
      techstack_id: ''
    }
  },
  created() {},
  methods: {
    ...mapActions([]),
    submit(project: TProject) {
      if (project.name != '' || !project.type) {
        this.$store.dispatch('addProject', project)

        this.cancelProject()
      } else alert('Please fill up all the input box')
    },
    cancelProject() {
      this.project.name = ''
      this.project.position = ''
      this.project.customer = ''
      this.project.location = ''
      this.project.content = ''
      this.project.type = ''
      this.project.dates = []
      this.project.tech = []
      this.project.customers = []

      this.$router.push({ name: 'ProjectList' })
    }
  }
}
</script>

<template>
  <edit-project-mask
    :current-project="project"
    :debug="true"
    @cancel-event="cancelProject()"
    @submit-event="submit($event)"
  ></edit-project-mask>
</template>

<style></style>
