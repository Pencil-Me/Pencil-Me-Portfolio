<template>
  <div :class="{ loading: true, fullpage: pFullpage }">
    <span class="spinner-border spinner-border-lg" />
  </div>
</template>

<script>
function initialState() {
  return {}
}

export default {
  name: 'LoadingSpinner',
  components: {},
  props: {
    pFullpage: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  data() {
    return initialState()
  },
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">
.loading {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  &.fullpage {
    position: fixed;
  }
}
</style>
