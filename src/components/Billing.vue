<template>
  <div class="billing-content">
    <!-- Header -->
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Billing</h1>
        <p class="text-body2 text-grey">
          Manage and view billing data
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
            <v-data-table :headers="headers" :items="billing" :search="search" :loading="loading">

              <!-- CHILD -->
              <template v-slot:item.child="{ item }">
                <div>
                  <div class="font-weight-medium">
                    {{ item.child?.name }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ formatDate(item.child?.birth_date) }}
                  </div>
                </div>
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
              <template v-slot:item.guardian="{ item }">
                <div v-if="item.child?.guardians?.length">
                  <div v-for="g in item.child.guardians" :key="g.id" class="mb-1">
                    <div class="font-weight-medium">
                      {{ g.name }}
                      <span class="text-caption text-grey">
                        ({{ g.guardian_role?.name || '-' }})
                      </span>
                    </div>
                    <div class="text-caption text-grey">
                      {{ g.phone }}
                    </div>
                  </div>
                </div>
                <div v-else>-</div>
              </template>

              <!-- REGISTRATION DATE -->
              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>

              <!-- PAYMENT STATUS -->
              <template v-slot:item.payment_status.id="{ item }">
                <div class="d-flex flex-column align-center">

                  <!-- STATUS -->
                  <v-chip :color="getStatusColor(item.payment_status?.id)" variant="tonal" size="small" class="mb-1">
                    {{ item.payment_status?.name || '-' }}
                  </v-chip>

                  <!-- RECEIPT LINK -->
                  <v-btn v-if="item.payment_status?.id === 2" variant="text" density="compact" size="small"
                    class="pa-0 text-primary" @click="previewReceipt(item)">
                    View Receipt
                  </v-btn>

                </div>
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
                    <v-list-item @click="createInvoice(item)">
                      <v-list-item-title>Invoice</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="item.payment_status?.id === 2" @click="markAsPaid(item)">
                      <v-list-item-title class="text-green">
                        Mark as Paid
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

    <v-dialog v-model="receiptDialog" max-width="500">
      <v-card>
        <v-card-title>Payment Receipt</v-card-title>

        <v-card-text>
          <v-img :src="receiptUrl" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="receiptDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const billing = ref([])
const search = ref('')
const loading = ref(false)
const receiptDialog = ref(false)
const receiptUrl = ref('')

const headers = [
  { title: 'Reg. Number', key: 'registration_number' },
  { title: 'Child', key: 'child' },
  { title: 'Age', key: 'age' },
  { title: 'Program', key: 'program' },
  { title: 'Guardian', key: 'guardian' },
  { title: 'Registration Date', key: 'created_at' },
  { title: 'Payment Status', key: 'payment_status.id' },
  { title: '', key: 'actions', sortable: false, align: 'center' }
]


// FETCH DATA
const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/registrations')
    billing.value = res.data.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// payment status color
const getStatusColor = (id) => {
  if (id === 1) return 'warning' // Unpaid (kuning)
  if (id === 2) return 'grey'    // Waiting
  if (id === 3) return 'green'   // Paid
  return 'grey'
}

// FORMAT DATE
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
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
const createInvoice = (item) => {
  router.push(`/invoices/${item.id}`)
}

const previewReceipt = (item) => {
  receiptUrl.value = getReceiptUrl(item.payment_receipt)
  receiptDialog.value = true
}

const getReceiptUrl = (path) => {
  return `http://localhost:8000/storage/${path}`
}

const markAsPaid = async (item) => {

  if (!confirm('Are you sure you want to mark this as paid?')) return

  try {
    await api.put(`/registrations/${item.id}/mark-paid`)

    fetchData()

  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchData)
</script>

<style scoped>
.billing-content {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
</style>