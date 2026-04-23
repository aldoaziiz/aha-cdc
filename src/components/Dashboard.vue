<template>
  <div class="dashboard-content">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">{{ pageTitle }}</h1>
        <p class="text-body2 text-grey">{{ pageSubtitle }}</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="1">
          <v-card-text class="d-flex align-center">
            <div class="stat-icon mr-4">
              <v-icon color="#6EC6CD" size="40">mdi-file-document-check</v-icon>
            </div>
            <div>
              <p class="text-body2 text-grey mb-1">Prospect</p>
              <p class="text-h6 font-weight-bold">28</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="1">
          <v-card-text class="d-flex align-center">
            <div class="stat-icon mr-4">
              <v-icon color="#E6611D" size="40">mdi-text-box-search-outline</v-icon>
            </div>
            <div>
              <p class="text-body2 text-grey mb-1">Interacted</p>
              <p class="text-h6 font-weight-bold">0</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="1">
          <v-card-text class="d-flex align-center">
            <div class="stat-icon mr-4">
              <v-icon color="#FFD039" size="40">mdi-check-circle</v-icon>
            </div>
            <div>
              <p class="text-body2 text-grey mb-1">Accepted</p>
              <p class="text-h6 font-weight-bold">1</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="1">
          <v-card-text class="d-flex align-center">
            <div class="stat-icon mr-4">
              <v-icon color="#64AF64" size="40">mdi-warehouse</v-icon>
            </div>
            <div>
              <p class="text-body2 text-grey mb-1">Done</p>
              <p class="text-h6 font-weight-bold">0</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts and Tables -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="1" class="mb-6">
          <v-card-title class="font-weight-bold pb-0">
            Revenue Trend
          </v-card-title>
          <v-card-text class="py-8"
            style="height: 300px; background: #f5f5f5; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999;">
            Chart Placeholder - Revenue Chart
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="1">
          <v-card-title class="font-weight-bold pb-0">
            Recent Activity
          </v-card-title>
          <v-card-text>
            <div class="activity-item py-3 border-bottom" v-for="i in 5" :key="i">
              <p class="text-body2 font-weight-medium mb-1">Activity {{ i }}</p>
              <p class="text-caption text-grey">{{ getTimeAgo(i) }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="1">
          <v-card-title class="font-weight-bold pb-0">
            Recent Transactions
          </v-card-title>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Customer</th>
                <th class="text-left">Amount</th>
                <th class="text-left">Status</th>
                <th class="text-left">Date</th>
                <th class="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td>#{{ String(1000 + i).padStart(5, '0') }}</td>
                <td>Customer {{ i }}</td>
                <td>${{ (Math.random() * 1000).toFixed(2) }}</td>
                <td>
                  <v-chip :color="i % 2 === 0 ? 'success' : 'warning'" size="small" label>
                    {{ i % 2 === 0 ? 'Completed' : 'Pending' }}
                  </v-chip>
                </td>
                <td>{{ new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString() }}</td>
                <td>
                  <v-btn variant="text" size="small" icon="mdi-eye"></v-btn>
                  <v-btn variant="text" size="small" icon="mdi-pencil"></v-btn>
                  <v-btn variant="text" size="small" icon="mdi-delete"></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const pageTitle = 'Admission To-Do'
const pageSubtitle = 'Total pendaftar yang tertarik untuk mendaftarkan anak mereka.'

const getTimeAgo = (i: number) => {
  const hours = i * 2
  return `${hours} hours ago`
}
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
