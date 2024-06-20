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
import { type TProject } from '@/views/Projects/ProjectTypes'
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
  data() {
    return {
      showAddStack: false,
      showAddCustomer: false,
      techstack_id: '',
      customer_id: '',
      techToAdd: '',
      showingModal: false,
      yes_no_options: [
        { label: 'no', value: 1 },
        { label: 'yes', value: 0 }
      ]
    }
  },
  props: {
    currentProject: {
      type: Object as PropType<TProject>,
      required: true
    },
    debug: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  created() {
    this.getAllProjectTypes()
    this.getAllTechStacks()
    this.getAllCustomers()
  },
  computed: {
    ...mapGetters([
      'techStackItems',
      'customerItems',
      'projectTypes',
      'isLoading'
    ]),
    techstack_options() {
      return (
        this.techStackItems
          .map((s) => ({ label: s.name, value: s.id }))
          .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0)) ?? []
      )
    },
    customer_options() {
      return (
        this.customerItems
          .map((s) => ({ label: s.name, value: s.id }))
          .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0)) ?? []
      )
    },
    project_options() {
      return (
        this.projectTypes.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0)) ?? []
      )
    }
  },
  emits: ['submitEvent', 'deleteEvent', 'cancelEvent'],
  methods: {
    ...mapActions([
      'getAllProjectTypes',
      'getAllTechStacks',
      'getAllCustomers',
      'setCurrentProjectItem',
      'updateCurrentProject',
      'deleteCurrentProject'
    ]),
    submitProject() {
      this.$emit('submitEvent', this.currentProject)
    },
    deleteProject() {
      this.$emit('deleteEvent', this.currentProject)
    },
    cancelProject() {
      this.$emit('cancelEvent')
    },
    openAddStack() {
      this.showAddStack = true
    },
    openAddCustomer() {
      this.showAddCustomer = true
    },
    removeStack(id: string) {
      const index = this.currentProject.tech.findIndex((e) => e.id == id)
      if (index > -1) this.currentProject.tech.splice(index, 1)
    },
    addStack(id: string | undefined) {
      if (id) {
        this.currentProject.tech.push(
          this.techStackItems.filter((item) => {
            return item.id.indexOf(id) > -1
          })[0]
        )
        this.techstack_id = ''
        this.showAddStack = false
      }
    },
    removeCustomer(id: string) {
      const index = this.currentProject.customers.findIndex((e) => e.id == id)
      if (index > -1) this.currentProject.customers.splice(index, 1)
    },
    addCustomer(id: string | undefined) {
      if (id) {
        this.currentProject.customers.push(
          this.customerItems.filter((item) => {
            return item.id.indexOf(id) > -1
          })[0]
        )
        this.customer_id = ''
        this.showAddCustomer = false
      }
    },
    addDates() {
      this.currentProject.dates.push({
        start_date: '',
        end_date: ''
      })
    },
    removeDate(index) {
      this.currentProject.dates.splice(index, 1)
    },
    needNewEntry(event: string) {
      this.showingModal = true
      this.techToAdd = event
    },
    closeModal() {
      this.showingModal = false
      this.getAllTechStacks()
    }
  }
}
</script>

<template>
  <card-modal :showing="showingModal" @close="closeModal">
    <add-tech-stack :given-name="techToAdd"></add-tech-stack>
  </card-modal>

  <div class="border-b border-gray-800">
    <div v-if="debug">currentProject: {{ currentProject }}<br /></div>
    <form class="container mx-auto px-4 mt-12 mb-12">
      <div class="mb-4">
        <select-input :label="'show'" v-model="currentProject.show" :options="yes_no_options" />
      </div>
      <div class="mb-4">
        <select-input :label="'type'" v-model="currentProject.type" :options="project_options" />
      </div>
      <div class="mb-4">
        <text-input :label="'name'" v-model="currentProject.name" :required="true" />
      </div>
      <div class="mb-4">
        <text-input :label="'position'" v-model="currentProject.position" :required="true" />
      </div>
      <div class="mb-4">
        <text-input :label="'location'" v-model="currentProject.location" :required="true" />
      </div>
      <div class="flex flex-row md:items-center mb-4">
        <h3 class="md:w-4/12">dates</h3>
        <div class="md:w-8/12">
          <div
            class="grid gap-8 grid-cols-5"
            v-for="(date, index) in currentProject.dates"
            :key="index"
          >
            <div class="col-span-2">
              <date-input :label="'start_date'" v-model="date.start_date" :required="true" />
            </div>
            <div class="col-span-2">
              <date-input :label="'end_date'" v-model="date.end_date" :required="true" />
            </div>
            <button
              class="md:w-12/12 border border-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              @click="removeDate(index)"
            >
              Remove
            </button>
          </div>
          <button
            v-if="currentProject.dates.length > 0"
            :disabled="!currentProject.dates[currentProject.dates.length - 1].start_date"
            class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="addDates()"
          >
            Add
          </button>
          <button
            v-else
            class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="addDates()"
          >
            Add
          </button>
        </div>
      </div>
      <div class="mb-4">
        <textarea-input :label="'contentshort'" v-model="currentProject.content_short" />
      </div>
      <div class="mb-4">
        <textarea-input :label="'contentlong'" v-model="currentProject.content_long" />
      </div>
      <div class="mb-4">
        <textarea-input :label="'contentold'" v-model="currentProject.content" />
      </div>

      <div class="mb-6">
        Customers
        <ul v-if="currentProject.customers.length > 0" class="mb-10 ap-4 flex flex-row flex-wrap gap-8">
          <li
            class="gap-4 items-center flex flex-row basis-1/6"
            v-for="customer in currentProject.customers"
            :key="customer.id"
          >
            <div class="inline-block basis-3/4">{{ customer.name }}</div>
            <div class="inline-block basis-1/4">
              <button
                class="border border-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                @click="removeCustomer(customer.id)"
              >
                -
              </button>
            </div>
          </li>
        </ul>

        <div>
          <div v-if="!showAddCustomer">
            <button
              class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              @click="openAddCustomer()"
            >
              Add Customer
            </button>
          </div>
          <div v-else>
            <autocomplete-input
              :options="customer_options"
              v-model="customer_id"
              :label="'select stack'"
              @need-new-entry="needNewEntry($event)"
            />
            <button
              :disabled="!customer_id"
              class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              @click="addCustomer(customer_id)"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div class="mb-4">
        Techstack
        <ul v-if="currentProject.tech.length > 0" class="mb-10 ap-4 flex flex-row flex-wrap gap-8">
          <li
            class="gap-4 items-center flex flex-row basis-1/6"
            v-for="tech in currentProject.tech"
            :key="tech.id"
          >
            <div class="inline-block basis-3/4">{{ tech.name }}</div>
            <div class="inline-block basis-1/4">
              <button
                class="border border-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                @click="removeStack(tech.id)"
              >
                -
              </button>
            </div>
          </li>
        </ul>

        <div>
          <div v-if="!showAddStack">
            <button
              class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              @click="openAddStack()"
            >
              Add Stack
            </button>
          </div>
          <div v-else>
            <autocomplete-input
              :options="techstack_options"
              v-model="techstack_id"
              :label="'select stack'"
              @need-new-entry="needNewEntry($event)"
            />
            <button
              :disabled="!techstack_id"
              class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              @click="addStack(techstack_id)"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </form>
    <div class="mb-3 flex gap-5 justify-end">
      <div class="inline-block">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="submitProject"
        >
          Submit
        </button>
      </div>
      <div v-if="currentProject.id" class="inline-block">
        <button
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="deleteProject"
        >
          Delete
        </button>
      </div>
      <div class="inline-block">
        <button
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="cancelProject"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
