<script>
export default {
  props: ['project'],
  setup() {}
}
</script>

<template>
  <div class="container mt-2" v-bind:class="{ 'is-public': project['show'] }">
    <router-link
      :to="{ name: 'EditProject', params: { id: project['id'] } }"
      class="mt-2 text-lg dark:hover:text-gray-300 hover:text-gray-500"
    >
      {{ project['name'] }}
    </router-link>
    <div
      class="span-container mt-1 text-sm text-gray-500 dark:text-gray-400"
      v-if="project['position'] || project['location']"
    >
      <span v-if="project['position']">{{ project['position'] }}</span>
      <span v-if="project['location']">{{ project['location'] }}</span>
    </div>
    <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      <div v-for="(item, index) in project['dates']" :key="index">
        <span>{{ item['start_date'] }}</span> bis <span>{{ item['end_date'] }}</span>
      </div>
    </div>
    <div class="span-container flex flex-wrap mt-1 text-sm text-gray-500 dark:text-gray-400">
      <span v-for="item in project['tech']" :key="item.id">{{ item.name }}</span>
    </div>
    <div class="span-container flex flex-wrap mt-1 text-sm text-gray-500 dark:text-gray-400">
      <span v-for="item in project['customers']" :key="item.id">{{ item.name }}</span>
    </div>
  </div>
</template>

<style>
.span-container span:not(:last-child):after {
  content: ' - ';
  display: inline-block;
  margin: 0 0.5rem;
}
.container {
  padding: 1rem;
}
.is-public {
  border: 1px solid green;
}
</style>
