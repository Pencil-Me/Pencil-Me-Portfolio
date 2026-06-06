<template>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-4/12">
      <label>{{ label }}</label>
    </div>
    <div class="md:w-8/12">
      <select
        class="w-full mt-1 font-semibold md:mt-0 text-black"
        :value="modelValue"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            $emit('update:modelValue', $event.target.value)
          }
        }"
      >
        <option value="" selected disabled>Bitte wählen</option>
        <option v-for="option in options" :value="option.value" :key="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
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
  emits: ['update:modelValue']
}
</script>
