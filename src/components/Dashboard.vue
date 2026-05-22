<template>
  <div class="dashboard-content">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">{{ pageTitle }}</h1>
        <p class="text-body2 text-grey">{{ pageSubtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const pageTitle = 'Dashboard'
const pageSubtitle = 'Halaman Dashboard aplikasi AHA CDC.'
</script>

<style scoped>
.dashboard-content {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-content {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-left: 4px solid var(--v-primary-base);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #f5f5f5;
}

.activity-item {
  border-bottom: 1px solid #e0e0e0;
}

.activity-item:last-child {
  border-bottom: none;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .stat-card {
    margin-bottom: 12px;
  }
}
</style>
