<template>
  <div class="md:flex md:items-center mb-6">
    <div v-if="debug" class="md:w-2/12">modelValue: {{ modelValue }}<br /></div>
    <div :class="debug ? 'md:w-2/12' : 'md:w-4/12'">
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
        <option value="" selected disabled>Choose</option>
        <option
          v-for="option in options"
          :value="option.value"
          :key="option.value"
          :selected="option === modelValue"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
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
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      require: true
    }
  }
}
</script>
