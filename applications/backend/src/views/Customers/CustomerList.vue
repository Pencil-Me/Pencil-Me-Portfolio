<template>
  <div v-if="isLoading"><loading-bar /></div>
  <div v-else class="container px-4 pt-10 mx-auto">
    <div>
      <h2 class="pb-6 text-lg font-semibold tracking-wider uppercase text-myyellow">
        Alle Customer
      </h2>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="$router.push({ name: 'AddCustomer' })"
        >
          Add Customer
        </button>
      </div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div class="mt-3" v-for="customer in sortedCustomers" :key="customer.id">
          <CustomerCard :customer="customer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerCard from '@/views/Customers/CustomerCard.vue'
import { mapActions, mapGetters } from 'vuex'
import LoadingBar from '@/components/LoadingBar.vue'
import SelectInput from '@/components/inputs/SelectInput.vue'
import formatDate from '@/composables/formatDate'

export default {
  components: {
    SelectInput,
    LoadingBar,
    CustomerCard
  },
  computed: {
    ...mapGetters(['customerItems', 'isLoading']),
    sortedCustomers() {
      return (
        this.customerItems
          .map((s) => ({
            id: s.id,
            name: s.name,
            location: s.location
          }))
          .sort((a, b) => {
            // Only sort on type if not identical
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            // Both idential, return 0
            return 0
          }) ?? []
      )
    }
  },
  created() {
    this.getAllCustomers()
  },
  methods: {
    ...mapActions(['getAllCustomers', 'getAllTechStacks'])
  }
}
</script>
