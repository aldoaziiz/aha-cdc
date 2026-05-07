<template>
  <div class="guardians-content">
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

            <v-data-table-server :headers="headers" :items="guardians" :items-length="totalItems" :loading="loading"
              :page="page" :items-per-page="itemsPerPage" @update:options="onOptionsChange">

              <template v-slot:item.status="{ item }">
                <v-chip size="small" :color="item.status?.id === 1 ? 'green' : 'grey'">
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
                    <v-list-item @click="editGuardian(item)">
                      <v-list-item-title>
                        ✏️ Edit
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteGuardian(item.id)">
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

const pageTitle = 'Guardians'
const pageSubtitle = 'Manage and view information about guardians'

const guardians = ref([])
const search = ref('')
const loading = ref(false)

const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

const headers = [
  { title: 'ID No', key: 'id_number' },
  { title: 'Name', key: 'name' },
  { title: 'Address', key: 'address' },
  { title: 'Phone', key: 'phone' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, align: 'center' }
]

const fetchData = async () => {
  loading.value = true

  try {
    const res = await api.get('/guardians', {
      params: {
        page: page.value,
        per_page: itemsPerPage.value,
        search: search.value
      }
    })

    guardians.value = res.data.data
    totalItems.value = res.data.total

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const debouncedFetch = debounce(() => {
  page.value = 1
  fetchData()
}, 500)

watch(search, () => {
  debouncedFetch()
})

onUnmounted(() => {
  debouncedFetch.cancel()
})

const editGuardian = (item) => {
  console.log('Edit:', item)
  // nanti kita buka dialog edit di sini
}

const deleteGuardian = async (id) => {
  if (!confirm('Yakin mau hapus data ini?')) return

  try {
    await api.delete(`/guardians/${id}`)
    fetchData() // refresh data
  } catch (error) {
    console.error(error)
  }
}

const toggleStatus = async (item) => {
  const isActive = Number(item.status?.id) === 1

  if (!confirm(`Yakin mau ${isActive ? 'nonaktifkan' : 'aktifkan'} data ini?`)) return

  try {
    await api.put(`/guardians/${item.id}`, {
      status_id: isActive ? 2 : 1
    })

    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const onOptionsChange = (options) => {
  page.value = options.page
  itemsPerPage.value = options.itemsPerPage

  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.guardians-content {
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