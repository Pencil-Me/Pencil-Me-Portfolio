<script lang="ts">
import LoadingBar from '@/components/LoadingBar.vue'
import TextInput from '@/components/inputs/TextInput.vue'
import DateInput from '@/components/inputs/DateInput.vue'
import TextareaInput from '@/components/inputs/Textarea.vue'
import SelectInput from '@/components/inputs/SelectInput.vue'
import { mapActions, mapGetters } from 'vuex'
import CardModal from '@/views/CardModal.vue'
import AddTechStack from '@/views/TechStack/AddTechStack.vue'
import AutocompleteInput from '@/components/inputs/AutocompleteInput.vue'
import { type TCustomer } from '@/views/Customers/CustomerTypes'
import type { PropType } from 'vue'

export default {
  components: {
    AutocompleteInput,
    AddTechStack,
    CardModal,
    LoadingBar,
    TextInput,
    DateInput,
    TextareaInput,
    SelectInput
  },
  data() {},
  props: {
    currentCustomer: {
      type: Object as PropType<TCustomer>,
      required: true
    },
    debug: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  created() {},
  computed: {
    ...mapGetters(['isLoading'])
  },
  emits: ['submitEvent', 'deleteEvent', 'cancelEvent'],
  methods: {
    ...mapActions(['setCurrentCustomerItem', 'updateCurrentCustomer', 'deleteCurrentCustomer']),
    submitCustomer() {
      this.$emit('submitEvent', this.currentCustomer)
    },
    deleteCustomer() {
      this.$emit('deleteEvent', this.currentCustomer)
    },
    cancelCustomer() {
      this.$emit('cancelEvent')
    }
  }
}
</script>

<template>
  <card-modal :showing="showingModal" @close="closeModal">
    <add-tech-stack :given-name="techToAdd"></add-tech-stack>
  </card-modal>

  <div class="border-b border-gray-800">
    <div v-if="debug">currentCustomer: {{ currentCustomer }}<br /></div>
    <form class="container mx-auto px-4 mt-12 mb-12">
      <div class="mb-4">
        <text-input :label="'name'" v-model="currentCustomer.name" :required="true" />
      </div>
      <div class="mb-4">
        <text-input :label="'location'" v-model="currentCustomer.location" :required="true" />
      </div>
    </form>
    <div class="mb-3 flex gap-5 justify-end">
      <div class="inline-block">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="submitCustomer"
        >
          Submit
        </button>
      </div>
      <div v-if="currentCustomer.id" class="inline-block">
        <button
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="deleteCustomer"
        >
          Delete
        </button>
      </div>
      <div class="inline-block">
        <button
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="cancelCustomer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
