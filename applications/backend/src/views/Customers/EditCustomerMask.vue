<script setup lang="ts">
import { ref, watch } from 'vue'
import TextInput from '@/components/inputs/TextInput.vue'
import type { TCustomer } from '@/types/customer'
import { cloneCustomer } from '@/utils/mappers/customer.mapper'

const props = defineProps<{
  currentCustomer: TCustomer
}>()

const emit = defineEmits<{
  submitEvent: [customer: TCustomer]
  deleteEvent: [customer: TCustomer]
  cancelEvent: []
}>()

const mutableCustomer = ref<TCustomer>(cloneCustomer(props.currentCustomer))

watch(
  () => props.currentCustomer,
  (newCustomer) => {
    mutableCustomer.value = cloneCustomer(newCustomer)
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="border-b border-gray-800">
    <form class="container mx-auto px-4 mt-12 mb-12">
      <div class="mb-4">
        <text-input label="Name" v-model="mutableCustomer.name" :required="true" />
      </div>
      <div class="mb-4">
        <text-input label="Standort" name="location" v-model="mutableCustomer.location" :required="true" />
      </div>
    </form>
    <div class="mb-3 flex gap-5 justify-end">
      <div class="inline-block">
        <button
          type="button"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="emit('submitEvent', mutableCustomer)"
        >
          Speichern
        </button>
      </div>
      <div v-if="mutableCustomer.id" class="inline-block">
        <button
          type="button"
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="emit('deleteEvent', mutableCustomer)"
        >
          Löschen
        </button>
      </div>
      <div class="inline-block">
        <button
          type="button"
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="emit('cancelEvent')"
        >
          Abbrechen
        </button>
      </div>
    </div>
  </div>
</template>
