<template>
  <v-container fluid class="pa-6">
    <!-- ====================== -->
    <!-- HEADER -->
    <!-- ====================== -->

    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-1">Therapist Activity Summary</h1>

      <div class="text-body-2 text-medium-emphasis">
        Monthly therapist activity totals and action counts.
      </div>
    </div>

    <!-- ====================== -->
    <!-- FILTER -->
    <!-- ====================== -->

    <v-card rounded="lg" elevation="1" class="pa-4 mb-6">
      <div class="text-subtitle-1 font-weight-medium mb-4">Report Filter</div>

      <v-row>
        <!-- YEAR -->
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

        <!-- START MONTH -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="filters.startMonth"
            :items="months"
            item-title="title"
            item-value="value"
            label="Start Month"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <!-- END MONTH -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="filters.endMonth"
            :items="months"
            item-title="title"
            item-value="value"
            label="End Month"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <!-- BUTTONS -->
        <v-col cols="12" md="4" class="d-flex align-center ga-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-filter-outline"
            :loading="loading"
            @click="applyFilter"
          >
            Apply Filter
          </v-btn>

          <v-btn variant="text" :disabled="loading" @click="resetFilter">Reset</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- ====================== -->
    <!-- TABLE -->
    <!-- ====================== -->

    <v-card rounded="lg" elevation="1">
      <div class="pa-5">
        <div class="text-h6 font-weight-medium">Activity Summary</div>

        <div class="text-body-2 text-medium-emphasis">Activity totals by month and therapist.</div>
      </div>

      <v-divider />

      <div class="table-wrapper">
        <v-data-table
          :headers="headers"
          :items="rows"
          :loading="loading"
          :items-per-page="25"
          :items-per-page-options="[10, 25, 50, 100]"
          class="activity-summary-table"
        >
          <!-- MONTH -->
          <template #item.month_name="{ item }">
            <span class="font-weight-medium">
              {{ item.month_name }}
            </span>
          </template>

          <!-- PATIENTS -->
          <template #item.patients="{ item }">
            {{ item.patients }}
          </template>

          <!-- SESSIONS -->
          <template #item.sessions="{ item }">
            {{ item.sessions }}
          </template>

          <!-- EMPTY -->
          <template #no-data>
            <div class="py-12 text-center">
              <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-table-off</v-icon>

              <div class="text-subtitle-1 font-weight-medium">No activity data found</div>

              <div class="text-body-2 text-medium-emphasis mt-1">
                There are no activities for the selected report period.
              </div>
            </div>
          </template>
        </v-data-table>
      </div>
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
import { computed, onMounted, reactive, ref } from 'vue'

import api from '@/services/api'

// ======================
// TYPES
// ======================

interface ActionType {
  id: number
  name: string
}

interface ApiReportRow {
  month_number: number
  month_name: string

  therapist_id: number
  therapist_name: string

  patients: number
  sessions: number

  actions: Record<string, number>
}

interface ReportRow {
  month_number: number
  month_name: string

  therapist_id: number
  therapist_name: string

  patients: number
  sessions: number

  [key: string]: string | number
}

// ======================
// CURRENT DATE
// ======================

const currentDate = new Date()

const currentYear = currentDate.getFullYear()

// ======================
// FILTER
// ======================

const filters = reactive({
  year: currentYear,

  startMonth: 1,

  endMonth: 12,
})

const months = [
  {
    title: 'January',
    value: 1,
  },
  {
    title: 'February',
    value: 2,
  },
  {
    title: 'March',
    value: 3,
  },
  {
    title: 'April',
    value: 4,
  },
  {
    title: 'May',
    value: 5,
  },
  {
    title: 'June',
    value: 6,
  },
  {
    title: 'July',
    value: 7,
  },
  {
    title: 'August',
    value: 8,
  },
  {
    title: 'September',
    value: 9,
  },
  {
    title: 'October',
    value: 10,
  },
  {
    title: 'November',
    value: 11,
  },
  {
    title: 'December',
    value: 12,
  },
]

const years = Array.from(
  {
    length: 6,
  },

  (_, index) => currentYear - 4 + index,
)

// ======================
// STATE
// ======================

const loading = ref(false)

const actionTypes = ref<ActionType[]>([])

const rows = ref<ReportRow[]>([])

// ======================
// HEADERS
// ======================

const headers = computed(() => {
  const baseHeaders = [
    {
      title: 'Month',
      key: 'month_name',
      sortable: true,
    },

    {
      title: 'Therapist',
      key: 'therapist_name',
      sortable: true,
    },

    {
      title: 'Patients',
      key: 'patients',
      sortable: true,
      align: 'end' as const,
    },

    {
      title: 'Sessions',
      key: 'sessions',
      sortable: true,
      align: 'end' as const,
    },
  ]

  const actionHeaders = actionTypes.value.map((actionType) => ({
    title: actionType.name,

    key: `action_${actionType.id}`,

    sortable: true,

    align: 'end' as const,
  }))

  return [...baseHeaders, ...actionHeaders]
})

// ======================
// LOAD REPORT
// ======================

const loadReport = async () => {
  if (filters.startMonth > filters.endMonth) {
    snackbar.message = 'Start month cannot be greater than end month.'

    snackbar.show = true

    return
  }

  loading.value = true

  try {
    const response = await api.get('/reports/activity-summary', {
      params: {
        year: filters.year,

        start_month: filters.startMonth,

        end_month: filters.endMonth,
      },
    })

    const data = response.data

    actionTypes.value = data.action_types ?? []

    rows.value = (data.data ?? []).map((row: ApiReportRow) => {
      const tableRow: ReportRow = {
        month_number: row.month_number,

        month_name: row.month_name,

        therapist_id: row.therapist_id,

        therapist_name: row.therapist_name,

        patients: row.patients ?? 0,

        sessions: row.sessions ?? 0,
      }

      actionTypes.value.forEach((actionType) => {
        tableRow[`action_${actionType.id}`] = row.actions?.[String(actionType.id)] ?? 0
      })

      return tableRow
    })
  } catch (error: any) {
    console.error('Failed to load activity summary report:', error)

    if (error.response?.status !== 401) {
      snackbar.message = error.response?.data?.message ?? 'Failed to load activity summary report.'

      snackbar.show = true
    }
  } finally {
    loading.value = false
  }
}

// ======================
// FILTER FUNCTIONS
// ======================

const applyFilter = () => {
  loadReport()
}

const resetFilter = () => {
  filters.year = currentYear

  filters.startMonth = 1

  filters.endMonth = 12

  loadReport()
}

// ======================
// SNACKBAR
// ======================

const snackbar = reactive({
  show: false,

  message: '',
})

// ======================
// INIT
// ======================

onMounted(() => {
  loadReport()
})
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.activity-summary-table {
  min-width: 760px;
}

.activity-summary-table :deep(th) {
  white-space: nowrap;
}

.activity-summary-table :deep(td) {
  white-space: nowrap;
}
</style>
