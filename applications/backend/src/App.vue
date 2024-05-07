<script>
import AppFooter from '@/partials/AppFooter.vue'
import AppNavbar from '@/partials/AppNavbar.vue'

export default {
  components: {
    AppNavbar,
    AppFooter
  },
  created() {
    window.dispatchEvent(new Event('resize'))
  }
}
</script>

<template>
  <div class="relative w-full">
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
</style>
