<script lang="ts">
import { mapActions } from 'vuex'
import EditCustomerMask from '@/views/Customers/EditCustomerMask.vue'
import type { TCustomer } from '@/views/Customers/CustomerTypes'

export default {
  components: {
    EditCustomerMask
  },
  computed: {},
  data() {
    return {
      customer: {
        name: '',
        location: ''
      } as TCustomer
    }
  },
  created() {},
  methods: {
    ...mapActions([]),
    submit(customer) {
      if (customer.name != '') {
        this.$store.dispatch('addCustomer', customer)

        this.cancelCustomer()
      } else alert('Please fill up all the input box')
    },
    cancelCustomer() {
      this.customer.name = ''

      this.$router.push({ name: 'CustomerList' })
    }
  }
}
</script>

<template>
  <edit-customer-mask
    :current-customer="customer"
    @cancel-event="cancelCustomer()"
    @submit-event="submit($event)"
  ></edit-customer-mask>
</template>

<style></style>
