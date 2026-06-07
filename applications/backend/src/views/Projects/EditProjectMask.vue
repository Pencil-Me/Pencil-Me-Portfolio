<script lang="ts">
import TextInput from '@/components/inputs/TextInput.vue'
import DateInput from '@/components/inputs/DateInput.vue'
import TextareaInput from '@/components/inputs/Textarea.vue'
import SelectInput from '@/components/inputs/SelectInput.vue'
import { mapActions, mapState } from 'pinia'
import CardModal from '@/views/CardModal.vue'
import AddTechStackModal from '@/views/TechStack/AddTechStack.vue'
import AutocompleteInput from '@/components/inputs/AutocompleteInput.vue'
import type { TProject } from '@/types/project'
import { cloneProject } from '@/utils/mappers/project.mapper'
import type { PropType } from 'vue'
import { useAppStore } from '@/pinia/useAppStore'
import { useProjectsStore } from '@/pinia/useProjectsStore'
import { useCustomersStore } from '@/pinia/useCustomersStore'
import { useTechStackStore } from '@/pinia/useTechStackStore'

export default {
  components: {
    AutocompleteInput,
    AddTechStackModal,
    CardModal,
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
        { label: 'Nein', value: 0 },
        { label: 'Ja', value: 1 }
      ],
      featured_rank_options: [
        { label: 'Nicht auf Startseite', value: 0 },
        { label: 'Highlight Platz 1', value: 1 },
        { label: 'Highlight Platz 2', value: 2 },
        { label: 'Highlight Platz 3', value: 3 }
      ],
      mutableProject: {} as TProject
    }
  },
  props: {
    currentProject: {
      type: Object as PropType<TProject>,
      required: true
    }
  },
  watch: {
    currentProject: {
      immediate: true,
      handler(newProject) {
        this.mutableProject = cloneProject(newProject)
      }
    }
  },
  created() {
    this.getAllProjectTypes()
    this.getAllTechStacks()
    this.getAllCustomers()
  },
  computed: {
    ...mapState(useAppStore, ['isLoading']),
    ...mapState(useTechStackStore, ['techStackItems']),
    ...mapState(useCustomersStore, ['customerItems']),
    ...mapState(useProjectsStore, ['projectTypes']),
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
      return [...this.projectTypes].sort((a, b) =>
        a.label > b.label ? 1 : b.label > a.label ? -1 : 0
      )
    }
  },
  emits: ['submitEvent', 'deleteEvent', 'cancelEvent'],
  methods: {
    ...mapActions(useProjectsStore, ['getAllProjectTypes']),
    ...mapActions(useTechStackStore, ['getAllTechStacks']),
    ...mapActions(useCustomersStore, ['getAllCustomers']),
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
      if (!id) return
      const item = this.techStackItems.find((entry) => entry.id === id)
      if (item) {
        this.mutableProject.tech.push({ ...item, id: item.id ?? '' })
        this.techstack_id = ''
        this.showAddStack = false
      }
    },
    removeCustomer(id: string) {
      const index = this.mutableProject.customers.findIndex((e) => e.id == id)
      if (index > -1) this.mutableProject.customers.splice(index, 1)
    },
    addCustomer(id: string | undefined) {
      if (!id) return
      const item = this.customerItems.find((entry) => entry.id === id)
      if (item) {
        this.mutableProject.customers.push({ ...item })
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
  <card-modal :showing="showingModal" title="Tech-Stack anlegen" @close="closeModal">
    <AddTechStackModal :given-name="techToAdd" />
  </card-modal>

  <div class="border-b border-gray-800">
    <form class="container mx-auto px-4 mt-12 mb-12">
      <div class="mb-4">
        <select-input label="Öffentlich" v-model="mutableProject.show" :options="yes_no_options" />
      </div>
      <div class="mb-4">
        <select-input label="Typ" v-model="mutableProject.type" :options="project_options" />
      </div>
      <div class="mb-4">
        <text-input label="Name" v-model="mutableProject.name" :required="true" />
      </div>
      <div class="mb-4">
        <text-input label="Position" v-model="mutableProject.position" :required="true" />
      </div>
      <div class="mb-4">
        <text-input label="Standort" v-model="mutableProject.location" :required="true" />
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
              <date-input
                label="Start"
                name="start_date"
                :model-value="date.start_date ?? ''"
                @update:model-value="date.start_date = $event"
                :required="true"
              />
            </div>
            <div class="col-span-2">
              <date-input
                label="Ende"
                name="end_date"
                :model-value="date.end_date ?? ''"
                @update:model-value="date.end_date = $event"
                :required="true"
              />
            </div>
            <button
              class="md:w-12/12 border border-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              @click="removeDate(index)"
            >
              Entfernen
            </button>
          </div>
          <button
            v-if="mutableProject.dates.length > 0"
            :disabled="!mutableProject.dates[mutableProject.dates.length - 1].start_date"
            class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="addDates()"
          >
            Zeitraum hinzufügen
          </button>
          <button
            v-else
            class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="addDates()"
          >
            Zeitraum hinzufügen
          </button>
        </div>
      </div>
      <div class="mb-4">
        <textarea-input
          label="Kurztext"
          name="content_short"
          v-model="mutableProject.content_short"
        />
      </div>
      <div class="mb-4">
        <textarea-input
          label="Langtext"
          name="content_long"
          v-model="mutableProject.content_long"
        />
      </div>
      <div class="mb-4">
        <textarea-input label="Alt-Text" name="content" v-model="mutableProject.content" />
      </div>

      <div class="mb-6 border border-gray-700 rounded p-4">
        <h3 class="text-lg font-semibold mb-4">Projektstory (Detailseite)</h3>
        <div class="mb-4">
          <text-input
            label="Tag (z. B. GovTech · Interpol · Lead)"
            v-model="mutableProject.featured_tag"
          />
        </div>
        <div class="mb-4">
          <textarea-input
            label="Ausgangslage"
            name="featured_problem"
            v-model="mutableProject.featured_problem"
          />
        </div>
        <div class="mb-4">
          <textarea-input
            label="Meine Rolle"
            name="featured_role"
            v-model="mutableProject.featured_role"
          />
        </div>
        <div class="mb-4">
          <textarea-input
            label="Ergebnis"
            name="featured_outcome"
            v-model="mutableProject.featured_outcome"
          />
        </div>
      </div>

      <div class="mb-6 border border-gray-700 rounded p-4">
        <h3 class="text-lg font-semibold mb-4">Highlight auf Startseite</h3>
        <div class="mb-4">
          <select-input
            label="Highlight-Platz (1–3, leer = nicht auf Startseite)"
            v-model="mutableProject.featured_rank"
            :options="featured_rank_options"
          />
        </div>
      </div>

      <div class="mb-6">
        Kunden
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
                @click="removeCustomer(customer.id ?? '')"
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
              Kunde hinzufügen
            </button>
          </div>
          <div v-else>
            <autocomplete-input
              :options="customer_options"
              v-model="customer_id"
              label="Kunde suchen"
              name="customer"
              @need-new-entry="needNewEntry"
            />
            <button
              :disabled="!customer_id"
              class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              @click="addCustomer(customer_id)"
            >
              Hinzufügen
            </button>
          </div>
        </div>
      </div>

      <div class="mb-4">
        Tech-Stack
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
                @click="removeStack(tech.id ?? '')"
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
              Tech-Stack hinzufügen
            </button>
          </div>
          <div v-else>
            <autocomplete-input
              :options="techstack_options"
              v-model="techstack_id"
              label="Tech-Stack suchen"
              name="techstack"
              @need-new-entry="needNewEntry"
            />
            <button
              :disabled="!techstack_id"
              class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              @click="addStack(techstack_id)"
            >
              Hinzufügen
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
          Speichern
        </button>
      </div>
      <div v-if="mutableProject.id" class="inline-block">
        <button
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="deleteProject"
        >
          Löschen
        </button>
      </div>
      <div class="inline-block">
        <button
          class="border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="cancelProject"
        >
          Abbrechen
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
