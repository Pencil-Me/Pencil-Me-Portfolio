<script lang="ts">
import LoadingBar from '@/components/LoadingBar.vue'
import TextInput from '@/components/inputs/TextInput.vue'
import { mapActions, mapGetters } from 'vuex'
import SelectInput from '@/components/inputs/SelectInput.vue'
import type { PropType } from 'vue'
import type { TTechStack } from '@/views/TechStack/TechStackTypes'

export default {
  components: {
    SelectInput,
    LoadingBar,
    TextInput
  },
  created() {
    this.getAllTechStackTypes()
  },
  computed: {
    ...mapGetters(['techStackTypes', 'isLoading'])
  },
  props: {
    currentTechStack: {
      type: Object as PropType<TTechStack>,
      required: true
    },
    debug: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['submitEvent', 'deleteEvent', 'cancelEvent'],
  methods: {
    ...mapActions(['getAllTechStackTypes']),
    submitTechStack() {
      this.$emit('submitEvent', this.currentTechStack)
    },
    deleteTechStackCall() {
      this.$emit('deleteEvent', this.currentTechStack)
    },
    cancelTechStackCall() {
      this.$emit('cancelEvent')
    }
  }
}
</script>

<template>
  <div v-if="isLoading"><loading-bar /></div>
  <div v-else-if="currentTechStack" class="border-b border-gray-800 movie-info">
    {{ currentTechStack }}
    <form class="px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <text-input :label="'name'" v-model="currentTechStack.name" :required="true" />
      </div>
      <div class="mb-4">
        <text-input
          :label="'expertise_level'"
          v-model="currentTechStack.expertise_level"
          :required="true"
        />
      </div>
      <div class="mb-4">
        <select-input :label="'type'" :options="techStackTypes" v-model="currentTechStack.type" />
      </div>
    </form>
    <div class="mb-3 flex gap-5 justify-end">
      <div class="inline-block">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="submitTechStack"
        >
          Submit
        </button>
      </div>
      <div v-if="currentTechStack.id" class="inline-block">
        <button
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="deleteTechStackCall"
        >
          Delete
        </button>
      </div>
      <div class="inline-block">
        <button
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="cancelTechStackCall"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
