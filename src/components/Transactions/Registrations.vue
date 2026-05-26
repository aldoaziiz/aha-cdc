<template>
  <div class="registrations-content">
    <!-- Header -->
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Registrations</h1>

        <p class="text-body2 text-grey">Manage and view registration data</p>
      </div>
    </div>

    <!-- Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="1">
          <v-card flat>
            <!-- Search -->
            <template v-slot:text>
              <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              />
            </template>

            <!-- Data Table -->
            <v-data-table-server
              :headers="headers"
              :items="registrations"
              :items-length="totalItems"
              :loading="loading"
              :page="page"
              :items-per-page="itemsPerPage"
              @update:options="onOptionsChange"
            >
              <!-- CHILD -->
              <template v-slot:item.child="{ item }">
                <div>
                  <div class="font-weight-medium">
                    {{ item.child?.name }}
                  </div>
                </div>
              </template>

              <!-- BIRTH DATE -->
              <template v-slot:item.child.birth_date="{ item }">
                {{ formatDate(item.child?.birth_date) }}
              </template>

              <!-- AGE -->
              <template v-slot:item.age="{ item }">
                {{ calculateAge(item.child?.birth_date) }}
              </template>

              <!-- PROGRAM -->
              <template v-slot:item.program="{ item }">
                {{ item.program?.name || '-' }}
              </template>

              <!-- REGISTRATION DATE -->
              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>

              <!-- PAYMENT STATUS -->
              <template v-slot:item.payment_status.id="{ item }">
                <v-chip
                  :color="getStatusColor(item.payment_status?.id)"
                  variant="tonal"
                  size="small"
                  class="mb-1"
                >
                  {{ item.payment_status?.name || '-' }}
                </v-chip>
              </template>

              <!-- ACTION -->
              <template v-slot:item.actions="{ item }">
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn v-bind="props" size="small" color="white">
                      Action

                      <v-icon right>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item @click="schedule(item)">
                      <v-list-item-title>View Schedule</v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="editRegistration(item)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table-server>
          </v-card>
        </v-card>
      </v-col>
    </v-row>

    <!-- PAGE ACTION LOADING -->
    <v-dialog v-model="pageActionLoading" persistent fullscreen scrim="black">
      <div class="d-flex flex-column align-center justify-center h-100">
        <v-card rounded="xl" class="pa-8 text-center" width="320">
          <v-progress-circular indeterminate color="primary" size="56" width="5" />

          <div class="text-h6 font-weight-medium mt-6">
            {{ pageActionText }}
          </div>

          <div class="text-body-2 text-medium-emphasis mt-2">Please wait a moment</div>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

import api from '@/services/api'

import debounce from 'lodash/debounce'

import { useRouter } from 'vue-router'

const router = useRouter()

const registrations = ref([])

const search = ref('')

const loading = ref(false)

const page = ref(1)

const itemsPerPage = ref(10)

const totalItems = ref(0)

const sortBy = ref([])

const initialized = ref(false)

const pageActionLoading = ref(false)

const pageActionText = ref('Loading...')

// ======================
// SEARCH
// ======================

const debouncedFetch = debounce(() => {
  page.value = 1

  fetchData()
}, 500)

watch(search, () => {
  debouncedFetch()
})

// ======================
// HEADERS
// ======================

const headers = [
  {
    title: 'Registration No.',
    key: 'registration_number',
  },

  {
    title: 'Registration Date',
    key: 'created_at',
  },

  {
    title: 'Child Name',
    key: 'child',
  },

  {
    title: 'Program',
    key: 'program',
  },

  {
    title: 'Payment Status',
    key: 'payment_status.id',
  },

  {
    title: '',
    key: 'actions',
    sortable: false,
    align: 'center',
  },
]

// ======================
// FETCH DATA
// ======================

const fetchData = async () => {
  loading.value = true

  try {
    const res = await api.get('/registrations', {
      params: {
        page: page.value,

        per_page: itemsPerPage.value,

        search: search.value,

        sort_by: sortBy.value[0]?.key,

        sort_order: sortBy.value[0]?.order,
      },
    })

    registrations.value = res.data.data

    totalItems.value = res.data.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// ======================
// FORMAT DATE
// ======================

const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('en-ID', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

// ======================
// AGE
// ======================

const calculateAge = (birthDate) => {
  if (!birthDate) return '-'

  const today = new Date()

  const birth = new Date(birthDate)

  let years = today.getFullYear() - birth.getFullYear()

  let months = today.getMonth() - birth.getMonth()

  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--

    months += 12
  }

  return `${years} yr, ${months} mo`
}

// ======================
// STATUS COLOR
// ======================

const getStatusColor = (id) => {
  if (id === 1) return 'warning'

  if (id === 2) return 'grey'

  if (id === 3) return 'green'

  return 'grey'
}

// ======================
// VIEW SCHEDULE
// ======================

const schedule = async (item) => {
  pageActionText.value = 'Opening Schedule...'

  pageActionLoading.value = true

  try {
    await router.push(`/registrations/${item.id}/schedule`)
  } finally {
    setTimeout(() => {
      pageActionLoading.value = false
    }, 300)
  }
}

// ======================
// EDIT
// ======================

const editRegistration = async (item) => {
  const isPaid = item.payment_status?.name?.toLowerCase() === 'paid'

  if (isPaid) {
    const confirmed = confirm(
      'This registration has already been paid. Do you want to continue editing?',
    )

    if (!confirmed) {
      return
    }
  }

  try {
    pageActionText.value = 'Opening Registration...'

    pageActionLoading.value = true

    await router.push(`/registrations/${item.id}/edit`)
  } finally {
    setTimeout(() => {
      pageActionLoading.value = false
    }, 300)
  }
}

// ======================
// TABLE OPTIONS
// ======================

const onOptionsChange = (options) => {
  // ======================
  // PREVENT INITIAL DUPLICATE
  // ======================

  if (!initialized.value) {
    initialized.value = true
  } else {
    const samePage = page.value === options.page

    const sameItems = itemsPerPage.value === options.itemsPerPage

    const sameSort = JSON.stringify(sortBy.value) === JSON.stringify(options.sortBy)

    if (samePage && sameItems && sameSort) {
      return
    }
  }

  page.value = options.page

  itemsPerPage.value = options.itemsPerPage

  sortBy.value = options.sortBy

  fetchData()
}

// ======================
// CLEANUP
// ======================

onUnmounted(() => {
  debouncedFetch.cancel()
})
</script>

<style scoped>
.registrations-content {
  width: 100%;
}

.page-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 24px;
}
</style>
