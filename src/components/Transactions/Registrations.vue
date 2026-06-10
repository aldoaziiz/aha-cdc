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
                    <v-list-item @click="openDetails(item)">
                      <v-list-item-title>Details</v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      v-if="Number(item.payment_status?.id) === 1"
                      @click="editRegistration(item)"
                    >
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="schedule(item)">
                      <v-list-item-title>Schedule</v-list-item-title>
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

  <v-dialog v-model="detailsDialog" max-width="900" scrollable>
    <v-card rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h6 font-weight-bold">Registration Details</div>

        <v-btn icon variant="text" @click="detailsDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- LOADING -->
      <v-card-text v-if="detailsLoading" class="py-8 d-flex justify-center">
        <v-progress-circular indeterminate color="primary" size="48" />
      </v-card-text>

      <!-- CONTENT -->
      <v-card-text v-else-if="selectedRegistration" class="py-6">
        <!-- Registration -->
        <h3 class="text-subtitle-1 font-weight-bold mb-4">Registration Information</h3>

        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <div class="detail-label">Registration No.</div>
            <div class="detail-value">
              {{ selectedRegistration.registration_number }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-label">Registration Date</div>
            <div class="detail-value">
              {{ formatDate(selectedRegistration.created_at) }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-label">Clinic</div>
            <div class="detail-value">
              {{ selectedRegistration.clinic?.name || '-' }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-label">Payer</div>
            <div class="detail-value">
              {{ selectedRegistration.payer?.name || '-' }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-label">Problem</div>
            <div class="detail-value">
              {{ selectedRegistration.complaint || '-' }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-label">Payment Status</div>

            <v-chip :color="getStatusColor(selectedRegistration.payment_status?.id)" size="small">
              {{ selectedRegistration.payment_status?.name }}
            </v-chip>
          </v-col>
        </v-row>

        <v-divider class="mb-6" />

        <!-- Child -->
        <h3 class="text-subtitle-1 font-weight-bold mb-4">Child Information</h3>

        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <div class="detail-label">Child Name</div>
            <div class="detail-value">
              {{ selectedRegistration.child?.name || '-' }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-label">Birth Date</div>
            <div class="detail-value">
              {{ formatDate(selectedRegistration.child?.birth_date) }}
            </div>
          </v-col>

          <v-col cols="12">
            <div class="detail-label mb-3">Guardians</div>

            <div
              v-for="guardian in selectedRegistration.child?.guardians || []"
              :key="guardian.id"
              class="mb-4"
            >
              <div class="detail-value">
                {{ guardian.name }}
              </div>

              <div class="text-light-blue text-body-2">
                {{ guardian.guardian_role?.name || '-' }}
              </div>

              <div class="text-medium-emphasis">
                {{ guardian.phone || '-' }}
              </div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="mb-6" />

        <!-- Programs -->
        <h3 class="text-subtitle-1 font-weight-bold mb-4">Programs</h3>

        <v-list density="compact">
          <v-list-item v-for="program in selectedRegistration.programs" :key="program.id">
            <template #append>
              {{ formatCurrency(program.price) }}
            </template>

            <v-list-item-title>
              {{ program.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />

        <div class="d-flex justify-space-between font-weight-bold text-h6">
          <span>Total</span>

          <span>
            {{ formatCurrency(calculateTotal(selectedRegistration.programs)) }}
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
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

const detailsDialog = ref(false)
const detailsLoading = ref(false)
const selectedRegistration = ref(null)

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

const openDetails = async (item) => {
  detailsDialog.value = true
  detailsLoading.value = true
  selectedRegistration.value = null

  try {
    const res = await api.get(`/registrations/${item.id}`)

    selectedRegistration.value = res.data.data
  } catch (err) {
    console.error('Error loading registration details:', err)
  } finally {
    detailsLoading.value = false
  }
}

const calculateTotal = (programs = []) => {
  return programs.reduce((total, program) => total + Number(program.price || 0), 0)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(Number(value || 0))
}

// ======================
// EDIT
// ======================

const editRegistration = async (item) => {
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
.detail-label {
  font-size: 12px;
  color: rgb(120, 120, 120);
  margin-bottom: 4px;
}

.detail-value {
  font-size: 15px;
  font-weight: 500;
  word-break: break-word;
}

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
