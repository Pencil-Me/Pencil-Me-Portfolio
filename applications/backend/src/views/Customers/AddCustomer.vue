<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EditCustomerMask from '@/views/Customers/EditCustomerMask.vue'
import { useAppStore } from '@/pinia/useAppStore'
import { useCustomersStore } from '@/pinia/useCustomersStore'
import { runValidatedAction } from '@/composables/useCrudForm'
import { validateCustomer } from '@/utils/validation'
import type { TCustomer } from '@/types/customer'

const router = useRouter()
const appStore = useAppStore()
const customersStore = useCustomersStore()

const customer = ref<TCustomer>({ name: '', location: '' })

async function submit(payload: TCustomer) {
  await runValidatedAction(
    payload,
    validateCustomer,
    (message) => appStore.showError(message),
    () => customersStore.addCustomer(payload),
    () => cancelCustomer()
  )
}

function cancelCustomer() {
  customer.value = { name: '', location: '' }
  router.push({ name: 'CustomerList' })
}
</script>

<template>
  <edit-customer-mask
    :current-customer="customer"
    @cancel-event="cancelCustomer()"
    @submit-event="submit($event)"
  />
</template>
