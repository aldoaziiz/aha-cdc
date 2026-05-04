<template>
  <div class="invoice-content">
    <v-card elevation="1" class="pa-6">

      <!-- HEADER -->
      <div class="d-flex justify-space-between mb-6">
        <div>
          <h2 class="text-h5 font-weight-bold">Invoice</h2>
          <div class="text-caption text-grey">
            AHA! Child Development Center
          </div>
        </div>

        <v-chip :color="statusColor" variant="tonal">
          {{ billing.payment_status?.name }}
        </v-chip>
      </div>

      <!-- INFO -->
      <div><strong>Invoice No:</strong> {{ invoiceNumber }}</div>
      <div><strong>Date:</strong> {{ formatDate(todayDate) }}</div>

      <!-- CHILD -->
      <v-divider class="my-4"></v-divider>
      <div class="text-subtitle-1 font-weight-medium mb-2">Patient Info</div>

      <div><strong>Registration No:</strong> {{ billing.registration_number }}</div>
      <div><strong>Registration Date:</strong> {{ formatDate(billing.created_at) }}</div>
      <div><strong>Name:</strong> {{ billing.child?.name }}</div>
      <div><strong>Age:</strong> {{ age }}</div>

      <div class="mt-2"><strong>Guardian(s):</strong>
        <div v-for="g in billing.child?.guardians || []" :key="g.name">
          <strong>{{ g.name }}</strong>
          ({{ g.guardian_role?.name }}) - {{ g.phone }}
        </div>
      </div>

      <!-- ITEM -->
      <v-divider class="my-4"></v-divider>
      <div class="text-subtitle-1 font-weight-medium mb-2">Charges</div>

      <v-table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ billing.program?.name }}</td>
            <td class="text-right">
              {{ formatCurrency(billing.program?.price) }}
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- TOTAL -->
      <div class="text-right mt-4 text-h6 font-weight-bold">
        Total: {{ formatCurrency(billing.program?.price) }}
      </div>

      <!-- ACTION -->
      <div class="no-print">
        <div class="d-flex justify-end mt-6">
          <v-btn color="warning" class="mr-2" @click="triggerUpload" :loading="uploading"
            :disabled="uploading || billing.payment_status?.id === 3">
            {{ billing.payment_receipt ? 'Replace Receipt' : 'Upload Receipt' }}
          </v-btn>

          <input type="file" ref="fileInput" accept="image/*" hidden @change="handleFile" />
          <v-btn color="primary" class="mr-2" @click="printInvoice">
            Print
          </v-btn>
          <v-btn variant="outlined" @click="$router.back()">
            Back
          </v-btn>
        </div>

        <!-- PAYMENT RECEIPT -->
        <v-divider class="my-4"></v-divider>
        <div class="text-subtitle-1 font-weight-medium mb-2">
          Payment Receipt
        </div>

        <div v-if="billing.payment_receipt">
          <v-img :src="getReceiptUrl(billing.payment_receipt)" max-width="300" />
        </div>

        <div v-else class="text-grey">
          No receipt uploaded
        </div>
      </div>

      <v-snackbar v-model="snackbar" :color="snackbarColor" location="top right" timeout="3000">
        {{ snackbarText }}
      </v-snackbar>

    </v-card>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import imageCompression from 'browser-image-compression'

const route = useRoute()
const billing = ref({})
const todayDate = new Date()
const fileInput = ref(null)
const uploading = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const getReceiptUrl = (path) => {
  return `http://localhost:8000/storage/${path}`
}

const triggerUpload = () => {
  fileInput.value.click()
}

const fetchData = async () => {
  const res = await api.get(`/registrations/${route.params.id}`)
  billing.value = res.data.data
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(val || 0)
}

const invoiceNumber = computed(() => {
  return billing.value.registration_number?.replace('REG', 'INV')
})

const age = computed(() => {
  if (!billing.value.child?.birth_date) return '-'

  const birth = new Date(billing.value.child.birth_date)
  const today = new Date()

  let y = today.getFullYear() - birth.getFullYear()
  let m = today.getMonth() - birth.getMonth()

  if (m < 0) {
    y--
    m += 12
  }

  return `${y} yr, ${m} mo`
})

const statusColor = computed(() => {
  const id = billing.value.payment_status?.id
  if (id === 1) return 'warning'
  if (id === 2) return 'grey'
  if (id === 3) return 'green'
  return 'grey'
})

const printInvoice = () => {
  window.print()
}

const handleFile = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    uploading.value = true

    const compressedBlob = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true
    })

    const compressedFile = new File(
      [compressedBlob],
      file.name,
      { type: compressedBlob.type }
    )

    const formData = new FormData()
    formData.append('file', compressedFile)

    await api.post(
      `/registrations/${billing.value.id}/upload-receipt`,
      formData,
      { headers: { 'Content-Type': undefined } }
    )

    // 🔥 SUCCESS
    snackbarText.value = 'Receipt uploaded successfully'
    snackbarColor.value = 'success'
    snackbar.value = true

    await fetchData()

  } catch (err) {
    console.log(err.response?.data)

    // 🔥 ERROR
    snackbarText.value = 'Upload failed. Please try again.'
    snackbarColor.value = 'error'
    snackbar.value = true

  } finally {
    uploading.value = false
  }
}

onMounted(fetchData)
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
}

.invoice-content {
  max-width: 800px;
  margin: auto;
}
</style>