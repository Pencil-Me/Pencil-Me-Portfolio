<script lang="ts">
import TextInput from '@/components/inputs/TextInput.vue'
import { mapActions, mapState } from 'pinia'
import SelectInput from '@/components/inputs/SelectInput.vue'
import type { PropType } from 'vue'
import type { TTechStack } from '@/types/techstack'
import { useAppStore } from '@/pinia/useAppStore'
import { useTechStackStore } from '@/pinia/useTechStackStore'
import { cloneTechStack } from '@/utils/mappers/techstack.mapper'

export default {
  components: {
    SelectInput,
    TextInput
  },
  created() {
    this.getAllTechStackTypes()
  },
  computed: {
    ...mapState(useAppStore, ['isLoading']),
    ...mapState(useTechStackStore, ['techStackTypes'])
  },
  data() {
    return {
      mutableTechStack: {} as TTechStack
    }
  },
  props: {
    currentTechStack: {
      type: Object as PropType<TTechStack>,
      required: true
    }
  },
  watch: {
    currentTechStack: {
      immediate: true,
      handler(newTechStack: TTechStack) {
        this.mutableTechStack = cloneTechStack(newTechStack)
      }
    }
  },
  emits: ['submitEvent', 'deleteEvent', 'cancelEvent'],
  methods: {
    ...mapActions(useTechStackStore, ['getAllTechStackTypes']),
    submitTechStack() {
      this.$emit('submitEvent', this.mutableTechStack)
    },
    deleteTechStackCall() {
      this.$emit('deleteEvent', this.mutableTechStack)
    },
    cancelTechStackCall() {
      this.$emit('cancelEvent')
    }
  }
}
</script>

<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <span>Lädt…</span>
  </div>
  <div v-else class="border-b border-gray-800">
    <form class="px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <text-input label="Name" v-model="mutableTechStack.name" :required="true" />
      </div>
      <div class="mb-4">
        <text-input
          label="Erfahrungslevel"
          name="expertise_level"
          v-model="mutableTechStack.expertise_level"
          :required="true"
        />
      </div>
      <div class="mb-4">
        <select-input label="Typ" :options="techStackTypes" v-model="mutableTechStack.type" />
      </div>
    </form>
    <div class="mb-3 flex gap-5 justify-end">
      <div class="inline-block">
        <button
          type="button"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="submitTechStack"
        >
          Speichern
        </button>
      </div>
      <div v-if="mutableTechStack.id" class="inline-block">
        <button
          type="button"
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="deleteTechStackCall"
        >
          Löschen
        </button>
      </div>
      <div class="inline-block">
        <button
          type="button"
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="cancelTechStackCall"
        >
          Abbrechen
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
