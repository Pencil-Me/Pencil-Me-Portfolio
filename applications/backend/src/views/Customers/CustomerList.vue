<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import CustomerCard from '@/views/Customers/CustomerCard.vue'
import ListPageShell from '@/components/ListPageShell.vue'
import { useAppStore } from '@/pinia/useAppStore'
import { useCustomersStore } from '@/pinia/useCustomersStore'

const router = useRouter()
const appStore = useAppStore()
const customersStore = useCustomersStore()
const { isLoading } = storeToRefs(appStore)
const { customerItems } = storeToRefs(customersStore)

const sortedCustomers = computed(() =>
  [...customerItems.value].sort((a, b) => a.name.localeCompare(b.name, 'de'))
)

onMounted(() => {
  customersStore.getAllCustomers()
})
</script>

<template>
  <ListPageShell :is-loading="isLoading">
    <div>
      <h2 class="pb-6 text-lg font-semibold tracking-wider uppercase text-myyellow">
        Alle Kunden
      </h2>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="router.push({ name: 'AddCustomer' })"
        >
          Kunde hinzufügen
        </button>
      </div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div class="mt-3" v-for="customer in sortedCustomers" :key="customer.id">
          <CustomerCard :customer="customer" />
        </div>
      </div>
    </div>
  </ListPageShell>
</template>
