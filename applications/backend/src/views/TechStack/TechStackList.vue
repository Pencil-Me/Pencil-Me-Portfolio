<template>
  <div v-if="isLoading"><loading-bar /></div>
  <div v-else class="container px-4 pt-10 mx-auto">
    <div>
      <h2 class="pb-6 text-lg font-semibold tracking-wider uppercase text-myyellow">
        Alle TechStack
      </h2>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="$router.push({ name: 'AddTechStack' })"
        >
          Add TechStack
        </button>
      </div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div class="mt-3" v-for="techStack in techstacks" :key="techStack.id">
          <TechStackCard :techStack="techStack" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TechStackCard from '@/views/TechStack/TechStackCard.vue'
import LoadingBar from '@/components/LoadingBar.vue'
import { mapActions, mapGetters } from 'vuex'
import formatDate from '@/composables/formatDate.js'

export default {
  components: {
    TechStackCard,
    LoadingBar
  },
  computed: {
    ...mapGetters(['techStackItems', 'techStackTypes', 'isLoading']),
    techstacks() {
      return (
        this.techStackItems
          .sort((a, b) => {
            // Only sort on type if not identical
            // if (a.type < b.type) return -1
            // if (a.type > b.type) return 1
            // Sort on name
            if (a.name.toUpperCase() < b.name.toUpperCase()) return -1
            if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
            // Both idential, return 0
            return 0
          })
          .map((item) => {
            const type_name =
              this.techStackTypes.filter((type) => {
                return type.value === item.type
              })[0]?.label ?? 'error'
            return {
              id: item.id,
              name: item.name,
              type: type_name,
              expertise_level: item.expertise_level,
              last_usage: item.last_usage ? formatDate(item.last_usage) : 'heute',
              project_count: item.project_count
            }
          }) ?? []
      )
    }
  },
  created() {
    this.getAllTechStacks()
    this.getAllTechStackTypes()
  },
  methods: {
    ...mapActions(['getAllTechStacks', 'getAllTechStackTypes'])
  }
}
</script>
