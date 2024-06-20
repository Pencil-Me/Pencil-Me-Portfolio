<script lang="ts">
import LoadingBar from '@/components/LoadingBar.vue'
import { mapActions, mapGetters } from 'vuex'
import EditCustomerMask from '@/views/Customers/EditCustomerMask.vue'
import type { TCustomer } from '@/views/Customers/CustomerTypes'

export default {
  components: {
    EditCustomerMask,
    LoadingBar
  },
  data() {},
  created() {
    this.setCurrentCustomerItem(this.id)
  },
  computed: {
    ...mapGetters(['currentCustomer', 'isLoading']),

    customer() {
      return {
        id: this.currentCustomer.id,
        name: this.currentCustomer.name,
        location: this.currentCustomer.location
      } as TCustomer
    }
  },
  props: ['id'],
  methods: {
    ...mapActions(['setCurrentCustomerItem', 'updateCurrentCustomer', 'deleteCurrentCustomer']),

    submitEvent(customer) {
      this.updateCurrentCustomer(customer)
      this.$router.push({ name: 'CustomerList' })
    },
    deleteEvent(customer) {
      this.deleteCurrentCustomer(customer)
      this.$router.push({ name: 'CustomerList' })
    },
    cancelEvent() {
      this.$router.push({ name: 'CustomerList' })
    }
  }
}
</script>

<template>
  <edit-customer-mask
    v-bind:current-customer="customer"
    @submit-event="submitEvent($event)"
    @delete-event="deleteEvent($event)"
    @cancel-event="cancelEvent()"
  ></edit-customer-mask>
</template>

<style></style>
