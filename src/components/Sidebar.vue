<template>
  <!-- Sidebar -->
  <v-navigation-drawer v-model="sidebarOpen" :permanent="!isMobile" :temporary="isMobile" class="sidebar">
    <v-list dense nav>
      <!-- <v-list-item
        v-for="item in menuItems"
        :key="item.id"
        :active="activeMenu === item.id"
        @click="activeMenu = item.id"
      >
        <template v-slot:prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item> -->
      <v-list-item @click="setActiveMenu('dashboard')" :active="activeMenu === 'dashboard'">
        <template v-slot:prepend>
          <v-icon>mdi-home</v-icon>
        </template>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="People" prepend-icon="mdi-account-box"></v-list-item>
        </template>
        <v-list-item @click="setActiveMenu('Children')" :active="activeMenu === 'Children'" title="Children"
          prepend-icon="mdi-account-child"></v-list-item>
        <v-list-item @click="setActiveMenu('Parents')" :active="activeMenu === 'Parents'" title="Parents"
          prepend-icon="mdi-account-multiple"></v-list-item>
        <v-list-item @click="setActiveMenu('Staff')" :active="activeMenu === 'Staff'" title="Staff"
          prepend-icon="mdi-account-tie"></v-list-item>
      </v-list-group>

    </v-list>

    <v-divider class="my-4"></v-divider>

    <v-list dense nav>
      <v-list-item>
        <template v-slot:prepend>
          <v-icon>mdi-help-circle</v-icon>
        </template>
        <v-list-item-title>Help & Support</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const sidebarOpen = ref(!mobile.value)
const activeMenu = ref('dashboard')
const isMobile = computed(() => mobile.value)

// const menuItems = [
//   { id: 'dashboard', title: 'Dashboard', icon: 'mdi-home' },
//   { id: 'people', title: 'People', icon: 'mdi-account-box' },
//   { id: 'admission', title: 'Admission', icon: 'mdi-book-open-variant-outline' },
//   { id: 'billing', title: 'Billing', icon: 'mdi-wallet-bifold-outline' },
//   { id: 'activity', title: 'Activity', icon: 'mdi-pencil-box-multiple-outline' },
//   { id: 'learning', title: 'Learning', icon: 'mdi-school' },
//   { id: 'reports', title: 'Reports', icon: 'mdi-chart-bar' },
// ]

const setActiveMenu = (menu: string) => {
  activeMenu.value = menu
}

// Expose sidebarOpen to parent component
defineExpose({
  sidebarOpen
})
</script>

<style scoped>
.sidebar {
  border-right: 1px solid #e0e0e0;
  background: #fafafa;
}
</style>
