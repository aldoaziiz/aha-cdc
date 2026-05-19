<template>
  <div class="registrations-content">
    <!-- Header -->
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Registrations</h1>
        <p class="text-body2 text-grey">
          Manage and view registration data
        </p>
      </div>
    </div>

    <!-- Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="1">
          <v-card flat>

            <!-- Search -->
            <template v-slot:text>
              <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                hide-details single-line />
            </template>

            <!-- Data Table -->
            <v-data-table-server :headers="headers" :items="registrations" :items-length="totalItems" :loading="loading"
              :page="page" :items-per-page="itemsPerPage" @update:options="onOptionsChange" <!-- CHILD -->
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

              <!-- GUARDIAN -->
              <!-- <template v-slot:item.guardian="{ item }">
                <div v-if="item.child?.guardians?.length">
                  <div v-for="g in item.child.guardians" :key="g.id" class="mb-1">
                    <div class="font-weight-medium">
                      {{ g.name }}
                    </div>
                    <div class="text-caption text-blue">
                      {{ g.guardian_role?.name || '-' }}
                    </div>
                    <div class="text-caption text-grey">
                      {{ g.phone }}
                    </div>
                  </div>
                </div>
                <div v-else>-</div>
              </template> -->

              <!-- REGISTRATION DATE -->
              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>

              <!-- PAYMENT STATUS -->
              <template v-slot:item.payment_status.id="{ item }">
                <v-chip :color="getStatusColor(item.payment_status?.id)" variant="tonal" size="small" class="mb-1">
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
                      <v-list-item-title>
                        View Schedule
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="edit(item)">
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import debounce from 'lodash/debounce'
import { onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const registrations = ref([])
const search = ref('')
const loading = ref(false)

const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const sortBy = ref([])

const debouncedFetch = debounce(() => {
  page.value = 1 // 🔥 reset ke halaman 1 saat search
  fetchData()
}, 500)

watch(search, () => {
  debouncedFetch()
})

const schedule = (item) => {
  router.push(`/registrations/${item.id}/schedule`)
}

const headers = [
  { title: 'Registration No.', key: 'registration_number' },
  { title: 'Registration Date', key: 'created_at' },
  { title: 'Child Name', key: 'child' },
  { title: 'Program', key: 'program' },
  // { title: 'Guardian', key: 'guardian' },
  { title: 'Payment Status', key: 'payment_status.id' },
  { title: '', key: 'actions', sortable: false, align: 'center' }
]

// FETCH DATA
const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/registrations', {
      params: {
        page: page.value,
        per_page: itemsPerPage.value,
        search: search.value,
        sort_by: sortBy.value[0]?.key,
        sort_order: sortBy.value[0]?.order
      }
    })

    registrations.value = res.data.data
    totalItems.value = res.data.total

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// FORMAT DATE
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-ID', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

// AGE
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

// ACTION

const edit = (item) => {
  router.push(`/registrations/${item.id}/edit`)
}

const getStatusColor = (id) => {
  if (id === 1) return 'warning' // Unpaid (kuning)
  if (id === 2) return 'grey'    // Waiting
  if (id === 3) return 'green'   // Paid
  return 'grey'
}

const onOptionsChange = (options) => {
  page.value = options.page
  itemsPerPage.value = options.itemsPerPage
  sortBy.value = options.sortBy
  fetchData()
}

onUnmounted(() => {
  debouncedFetch.cancel()
})

onMounted(fetchData)
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