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
                            <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify"
                                variant="outlined" hide-details single-line>
                            </v-text-field>
                        </template>
                        <v-data-table :headers="headers" :items="children" :search="search" :loading="loading">
                            <template v-slot:item.birth_date="{ item }">
                                {{ formatDate(item.birth_date) }}
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn icon="mdi-pencil" size="small" color="primary" variant="text"
                                    @click="editChild(item)" 
                                />

                                <v-btn icon="mdi-delete" size="small" color="error" variant="text"
                                    @click="deleteChild(item.id)" 
                                />
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

const pageTitle = 'Children'
const pageSubtitle = 'Manage and view information about children'
const children = ref([])
const search = ref('')
const loading = ref(false)

const headers = [
    { title: 'Nama', key: 'name' },
    { title: 'Tanggal Lahir', key: 'birth_date' },
    { title: 'Gender', key: 'gender' },
    { title: 'Orang Tua', key: 'parent_name' },
    { title: 'Telepon', key: 'phone' },
    { title: 'Alamat', key: 'address' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
]

const fetchChildren = async () => {
    loading.value = true
    try {
        const response = await api.get('/children')
        children.value = response.data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const formatDate = (date) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

const editChild = (item) => {
  console.log('Edit:', item)
  // nanti kita buka dialog edit di sini
}

const deleteChild = async (id) => {
  if (!confirm('Yakin mau hapus data ini?')) return

  try {
    await api.delete(`/children/${id}`)
    fetchChildren() // refresh data
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchChildren)
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