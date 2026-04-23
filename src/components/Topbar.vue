<template>
  <!-- Top App Bar -->
  <v-app-bar color="primary" dark class="dashboard-header" elevation="2">
    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>

    <v-toolbar-title class="ml-3 font-weight-bold">AHA CDC</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Search Bar -->
    <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" placeholder="Search..." variant="outlined"
      density="compact" style="max-width: 300px" class="mx-4" hide-details></v-text-field>

    <!-- Notifications -->
    <v-badge color="error" dot>
      <v-btn icon="mdi-bell" variant="text"></v-btn>
    </v-badge>

    <!-- User Menu -->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-account-circle" variant="text" size="large" v-bind="props"></v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title>{{ userEmail }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="goToProfile">
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goToSettings">
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="handleLogout">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const userEmail = ref('user@example.com')

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const goToProfile = () => {
  console.log('Go to profile')
}

const goToSettings = () => {
  console.log('Go to settings')
}

const handleLogout = () => {
  localStorage.removeItem('userEmail')
  router.push('/login')
}

onMounted(() => {
  // Get user email from localStorage
  const storedEmail = localStorage.getItem('userEmail')
  if (storedEmail) {
    userEmail.value = storedEmail
  }
})
</script>

<style scoped>
.dashboard-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
