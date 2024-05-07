<script>
export default {
  props: ['customer'],
  setup() {}
}
</script>

<template>
  <div class="mt-2">
    <router-link
      :to="{ name: 'EditCustomer', params: { id: customer['id'] } }"
      class="mt-2 text-lg dark:hover:text-gray-300 hover:text-gray-500"
    >
      {{ customer['name'] }}
    </router-link>
    <div
      class="span-container mt-1 text-sm text-gray-500 dark:text-gray-400"
      v-if="customer['location']"
    >
      <span v-if="customer['location']">{{ customer['location'] }}</span>
    </div>
  </div>
</template>

<style>
.span-container span:not(:last-child):after {
  content: ' - ';
  display: inline-block;
  margin: 0 0.5rem;
}
</style>
