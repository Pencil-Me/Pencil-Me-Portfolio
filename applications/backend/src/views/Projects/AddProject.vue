<script lang="ts">
import { mapActions, mapGetters } from 'vuex'
import EditProjectMask from '@/views/Projects/EditProjectMask.vue'
import {type Customer, type Dates, type ProjectType, type Tech} from '@/views/Projects/ProjectTypes'

export default {
  components: {
    EditProjectMask
  },
  computed: {},
  data() {
    return {
      project: {
        name: '',
        position: '',
        customer: '',
        location: '',
        content: '',
        type: '',
        dates: [] as Dates[],
        tech: [] as Tech[],
        customers: [] as Customer[]
      } as ProjectType,
      showAddStack: false,
      techstack_id: '',
      techToAdd: '',
      showingModal: false
    }
  },
  created() {},
  methods: {
    ...mapActions([]),
    submit(project) {
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
    @cancel-event="cancelProject()"
    @submit-event="submit($event)"
  ></edit-project-mask>
</template>

<style></style>
