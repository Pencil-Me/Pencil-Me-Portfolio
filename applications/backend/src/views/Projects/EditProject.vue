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
import { type TProject } from '@/views/Projects/ProjectTypes'

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
      return { ...this.currentProject }
    }
  },
  props: ['id'],
  methods: {
    ...mapActions(['setCurrentProjectItem', 'updateCurrentProject', 'deleteCurrentProject']),

    submitEvent(project: TProject) {
      this.updateCurrentProject(project)
      this.$router.push({ name: 'ProjectList' })
    },
    deleteEvent(project: TProject) {
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
    :debug="true"
    @delete-event="deleteEvent($event)"
    @submit-event="submitEvent($event)"
    @cancel-event="cancelEvent()"
  ></edit-project-mask>
</template>

<style></style>
