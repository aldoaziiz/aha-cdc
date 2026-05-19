<template>
  <v-app>
    <component :is="layoutComponent">
      <router-view />
    </component>
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BlankLayout from './layouts/BlankLayout.vue'
import AppLayout from './layouts/AppLayout.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const layoutComponent = computed(() => {
  const layout = route.meta?.layout as string | undefined
  if (layout === 'blank') {
    return BlankLayout
  }
  return AppLayout
})

onMounted(() => {
  authStore.fetchMe()
})
</script>
