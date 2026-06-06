<script setup lang="ts">
import { toRef } from 'vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'

const props = withDefaults(
  defineProps<{
    showing: boolean
    title?: string
  }>(),
  {
    title: 'Dialog'
  }
)

defineEmits<{
  close: []
}>()

useBodyScrollLock(toRef(props, 'showing'))
</script>

<template>
  <div class="container mx-auto">
    <div class="flex justify-center">
      <div
        v-show="showing"
        class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
      >
        <div class="z-50 w-full max-w-4xl p-6 mx-4 bg-black rounded-md shadow-xl">
          <div class="flex items-center justify-between">
            <h3 class="text-2xl">{{ title }}</h3>
            <button
              type="button"
              class="text-red-900 cursor-pointer border-0 bg-transparent p-0"
              aria-label="Schließen"
              @click="$emit('close')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
          <div class="mt-4">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
