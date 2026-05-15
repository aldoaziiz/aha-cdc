<template>
  <div class="therapy-sessions-page">

    <!-- PAGE HEADER -->
    <div class="d-flex justify-space-between align-center mb-6">

      <div>
        <h1 class="text-h4 font-weight-bold">
          Therapy Sessions
        </h1>

        <div class="text-body-2 text-grey">
          Therapy operational schedules
        </div>
      </div>

    </div>

    <!-- FILTER CARD -->
    <v-card elevation="1" class="mb-4 rounded-lg">
      <v-card-text>

        <v-row>

          <!-- SEARCH -->
          <v-col cols="12" md="4">
            <v-text-field v-model="search" label="Search Child" prepend-inner-icon="mdi-magnify" variant="outlined"
              density="comfortable" hide-details clearable />
          </v-col>

          <!-- DATE -->
          <v-col cols="12" md="3">
            <v-text-field v-model="filters.date" label="Date" type="date" variant="outlined" density="comfortable"
              hide-details />
          </v-col>

          <!-- THERAPIST -->
          <v-col cols="12" md="3">
            <v-select v-model="filters.therapist_id" :items="therapists" item-title="name" item-value="id"
              label="Therapist" variant="outlined" density="comfortable" hide-details clearable />
          </v-col>

          <!-- RESET -->
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn block variant="tonal" @click="resetFilters">
              Reset
            </v-btn>
          </v-col>

        </v-row>

      </v-card-text>
    </v-card>

    <!-- TABLE -->
    <v-card elevation="1" class="rounded-lg">

      <v-data-table-server :headers="headers" :items="sessions" :items-length="totalItems" :loading="loading"
        :page="page" :items-per-page="itemsPerPage" loading-text="Loading therapy sessions..."
        @update:options="onOptionsChange">

        <!-- DATE -->
        <template v-slot:item.therapy_date="{ item }">
          {{ formatDate(item.therapy_date) }}
        </template>

        <!-- TIME -->
        <template v-slot:item.time="{ item }">

          {{
            item.start_time?.slice(0, 5)
          }}
          -
          {{
            item.end_time?.slice(0, 5)
          }}

        </template>

        <!-- CHILD -->
        <template v-slot:item.child="{ item }">

          <div>
            <div class="font-weight-medium">
              {{ item.registration?.child?.name || '-' }}
            </div>

            <div class="text-caption text-grey">
              {{ item.registration?.registration_number || '-' }}
            </div>
          </div>

        </template>

        <!-- PROGRAM -->
        <template v-slot:item.program="{ item }">
          {{ item.registration?.program?.name || '-' }}
        </template>

        <!-- THERAPIST -->
        <template v-slot:item.therapist="{ item }">

          <div>
            <div class="font-weight-medium">
              {{ item.therapist?.name || '-' }}
            </div>

            <div v-if="item.therapist?.staff_role" class="text-caption text-grey">
              {{ item.therapist.staff_role.name }}
            </div>
          </div>

        </template>

        <!-- ROOM -->
        <template v-slot:item.room="{ item }">
          {{ item.room?.name || '-' }}
        </template>

        <!-- ACTION -->
        <template v-slot:item.actions="{ item }">

          <v-menu>

            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" color="white">
                Action
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list density="compact">

              <v-list-item @click="viewRegistration(item)">
                <v-list-item-title>
                  View Schedule
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="deleteSession(item)">
                <v-list-item-title class="text-error">
                  Delete
                </v-list-item-title>
              </v-list-item>

            </v-list>

          </v-menu>

        </template>

      </v-data-table-server>

    </v-card>

    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" location="top right" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>

  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  watch,
  onUnmounted
} from 'vue'

import { useRouter } from 'vue-router'

import debounce from 'lodash/debounce'

import api from '@/services/api'

// ======================
// ROUTER
// ======================

const router = useRouter()

// ======================
// STATE
// ======================

const sessions = ref([])
const therapists = ref([])

const loading = ref(false)

const search = ref('')

const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const filters = ref({
  date: '',
  therapist_id: null
})

// ======================
// TABLE
// ======================

const headers = [
  { title: 'Date', key: 'therapy_date' },
  { title: 'Time', key: 'time' },
  { title: 'Child', key: 'child' },
  { title: 'Program', key: 'program' },
  { title: 'Therapist', key: 'therapist' },
  { title: 'Room', key: 'room' },
  {
    title: '',
    key: 'actions',
    sortable: false,
    align: 'center'
  }
]

// ======================
// FETCH SESSIONS
// ======================

const fetchSessions = async () => {

  loading.value = true

  try {

    const res = await api.get('/therapy-sessions', {
      params: {
        page: page.value,
        per_page: itemsPerPage.value,

        search: search.value,

        therapy_date: filters.value.date,
        therapist_id: filters.value.therapist_id
      }
    })

    sessions.value = res.data.data
    totalItems.value = res.data.total

  } catch (err) {

    console.error(err)

  } finally {

    loading.value = false

  }
}

// ======================
// FETCH THERAPISTS
// ======================

const fetchTherapists = async () => {

  try {

    const res = await api.get('/staff', {
      params: {
        staff_role_id: 2,
        per_page: 100
      }
    })

    therapists.value = res.data.data

  } catch (err) {

    console.error(err)

  }
}

// ======================
// PAGINATION
// ======================

const onOptionsChange = (options) => {

  page.value = options.page
  itemsPerPage.value = options.itemsPerPage

  fetchSessions()
}

// ======================
// DEBOUNCE SEARCH
// ======================

const debouncedFetch = debounce(() => {

  page.value = 1
  fetchSessions()

}, 500)

watch(search, () => {
  debouncedFetch()
})

// ======================
// FILTER WATCH
// ======================

watch(filters, () => {

  page.value = 1
  fetchSessions()

}, {
  deep: true
})

onUnmounted(() => {
  debouncedFetch.cancel()
})

// ======================
// RESET FILTER
// ======================

const resetFilters = () => {

  search.value = ''

  filters.value = {
    date: '',
    therapist_id: null
  }

  fetchSessions()
}

// ======================
// FORMAT DATE
// ======================

const formatDate = (date) => {

  return new Date(date)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
}

// ======================
// VIEW REGISTRATION
// ======================

const viewRegistration = (item) => {

  router.push(
    `/registrations/${item.registration_id}/schedule`
  )
}

// ======================
// DELETE SESSION
// ======================

const deleteSession = async (item) => {

  if (!confirm('Delete this session?')) return

  try {

    await api.delete(
      `/therapy-sessions/${item.id}`
    )

    snackbarText.value = 'Session deleted'
    snackbarColor.value = 'success'
    snackbar.value = true

    fetchSessions()

  } catch (err) {

    snackbarText.value = 'Failed to delete session'
    snackbarColor.value = 'error'
    snackbar.value = true

  }
}

// ======================
// INIT
// ======================

onMounted(() => {

  fetchSessions()
  fetchTherapists()

})
</script>

<style scoped>
.therapy-sessions-page {
  width: 100%;
}
</style>