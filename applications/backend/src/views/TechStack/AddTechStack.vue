<script lang="ts">
import EditTechStackMask from '@/views/TechStack/EditTechStackMask.vue'
import type { TechStackType } from '@/views/TechStack/TechStackTypes'

export default {
  components: { EditTechStackMask },
  data() {
    return {
      techStack: {
        name: '',
        type: '',
        expertise_level: ''
      } as TechStackType
    }
  },
  computed: {},
  created() {},
  methods: {
    submitTechStack(techStack: TechStackType) {
      if (techStack.name != '' && techStack.type != '' && techStack.expertise_level != '') {
        this.$store.dispatch('addTechStack', techStack)

        this.techStack.name = ''
        this.techStack.type = ''
        this.techStack.expertise_level = ''

        this.$router.push({ name: 'TechStackList' })
      } else alert('Please fill up all the input box')
    },
    cancelTechStack() {
      this.techStack.name = ''
      this.techStack.type = ''
      this.techStack.expertise_level = ''

      this.$router.push({ name: 'TechStackList' })
    }
  }
}
</script>

<template>
  <edit-tech-stack-mask
    :current-tech-stack="techStack"
    @cancel-event="cancelTechStack()"
    @submit-event="submitTechStack($event)"
  ></edit-tech-stack-mask>
</template>

<style></style>
