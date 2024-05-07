<script>
import { onBeforeMount, ref, watch } from 'vue'

export default {
  setup() {
    const search = ref('')
    const searchbar = ref(null)
    const isOpen = ref(false)
    const checked = ref()

    watch(checked, () => {
      if ('theme' in localStorage) {
        localStorage.theme = checked.value ? 'dark' : 'light'
      }
    })

    function hideDropdown() {
      isOpen.value = false
    }

    function showDropdown() {
      isOpen.value = true
    }

    watch(search, () => {
      isOpen.value = true
    })

    onBeforeMount(() => {
      checked.value = localStorage.theme === 'dark'
      window.addEventListener('keydown', (e) => {
        if (e.key === ' ' && e.ctrlKey) {
          searchbar.value.focus()
        }
      })
    })

    const updatePage = () => {
      location.reload()
    }

    return {
      search,
      searchbar,
      isOpen,
      checked,
      updatePage
    }
  }
}
</script>

<template>
  <nav class="border-b border-gray-800">
    <div class="container flex flex-col items-center justify-between px-4 py-6 mx-auto md:flex-row">
      <ul class="flex flex-col items-center md:flex-row">
        <li>
          <router-link to="/" class="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span>Home</span>
          </router-link>
        </li>
        <li class="mt-3 md:ml-16 md:mt-0">
          <router-link :to="{ name: 'ProjectList' }">Projects</router-link>
          <router-link :to="{ name: 'TechStackList' }">Tech Stack</router-link>
          <router-link :to="{ name: 'CustomerList' }">Customers</router-link>
        </li>
      </ul>
    </div>
    <hr class="border-1 border-myyellow" />
  </nav>
</template>
