<template>
  <div class="md:flex md:items-center mb-6">
    <div v-if="debug" class="md:w-2/12">modelValue: {{ modelValue }}<br /></div>
    <div :class="debug ? 'md:w-2/12' : 'md:w-4/12'">
      <label>{{ label }}</label>
    </div>
    <div class="md:w-8/12">
      <textarea
        class="w-full mt-1 font-semibold md:mt-0 text-black"
        :name="name"
        :value="modelValue"
        @input="onInput"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            $emit('update:modelValue', $event.target.value)
          }
        }"
      ></textarea>
    </div>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<style>
textarea {
  height: 7rem;
  padding: .25rem;
}
</style>

<script>
export default {
  name: 'CustomInput',
  props: {
    debug: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
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
    name() {
      return this.label.toLowerCase()
    }
  },
  methods: {
    onInput(event) {
      const value = event.target.value

      if (!value && this.required) {
        this.error = 'Value should not be empty'
      }

      this.$emit('input', event.target.value)
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
