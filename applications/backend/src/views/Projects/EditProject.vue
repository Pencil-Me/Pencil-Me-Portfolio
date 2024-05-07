<script lang="ts">
import LoadingBar from '@/components/LoadingBar.vue'
import TextInput from '@/components/inputs/TextInput.vue'
import DateInput from '@/components/inputs/DateInput.vue'
import TextareaInput from '@/components/inputs/Textarea.vue'
import SelectInput from '@/components/inputs/SelectInput.vue'
import { mapActions, mapGetters } from 'vuex'
import CardModal from '@/views/CardModal.vue'
import AddTechStack from '@/views/TechStack/AddTechStack.vue'
import AutocompleteInput from '@/components/inputs/AutocompleteInput.vue'
import EditProjectMask from '@/views/Projects/EditProjectMask.vue'
import type {Customer, Dates, ProjectType, Tech} from '@/views/Projects/ProjectTypes'

export default {
  components: {
    EditProjectMask,
    AutocompleteInput,
    AddTechStack,
    CardModal,
    LoadingBar,
    TextInput,
    DateInput,
    TextareaInput,
    SelectInput
  },
  data() {
    return {
      showAddStack: false,
      techstack_id: '',
      techToAdd: '',
      showingModal: false
    }
  },
  created() {
    this.setCurrentProjectItem(this.id)
  },
  computed: {
    ...mapGetters(['currentProject', 'isLoading']),

    project() {
      return {
        id: this.currentProject.id,
        name: this.currentProject.name,
        position: this.currentProject.position,
        customer: this.currentProject.customer,
        location: this.currentProject.location,
        content: this.currentProject.content,
        type: this.currentProject.type,
        dates: this.currentProject.dates as Dates[],
        tech: this.currentProject.tech as Tech[],
        customers: this.currentProject.customers as Customer[]
      } as ProjectType
    }
  },
  props: ['id'],
  methods: {
    ...mapActions(['setCurrentProjectItem', 'updateCurrentProject', 'deleteCurrentProject']),

    submitEvent(project) {
      this.updateCurrentProject(project)
      this.$router.push({ name: 'ProjectList' })
    },
    deleteEvent(project) {
      this.deleteCurrentProject(project)
      this.$router.push({ name: 'ProjectList' })
    },
    cancelEvent() {
      this.$router.push({ name: 'ProjectList' })
    }
  }
}
</script>

<template>
  <edit-project-mask
    v-bind:current-project="project"
    @delete-event="deleteEvent($event)"
    @submit-event="submitEvent($event)"
    @cancel-event="cancelEvent()"
  ></edit-project-mask>
</template>

<style></style>
