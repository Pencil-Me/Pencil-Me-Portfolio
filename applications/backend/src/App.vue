<script>
import AppFooter from '@/partials/AppFooter.vue'
import AppNavbar from '@/partials/AppNavbar.vue'
import { mapActions, mapState } from 'pinia'
import { useAppStore } from '@/pinia/useAppStore'

export default {
  components: {
    AppNavbar,
    AppFooter
  },
  computed: {
    ...mapState(useAppStore, ['errorMessage', 'hasError'])
  },
  methods: {
    ...mapActions(useAppStore, ['clearError'])
  },
  created() {
    window.dispatchEvent(new Event('resize'))
  }
}
</script>

<template>
  <div class="relative w-full">
    <div
      v-if="hasError"
      class="error-banner"
      role="alert"
    >
      <span>{{ errorMessage }}</span>
      <button
        type="button"
        class="error-banner__dismiss"
        aria-label="Fehler schließen"
        @click="clearError"
      >
        ×
      </button>
    </div>
    <AppNavbar />
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
    <AppFooter />
  </div>
</template>

<style scoped>
:root {
  --font-primary: Avenir, Helvetica, Arial, sans-serif;
  --color-gray: #dadce0;
}

*,
::after,
::before {
  box-sizing: border-box;
}

body {
  font-size: 1rem;
  -webkit-text-size-adjust: 100%;
  font-family: var(--font-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #fdecea;
  border-bottom: 1px solid #f5c6cb;
  color: #721c24;
}

.error-banner__dismiss {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
}
</style>
