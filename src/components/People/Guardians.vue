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

            <v-data-table :headers="headers" :items="guardians" :search="search" :loading="loading">
              <template v-slot:item.name="{ item }">
                <div>
                  <div>
                    {{ item.name }}
                  </div>

                  <div class="text-caption text-grey">
                    Children:
                    {{ item.children_names?.length
                      ? item.children_names.join(', ')
                      : '-' }}
                  </div>
                </div>
              </template>
              <template v-slot:item.role="{ item }">
                {{ item.role?.name }}
              </template>
              <template v-slot:item.status_name="{ item }">
                <v-chip size="small" :color="item.status.code === 1 ? 'green' : 'grey'">
                  {{ item.status.name }}
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
                    <v-list-item @click="editParent(item)">
                      <v-list-item-title>
                        ✏️ Edit
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteParent(item.id)">
                      <v-list-item-title>
                        🗑️ Delete
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="toggleStatus(item)">
                      <v-list-item-title>
                        {{ Number(item.status.code) === 1 ? '🔴 Deactivate' : '🟢 Activate' }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>

          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api' // pakai axios instance kamu

const pageTitle = 'Guardians'
const pageSubtitle = 'Manage and view information about guardians'
const guardians = ref([])
const search = ref('')
const loading = ref(false)

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Phone', key: 'phone' },
  { title: "Role", key: 'role' },
  { title: 'Status', key: 'status_name' },
  { title: '', key: 'actions', sortable: false, align: 'center' }
]

const fetchGuardians = async () => {
  loading.value = true
  try {
    const response = await api.get('/guardians')
    guardians.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const editParent = (item) => {
  console.log('Edit:', item)
  // nanti kita buka dialog edit di sini
}

const deleteParent = async (id) => {
  if (!confirm('Yakin mau hapus data ini?')) return

  try {
    await api.delete(`/guardians/${id}`)
    fetchGuardians() // refresh data
  } catch (error) {
    console.error(error)
  }
}

const toggleStatus = async (item) => {
  const isActive = Number(item.status.code) === 1

  if (!confirm(`Yakin mau ${isActive ? 'nonaktifkan' : 'aktifkan'} data ini?`)) return

  try {
    await api.put(`/guardians/${item.id}`, {
      status_id: isActive ? 2 : 1
    })

    fetchGuardians()
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchGuardians)
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