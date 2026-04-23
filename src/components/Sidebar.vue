<template>
  <!-- Sidebar -->
  <v-navigation-drawer v-model="sidebarOpen" :permanent="!isMobile" :temporary="isMobile" class="sidebar">
    <v-list dense nav>

      <v-list-item @click="setActiveMenu('Dashboard')" :active="activeMenu === 'Dashboard'" to="/dashboard">
        <template v-slot:prepend>
          <v-icon>mdi-home</v-icon>
        </template>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="People" prepend-icon="mdi-account-box"></v-list-item>
        </template>
        <v-list-item @click="setActiveMenu('Children')" :active="activeMenu === 'Children'" title="Children" to="/children"></v-list-item>
        <v-list-item @click="setActiveMenu('Parents')" :active="activeMenu === 'Parents'" title="Parents" to="/parents"></v-list-item>
        <v-list-item @click="setActiveMenu('Staff')" :active="activeMenu === 'Staff'" title="Staff" to="/staff"></v-list-item>
      </v-list-group>
      
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Admission" prepend-icon="mdi-book-open-variant-outline"></v-list-item>
        </template>
        <v-list-item @click="setActiveMenu('Applicants')" :active="activeMenu === 'Applicants'" title="Applicants" to="/applicants"></v-list-item>
        <v-list-item @click="setActiveMenu('Forms')" :active="activeMenu === 'Forms'" title="Forms" to="/forms"></v-list-item>
        <v-list-item @click="setActiveMenu('Programs')" :active="activeMenu === 'Programs'" title="Programs" to="/programs"></v-list-item>
        <v-list-item @click="setActiveMenu('Rooms')" :active="activeMenu === 'Rooms'" title="Rooms" to="/rooms"></v-list-item>
      </v-list-group>
      
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Billing" prepend-icon="mdi-wallet-bifold-outline"></v-list-item>
        </template>
        <v-list-item @click="setActiveMenu('Transactions')" :active="activeMenu === 'Transactions'" title="Transactions" to="/transactions"></v-list-item>
        <v-list-item @click="setActiveMenu('Students')" :active="activeMenu === 'Students'" title="Students" to="/students"></v-list-item>
        <v-list-item @click="setActiveMenu('Template')" :active="activeMenu === 'Template'" title="Template" to="/template"></v-list-item>
      </v-list-group>

      <v-list-item @click="setActiveMenu('Activity')" :active="activeMenu === 'Activity'" to="/activity">
        <template v-slot:prepend>
          <v-icon>mdi-pencil-box-multiple-outline</v-icon>
        </template>
        <v-list-item-title>Activity</v-list-item-title>
      </v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Learning" prepend-icon="mdi-school"></v-list-item>
        </template>
        <v-list-item @click="setActiveMenu('Curriculum')" :active="activeMenu === 'Curriculum'" title="Curriculum" to="/curriculum"></v-list-item>
        <v-list-item @click="setActiveMenu('LessonPlan')" :active="activeMenu === 'LessonPlan'" title="Lesson Plan" to="/lesson-plan"></v-list-item>
        <v-list-item @click="setActiveMenu('MilestoneLog')" :active="activeMenu === 'MilestoneLog'" title="Milestone Log" to="/milestone-log"></v-list-item>
        <v-list-item @click="setActiveMenu('ProgressReport')" :active="activeMenu === 'ProgressReport'" title="Progress Report" to="/progress-report"></v-list-item>
      </v-list-group>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Report" prepend-icon="mdi-chart-bar"></v-list-item>
        </template>
        <v-list-item @click="setActiveMenu('ReportAdmission')" :active="activeMenu === 'ReportAdmission'" title="Admission" to="/report-admission"></v-list-item>
        <v-list-item @click="setActiveMenu('ReportAttendance')" :active="activeMenu === 'ReportAttendance'" title="Attendance" to="/report-attendance"></v-list-item>
        <v-list-item @click="setActiveMenu('ReportLateCheckOut')" :active="activeMenu === 'ReportLateCheckOut'" title="Late Check-Out" to="/report-late-check-out"></v-list-item>
        <v-list-item @click="setActiveMenu('ReportActivity')" :active="activeMenu === 'ReportActivity'" title="Activity" to="/report-activity"></v-list-item>
      </v-list-group>

    </v-list>

    <v-divider class="my-4"></v-divider>

    <v-list dense nav>
      <v-list-item @click="setActiveMenu('helpSupport')" :active="activeMenu === 'helpSupport'" to="/help-support">
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
