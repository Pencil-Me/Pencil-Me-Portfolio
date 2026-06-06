<script lang="ts">
import { mapActions, mapState } from 'pinia'
import type { TTechStack } from '@/types/techstack'
import EditTechStackMask from '@/views/TechStack/EditTechStackMask.vue'
import { useAppStore } from '@/pinia/useAppStore'
import { useTechStackStore } from '@/pinia/useTechStackStore'
import { runValidatedAction } from '@/composables/useCrudForm'
import { validateTechStack } from '@/utils/validation'

export default {
  components: { EditTechStackMask },
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
      await this.setCurrentTechStackItem(this.id as string)
      this.isReady = true
    } catch {
      this.loadFailed = true
    }
  },
  computed: {
    ...mapState(useTechStackStore, ['currentTechStack']),
    techStack(): TTechStack {
      return {
        id: this.currentTechStack.id,
        name: this.currentTechStack.name,
        type: this.currentTechStack.type,
        expertise_level: this.currentTechStack.expertise_level,
        flag_important: this.currentTechStack.flag_important
      }
    }
  },
  methods: {
    ...mapActions(useTechStackStore, [
      'setCurrentTechStackItem',
      'updateTechStack',
      'deleteTechStack'
    ]),
    ...mapActions(useAppStore, ['showError']),
    async submitEvent(techStack: TTechStack) {
      await runValidatedAction(
        techStack,
        validateTechStack,
        this.showError,
        () => this.updateTechStack(techStack),
        () => this.$router.push({ name: 'TechStackList' })
      )
    },
    async deleteEvent(techStack: TTechStack) {
      try {
        await this.deleteTechStack(techStack)
        await this.$router.push({ name: 'TechStackList' })
      } catch {
        // Fehlerbanner wird von withStoreAction gesetzt
      }
    },
    cancelEvent() {
      this.$router.push({ name: 'TechStackList' })
    }
  }
}
</script>

<template>
  <div v-if="loadFailed" class="container px-4 pt-10 mx-auto">
    <p class="mb-4">Eintrag nicht gefunden oder konnte nicht geladen werden.</p>
    <router-link
      :to="{ name: 'TechStackList' }"
      class="text-blue-400 hover:text-blue-300"
    >
      Zurück zur Liste
    </router-link>
  </div>
  <edit-tech-stack-mask
    v-else-if="isReady"
    :current-tech-stack="techStack"
    @delete-event="deleteEvent($event)"
    @submit-event="submitEvent($event)"
    @cancel-event="cancelEvent()"
  ></edit-tech-stack-mask>
</template>

<style></style>
