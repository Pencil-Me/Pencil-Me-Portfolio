<template>
  <div className="loading-container"><loading :p-fullpage="true" /></div>
</template>

<script>
import loading from '@/components/_components/_loading.vue'

export default {
  name: 'loadingComponent',
  components: {
    loading
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style>
.loading-container .loading {
  background: #ffffff;
}
</style>
