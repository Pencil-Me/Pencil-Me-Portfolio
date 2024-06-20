<script lang="ts">
import { mapActions, mapGetters } from 'vuex'
import type { TTechStack } from '@/views/TechStack/TechStackTypes'
import EditTechStackMask from '@/views/TechStack/EditTechStackMask.vue'

export default {
  components: { EditTechStackMask },
  created() {
    this.setCurrentTechStackItem(this.id)
  },
  computed: {
    ...mapGetters(['currentTechStack', 'isLoading']),

    techStack() {
      return {
        id: this.currentTechStack.id,
        name: this.currentTechStack.name,
        type: this.currentTechStack.type,
        expertise_level: this.currentTechStack.expertise_level,
        flag_important: this.currentTechStack.flag_important
      }
    }
  },
  props: ['id'],
  methods: {
    ...mapActions(['setCurrentTechStackItem', 'updateTechStack', 'deleteTechStack']),

    submitEvent(techStack: TTechStack) {
      this.updateTechStack(techStack)
      this.$router.push({ name: 'TechStackList' })
    },
    deleteEvent(techStack: TTechStack) {
      this.deleteTechStack(techStack)
      this.$router.push({ name: 'TechStackList' })
    },
    cancelEvent() {
      this.$router.push({ name: 'TechStackList' })
    }
  }
}
</script>

<template>
  <edit-tech-stack-mask
    :current-tech-stack="techStack"
    @delete-event="deleteEvent($event)"
    @submit-event="submitEvent($event)"
    @cancel-event="cancelEvent()"
  ></edit-tech-stack-mask>
</template>

<style></style>
