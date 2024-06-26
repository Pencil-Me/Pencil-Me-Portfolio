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
import { async } from 'rxjs'

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
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 }
      ],
      mutableProject: {} as TProject
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
  watch: {
    currentProject: {
      immediate: true,
      handler(newProject) {
        this.mutableProject = { ...newProject }
      }
    }
  },
  created() {
    this.getAllProjectTypes()
    this.getAllTechStacks()
    this.getAllCustomers()
  },
  computed: {
    ...mapGetters(['techStackItems', 'customerItems', 'projectTypes', 'isLoading']),
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
    async() {
      return async
    },
    ...mapActions([
      'getAllProjectTypes',
      'getAllTechStacks',
      'getAllCustomers',
      'setCurrentProjectItem',
      'updateCurrentProject',
      'deleteCurrentProject'
    ]),
    submitProject() {
      this.$emit('submitEvent', this.mutableProject)
    },
    deleteProject() {
      this.$emit('deleteEvent', this.mutableProject)
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
      const index = this.mutableProject.tech.findIndex((e) => e.id == id)
      if (index > -1) this.mutableProject.tech.splice(index, 1)
    },
    addStack(id: string | undefined) {
      if (id) {
        this.mutableProject.tech.push(
          this.techStackItems.filter((item) => {
            return item.id.indexOf(id) > -1
          })[0]
        )
        this.techstack_id = ''
        this.showAddStack = false
      }
    },
    removeCustomer(id: string) {
      const index = this.mutableProject.customers.findIndex((e) => e.id == id)
      if (index > -1) this.mutableProject.customers.splice(index, 1)
    },
    addCustomer(id: string | undefined) {
      if (id) {
        this.mutableProject.customers.push(
          this.customerItems.filter((item) => {
            return item.id.indexOf(id) > -1
          })[0]
        )
        this.customer_id = ''
        this.showAddCustomer = false
      }
    },
    addDates() {
      this.mutableProject.dates.push({
        start_date: '',
        end_date: ''
      })
    },
    removeDate(index: number) {
      this.mutableProject.dates.splice(index, 1)
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
    <div v-if="debug">mutableProject: {{ mutableProject }}<br /></div>
    <form class="container mx-auto px-4 mt-12 mb-12">
      <div class="mb-4">
        <select-input :label="'show'" v-model="mutableProject.show" :options="yes_no_options" />
      </div>
      <div class="mb-4">
        <select-input :label="'type'" v-model="mutableProject.type" :options="project_options" />
      </div>
      <div class="mb-4">
        <text-input :label="'name'" v-model="mutableProject.name" :required="true" />
      </div>
      <div class="mb-4">
        <text-input :label="'position'" v-model="mutableProject.position" :required="true" />
      </div>
      <div class="mb-4">
        <text-input :label="'location'" v-model="mutableProject.location" :required="true" />
      </div>
      <div class="flex flex-row md:items-center mb-4">
        <h3 class="md:w-4/12">dates</h3>
        <div class="md:w-8/12">
          <div
            class="grid gap-8 grid-cols-5"
            v-for="(date, index) in mutableProject.dates"
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
            v-if="mutableProject.dates.length > 0"
            :disabled="!mutableProject.dates[mutableProject.dates.length - 1].start_date"
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
        <textarea-input :label="'contentshort'" v-model="mutableProject.content_short" />
      </div>
      <div class="mb-4">
        <textarea-input :label="'contentlong'" v-model="mutableProject.content_long" />
      </div>
      <div class="mb-4">
        <textarea-input :label="'contentold'" v-model="mutableProject.content" />
      </div>

      <div class="mb-6">
        Customers
        <ul
          v-if="mutableProject.customers.length > 0"
          class="mb-10 ap-4 flex flex-row flex-wrap gap-8"
        >
          <li
            class="gap-4 items-center flex flex-row basis-1/6"
            v-for="customer in mutableProject.customers"
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
              @need-new-entry="needNewEntry"
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
        <ul v-if="mutableProject.tech.length > 0" class="mb-10 ap-4 flex flex-row flex-wrap gap-8">
          <li
            class="gap-4 items-center flex flex-row basis-1/6"
            v-for="tech in mutableProject.tech"
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
              @need-new-entry="needNewEntry"
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
      <div v-if="mutableProject.id" class="inline-block">
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
