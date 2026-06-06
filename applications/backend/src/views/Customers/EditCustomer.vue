<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import EditCustomerMask from '@/views/Customers/EditCustomerMask.vue'
import { useAppStore } from '@/pinia/useAppStore'
import { useCustomersStore } from '@/pinia/useCustomersStore'
import { runValidatedAction } from '@/composables/useCrudForm'
import { useEditEntityLoad } from '@/composables/useEditEntityLoad'
import { validateCustomer } from '@/utils/validation'
import type { TCustomer } from '@/types/customer'

const props = defineProps<{ id: string }>()

const router = useRouter()
const appStore = useAppStore()
const customersStore = useCustomersStore()
const { currentCustomer } = storeToRefs(customersStore)

const { loadFailed, isReady } = useEditEntityLoad(
  (entityId) => customersStore.setCurrentCustomerItem(entityId),
  props.id
)

const customer = computed((): TCustomer => ({
  id: currentCustomer.value.id,
  name: currentCustomer.value.name,
  location: currentCustomer.value.location
}))

async function submitEvent(payload: TCustomer) {
  await runValidatedAction(
    payload,
    validateCustomer,
    (message) => appStore.showError(message),
    () => customersStore.updateCurrentCustomer(payload),
    () => router.push({ name: 'CustomerList' })
  )
}

async function deleteEvent(payload: TCustomer) {
  try {
    await customersStore.deleteCurrentCustomer(payload)
    await router.push({ name: 'CustomerList' })
  } catch {
    // Fehlerbanner wird von withStoreAction gesetzt
  }
}

function cancelEvent() {
  router.push({ name: 'CustomerList' })
}
</script>

<template>
  <div v-if="loadFailed" class="container px-4 pt-10 mx-auto">
    <p class="mb-4">Eintrag nicht gefunden oder konnte nicht geladen werden.</p>
    <router-link
      :to="{ name: 'CustomerList' }"
      class="text-blue-400 hover:text-blue-300"
    >
      Zurück zur Liste
    </router-link>
  </div>
  <edit-customer-mask
    v-else-if="isReady"
    :current-customer="customer"
    @submit-event="submitEvent($event)"
    @delete-event="deleteEvent($event)"
    @cancel-event="cancelEvent()"
  />
</template>
