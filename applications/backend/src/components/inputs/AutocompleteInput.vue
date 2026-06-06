<template>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-4/12">
      <label>{{ label }}</label>
    </div>
    <div class="autocomplete md:w-8/12">
      <div class="w-full flex">
        <input
          type="text"
          class="w-full mt-1 font-semibold md:mt-0 text-black"
          :name="inputName"
          :value="searchTerm"
          placeholder="Suche…"
          @input="onInput"
          @change="onChange"
          @focusout="onFocusOut"
        />
        <div
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          v-show="searchTerm !== '' && results.length <= 0"
          @click="needNewEntry()"
        >
          +
        </div>
      </div>
      <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
        <template v-if="results.length > 0">
          <li
            v-for="(result, i) in results"
            :key="i"
            @click="setResult(result)"
            class="autocomplete-result"
            :class="{ 'is-active': i === arrowCounter }"
          >
            {{ result.label }}
          </li>
        </template>
        <li v-else-if="searchTerm !== ''">Keine Treffer</li>
      </ul>
    </div>
    <p v-if="error" class="text-red-600 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'AutocompleteInput',
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      error: '',
      searchTerm: '',
      selectedValue: '',
      results: [],
      isOpen: false,
      arrowCounter: -1
    }
  },
  emits: ['needNewEntry', 'update:modelValue'],
  computed: {
    inputName() {
      return this.name || this.label.toLowerCase()
    }
  },
  methods: {
    filterResults() {
      if (this.searchTerm === '') {
        return []
      }

      let matches = 0

      this.results = this.options.filter((item) => {
        if (item.label.toLowerCase().includes(this.searchTerm.toLowerCase()) && matches < 10) {
          matches++
          return item
        }
      })
    },
    setResult(result) {
      this.searchTerm = result.label
      this.selectedValue = result.value
      this.isOpen = false
      this.$emit('update:modelValue', result.value)
    },
    onChange() {
      if (this.searchTerm === '') {
        this.$emit('update:modelValue', '')
      }
    },
    onInput(event) {
      this.searchTerm = event.target.value
      this.filterResults()
      this.isOpen = true
    },
    onFocusOut() {
      if (this.results.length > 0) {
        this.searchTerm = this.results[0].label
        this.selectedValue = this.results[0].value
        this.isOpen = false
        this.$emit('update:modelValue', this.results[0].value)
      }
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.arrowCounter = -1
        this.isOpen = false
      }
    },
    needNewEntry() {
      this.$emit('needNewEntry', this.searchTerm)
    }
  }
}
</script>

<style>
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 6em;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>
