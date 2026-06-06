<script lang="ts">
import { mapActions } from 'pinia'
import EditTechStackMask from '@/views/TechStack/EditTechStackMask.vue'
import { useAppStore } from '@/pinia/useAppStore'
import { useTechStackStore } from '@/pinia/useTechStackStore'
import { runValidatedAction } from '@/composables/useCrudForm'
import { validateTechStack } from '@/utils/validation'
import type { TTechStack } from '@/types/techstack'
import type { PropType } from 'vue'

export default {
  components: { EditTechStackMask },
  props: {
    givenName: {
      type: String as PropType<string>,
      default: ''
    }
  },
  data() {
    return {
      techStack: {
        name: '',
        type: '',
        expertise_level: '',
        flag_important: false
      } as TTechStack
    }
  },
  created() {
    if (this.givenName) {
      this.techStack.name = this.givenName
    }
  },
  methods: {
    ...mapActions(useTechStackStore, ['addTechStack']),
    ...mapActions(useAppStore, ['showError']),
    async submitTechStack(techStack: TTechStack) {
      await runValidatedAction(
        techStack,
        validateTechStack,
        this.showError,
        () => this.addTechStack(techStack),
        () => {
          if (!this.givenName) {
            this.cancelTechStack()
          }
        }
      )
    },
    cancelTechStack() {
      this.techStack = {
        name: '',
        type: '',
        expertise_level: '',
        flag_important: false
      } as TTechStack
      if (!this.givenName) {
        this.$router.push({ name: 'TechStackList' })
      }
    }
  }
}
</script>

<template>
  <edit-tech-stack-mask
    :current-tech-stack="techStack"
    @cancel-event="cancelTechStack()"
    @submit-event="submitTechStack($event)"
  ></edit-tech-stack-mask>
</template>

<style></style>
