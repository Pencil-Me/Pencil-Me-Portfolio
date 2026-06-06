<template>
  <div class="relative container px-4 pt-10 mx-auto">
    <div v-if="isLoading" class="list-page-shell__overlay">
      <LoadingBar />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import LoadingBar from '@/components/LoadingBar.vue'

defineProps<{
  isLoading: boolean
}>()
</script>

<style scoped>
.list-page-shell__overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 40, 49, 0.45);
  border-radius: 0.25rem;
}
</style>
