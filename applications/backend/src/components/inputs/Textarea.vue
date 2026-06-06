<template>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-4/12">
      <label>{{ label }}</label>
    </div>
    <div class="md:w-8/12">
      <textarea
        class="w-full mt-1 font-semibold md:mt-0 text-black"
        :name="inputName"
        :value="modelValue"
        @input="onInput"
      ></textarea>
    </div>
    <p v-if="error" class="text-red-600 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<style>
textarea {
  height: 7rem;
  padding: 0.25rem;
}
</style>

<script>
export default {
  name: 'TextareaInput',
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
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: ''
    }
  },
  computed: {
    inputName() {
      return this.name || this.label.toLowerCase()
    }
  },
  methods: {
    onInput(event) {
      const value = event.target.value

      if (!value && this.required) {
        this.error = 'Dieses Feld darf nicht leer sein.'
      } else if (value) {
        this.error = ''
      }

      this.$emit('update:modelValue', value)
    }
  },
  watch: {
    modelValue: {
      handler(value) {
        if (value) {
          this.error = ''
        }
      }
    }
  }
}
</script>
