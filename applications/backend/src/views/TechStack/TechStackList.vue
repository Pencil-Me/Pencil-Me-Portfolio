<template>
  <ListPageShell :is-loading="isLoading">
    <div>
      <h2 class="pb-6 text-lg font-semibold tracking-wider uppercase text-myyellow">
        Tech-Stack
      </h2>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="$router.push({ name: 'AddTechStack' })"
        >
          Eintrag hinzufügen
        </button>
      </div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div class="mt-3" v-for="techStack in techstacks" :key="techStack.id">
          <TechStackCard :tech-stack="techStack" />
        </div>
      </div>
    </div>
  </ListPageShell>
</template>

<script>
import TechStackCard from '@/views/TechStack/TechStackCard.vue'
import ListPageShell from '@/components/ListPageShell.vue'
import { mapActions, mapState } from 'pinia'
import { formatDate } from '@/utils/date'
import { useAppStore } from '@/pinia/useAppStore'
import { useTechStackStore } from '@/pinia/useTechStackStore'

export default {
  components: {
    TechStackCard,
    ListPageShell
  },
  computed: {
    ...mapState(useAppStore, ['isLoading']),
    ...mapState(useTechStackStore, ['techStackItems', 'techStackTypes']),
    techstacks() {
      return [...this.techStackItems]
        .sort((a, b) => a.name.localeCompare(b.name, 'de'))
        .map((item) => {
          const type_name =
            this.techStackTypes.find((type) => type.value === item.type)?.label ?? item.type
          return {
            ...item,
            type: type_name,
            last_usage: item.last_usage ? formatDate(item.last_usage) : 'heute'
          }
        })
    }
  },
  created() {
    this.getAllTechStacks()
    this.getAllTechStackTypes()
  },
  methods: {
    ...mapActions(useTechStackStore, ['getAllTechStacks', 'getAllTechStackTypes'])
  }
}
</script>
