<script>
export default {
  props: ['techStack']
}
</script>

<template>
  <div class="mt-2">
    <router-link
      :to="{ name: 'EditTechStack', params: { id: techStack['id'] } }"
      class="mt-2 text-lg dark:hover:text-gray-300 hover:text-gray-500"
    >
      {{ techStack['name'] }}
    </router-link>
    <div class="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
      <span>{{ techStack['type'] }}</span>
    </div>
    <div class="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
      <span>{{ techStack['expertise_level'] }}</span>
    </div>
    <div class="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
      <span>{{ techStack['project_count'] }}</span>
    </div>
    <div class="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
      <span>{{ techStack['last_usage'] }}</span>
    </div>
  </div>
</template>
