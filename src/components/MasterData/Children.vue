<template>
  <div class="children-content">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">{{ pageTitle }}</h1>
        <p class="text-body2 text-grey">{{ pageSubtitle }}</p>
      </div>
    </div>

    <!-- Data Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="1">
          <v-card flat>
            <template v-slot:text>
              <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                hide-details single-line>
              </v-text-field>
            </template>

            <v-data-table-server :headers="headers" :items="children" :items-length="totalItems" :loading="loading"
              :page="page" :items-per-page="itemsPerPage" @update:options="onOptionsChange">
              <template v-slot:item.birth_date="{ item }">
                <div>
                  <div>
                    {{ formatDate(item.birth_date) }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ calculateAgeDetail(item.birth_date) }}
                  </div>
                </div>
              </template>
              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip size="small" :color="Number(item.status_id) === 1 ? 'green' : 'grey'">
                  {{ item.status?.name || '-' }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn v-bind="props" size="small" color="white">
                      Action <v-icon right>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="editChild(item)">
                      <v-list-item-title>
                        ✏️ Edit
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteChild(item.id)">
                      <v-list-item-title>
                        🗑️ Delete
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="toggleStatus(item)">
                      <v-list-item-title>
                        {{ Number(item.status?.id) === 1 ? '🔴 Deactivate' : '🟢 Activate' }}
                      </v-list-item-title>
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
import { ref, onMounted, watch, onUnmounted } from 'vue'
import debounce from 'lodash/debounce'
import api from '@/services/api' // pakai axios instance kamu


const pageTitle = 'Children'
const pageSubtitle = 'Manage and view information about children'
const children = ref([])
const search = ref('')
const loading = ref(false)

const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

const headers = [
  { title: 'ID Number', key: 'id_number' },
  { title: 'Name', key: 'name' },
  { title: 'Birth Date', key: 'birth_date' },
  { title: 'Gender', key: 'gender' },
  { title: 'Enrollment Date', key: 'created_at' },
  { title: 'Address', key: 'address' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, align: 'center' }
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/children', {
      params: {
        page: page.value,
        per_page: itemsPerPage.value,
        search: search.value
      }
    })

    children.value = res.data.data
    totalItems.value = res.data.total

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

const editChild = (item) => {
  console.log('Edit:', item)
  // nanti kita buka dialog edit di sini
}

const deleteChild = async (id) => {
  if (!confirm('Are you sure you want to delete this child?')) return

  try {
    await api.delete(`/children/${id}`)
    fetchData() // refresh data
  } catch (error) {
    console.error(error)
  }
}

const calculateAgeDetail = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate + 'T00:00:00')

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()

  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--
    months += 12
  }

  return `${years} yr, ${months} mo`
}

const toggleStatus = async (item) => {
  const isActive = Number(item.status?.id) === 1

  if (!confirm(`Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this child?`)) return

  try {
    await api.put(`/children/${item.id}`, {
      status_id: isActive ? 2 : 1
    })

    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const debouncedFetch = debounce(() => {
  page.value = 1
  fetchData()
}, 500)

const onOptionsChange = (options) => {
  page.value = options.page
  itemsPerPage.value = options.itemsPerPage
  fetchData()
}

watch(search, () => {
  debouncedFetch()
})

onUnmounted(() => {
  debouncedFetch.cancel()
})

onMounted(fetchData)
</script>

<style scoped>
.children-content {
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