<template>
  <v-container fluid class="pa-6">
    <!-- ====================== -->
    <!-- HEADER -->
    <!-- ====================== -->

    <div class="d-flex flex-wrap justify-space-between align-center ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">Therapist Monthly Report</h1>

        <div class="text-body-2 text-medium-emphasis">
          Review therapist session assignments and completion status by month.
        </div>
      </div>

      <div class="d-flex ga-2">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-file-excel-outline"
          @click="showComingSoon('Excel')"
        >
          Export Excel
        </v-btn>

        <v-btn variant="outlined" prepend-icon="mdi-file-pdf-box" @click="showComingSoon('PDF')">
          Export PDF
        </v-btn>
      </div>
    </div>

    <!-- ====================== -->
    <!-- FILTER -->
    <!-- ====================== -->

    <v-card rounded="lg" elevation="1" class="pa-4 mb-6">
      <div class="text-subtitle-1 font-weight-medium mb-4">Report Filter</div>

      <v-row>
        <!-- Month -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="filters.month"
            :items="months"
            item-title="title"
            item-value="value"
            label="Month"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <!-- Year -->
        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="filters.year"
            :items="years"
            label="Year"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <!-- Therapist -->
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="filters.therapistId"
            :items="therapists"
            item-title="name"
            item-value="id"
            label="Therapist"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <!-- Buttons -->
        <v-col cols="12" sm="6" md="3" class="d-flex align-center ga-2">
          <v-btn color="primary" prepend-icon="mdi-filter-outline" @click="applyFilter">
            Apply Filter
          </v-btn>

          <v-btn variant="text" @click="resetFilter">Reset</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- ====================== -->
    <!-- SUMMARY -->
    <!-- ====================== -->

    <v-row class="mb-2">
      <!-- Total Sessions -->
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="lg" elevation="1" class="pa-5">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-body-2 text-medium-emphasis mb-2">Total Sessions</div>

              <div class="text-h4 font-weight-bold">
                {{ summary.totalSessions }}
              </div>
            </div>

            <v-avatar color="orange-lighten-5" size="48">
              <v-icon color="orange-darken-2">mdi-calendar-multiple</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Completed -->
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="lg" elevation="1" class="pa-5">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-body-2 text-medium-emphasis mb-2">Completed</div>

              <div class="text-h4 font-weight-bold">
                {{ summary.completed }}
              </div>
            </div>

            <v-avatar color="green-lighten-5" size="48">
              <v-icon color="green-darken-2">mdi-check-circle-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Scheduled -->
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="lg" elevation="1" class="pa-5">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-body-2 text-medium-emphasis mb-2">Scheduled</div>

              <div class="text-h4 font-weight-bold">
                {{ summary.scheduled }}
              </div>
            </div>

            <v-avatar color="blue-lighten-5" size="48">
              <v-icon color="blue-darken-2">mdi-clock-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <!-- Alpha -->
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="lg" elevation="1" class="pa-5">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-body-2 text-medium-emphasis mb-2">Alpha</div>

              <div class="text-h4 font-weight-bold">
                {{ summary.alpha }}
              </div>
            </div>

            <v-avatar color="red-lighten-5" size="48">
              <v-icon color="red-darken-2">mdi-close-circle-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ====================== -->
    <!-- TABLE -->
    <!-- ====================== -->

    <v-card rounded="lg" elevation="1">
      <div class="pa-5">
        <div class="text-h6 font-weight-medium">Therapy Sessions</div>

        <div class="text-body-2 text-medium-emphasis">
          Session details for the selected reporting period.
        </div>
      </div>

      <v-divider />

      <v-data-table-server
        v-model:page="table.page"
        v-model:items-per-page="table.itemsPerPage"
        :headers="headers"
        :items="sessions"
        :items-length="totalItems"
        :loading="loading"
        :items-per-page-options="[10, 25, 50, 100]"
        item-value="id"
        class="therapist-report-table"
        @update:options="handleTableOptions"
      >
        <!-- Therapy Date -->
        <template #item.therapy_date="{ item }">
          {{ formatDate(item.therapy_date) }}
        </template>

        <!-- Therapy Time -->
        <template #item.therapy_time="{ item }">
          {{ formatTime(item.start_time) }} - {{ formatTime(item.end_time) }}
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="py-12 text-center">
            <v-icon size="48" color="grey-lighten-1" class="mb-3">
              mdi-calendar-remove-outline
            </v-icon>

            <div class="text-subtitle-1 font-weight-medium">No therapy sessions found</div>

            <div class="text-body-2 text-medium-emphasis mt-1">
              There are no therapy sessions for the selected report period.
            </div>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- ====================== -->
    <!-- SNACKBAR -->
    <!-- ====================== -->

    <v-snackbar v-model="snackbar.show" :timeout="3000" color="info" location="top right">
      {{ snackbar.message }}

      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import api from '@/services/api'

// ======================
// TYPES
// ======================

interface Therapist {
  id: number | null
  name: string
  status_id?: number
}

interface TherapySession {
  id: number
  registration_number: string
  child_name: string
  therapist_name: string
  therapy_date: string
  start_time: string
  end_time: string
  status: string
}

interface TableOptions {
  page: number
  itemsPerPage: number
  sortBy: Array<{
    key: string
    order?: 'asc' | 'desc'
  }>
}

// ======================
// CURRENT DATE
// ======================

const currentDate = new Date()

const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getFullYear()

// ======================
// FILTER
// ======================

const filters = reactive({
  month: currentMonth,
  year: currentYear,
  therapistId: null as number | null,
})

const months = [
  { title: 'January', value: 1 },
  { title: 'February', value: 2 },
  { title: 'March', value: 3 },
  { title: 'April', value: 4 },
  { title: 'May', value: 5 },
  { title: 'June', value: 6 },
  { title: 'July', value: 7 },
  { title: 'August', value: 8 },
  { title: 'September', value: 9 },
  { title: 'October', value: 10 },
  { title: 'November', value: 11 },
  { title: 'December', value: 12 },
]

const years = Array.from({ length: 6 }, (_, index) => currentYear - 4 + index)

const therapists = ref<Therapist[]>([
  {
    id: null,
    name: 'All Therapists',
  },
])

// ======================
// SUMMARY
// ======================

const summary = reactive({
  totalSessions: 0,
  completed: 0,
  scheduled: 0,
  alpha: 0,
})

// ======================
// TABLE
// ======================

const headers = [
  {
    title: 'Registration No.',
    key: 'registration_number',
    sortable: true,
  },
  {
    title: 'Child Name',
    key: 'child_name',
    sortable: true,
  },
  {
    title: 'Therapist',
    key: 'therapist_name',
    sortable: true,
  },
  {
    title: 'Therapy Date',
    key: 'therapy_date',
    sortable: true,
  },
  {
    title: 'Therapy Time',
    key: 'therapy_time',
    sortable: false,
  },
  {
    title: 'Status',
    key: 'status',
    sortable: true,
  },
]

const sessions = ref<TherapySession[]>([])
const totalItems = ref(0)
const loading = ref(false)

const table = reactive({
  page: 1,
  itemsPerPage: 10,
  sortBy: 'therapy_date',
  sortOrder: 'asc' as 'asc' | 'desc',
})

// ======================
// LOAD REPORT
// ======================

const loadReport = async () => {
  loading.value = true

  try {
    const params: Record<string, string | number> = {
      month: filters.month,
      year: filters.year,
      page: table.page,
      per_page: table.itemsPerPage,
      sort_by: table.sortBy,
      sort_order: table.sortOrder,
    }

    // null means All Therapists
    if (filters.therapistId !== null) {
      params.therapist_id = filters.therapistId
    }

    const response = await api.get('/reports/therapists', {
      params,
    })

    const data = response.data

    // ======================
    // SUMMARY
    // ======================

    summary.totalSessions = data.summary?.total_sessions ?? 0
    summary.completed = data.summary?.completed ?? 0
    summary.scheduled = data.summary?.scheduled ?? 0
    summary.alpha = data.summary?.alpha ?? 0

    // ======================
    // TABLE
    // ======================

    sessions.value = data.sessions?.data ?? []
    totalItems.value = data.sessions?.total ?? 0

    // ======================
    // THERAPIST OPTIONS
    // ======================

    therapists.value = [
      {
        id: null,
        name: 'All Therapists',
      },

      ...(data.therapists ?? []).map((therapist: Therapist) => ({
        id: therapist.id,

        name: therapist.status_id === 2 ? `${therapist.name} (Inactive)` : therapist.name,

        status_id: therapist.status_id,
      })),
    ]
  } catch (error: any) {
    console.error('Failed to load therapist report:', error)

    // 401 sudah ditangani global Axios interceptor
    if (error.response?.status !== 401) {
      snackbar.message = error.response?.data?.message ?? 'Failed to load therapist report.'

      snackbar.show = true
    }
  } finally {
    loading.value = false
  }
}

// ======================
// TABLE OPTIONS
// ======================

const handleTableOptions = (options: TableOptions) => {
  table.page = options.page
  table.itemsPerPage = options.itemsPerPage

  if (options.sortBy?.length) {
    table.sortBy = options.sortBy[0].key
    table.sortOrder = options.sortBy[0].order === 'desc' ? 'desc' : 'asc'
  } else {
    table.sortBy = 'therapy_date'
    table.sortOrder = 'asc'
  }

  loadReport()
}

// ======================
// FILTER FUNCTIONS
// ======================

const applyFilter = () => {
  table.page = 1

  loadReport()
}

const resetFilter = () => {
  filters.month = currentMonth
  filters.year = currentYear
  filters.therapistId = null

  table.page = 1
  table.sortBy = 'therapy_date'
  table.sortOrder = 'asc'

  loadReport()
}

// ======================
// EXPORT
// ======================

const showComingSoon = (type: string) => {
  snackbar.message = `${type} export will be available in a future update.`
  snackbar.show = true
}

// ======================
// FORMATTERS
// ======================

const formatDate = (date: string) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

const formatTime = (time: string) => {
  if (!time) return '-'

  return time.substring(0, 5)
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'green'

    case 'scheduled':
      return 'blue'

    case 'alpha':
      return 'red'

    default:
      return 'grey'
  }
}

// ======================
// SNACKBAR
// ======================

const snackbar = reactive({
  show: false,
  message: '',
})
</script>

<style scoped>
.therapist-report-table :deep(th) {
  white-space: nowrap;
}
</style>
