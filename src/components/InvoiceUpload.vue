<template>
  <div class="pa-4">
    <v-card max-width="700" class="mx-auto rounded-xl">
      <v-card-title>Invoice Upload</v-card-title>

      <v-card-text v-if="invoice">
        <div class="mb-4">
          <div class="text-caption">Child</div>

          <div class="font-weight-bold">
            {{ invoice.child?.name }}
          </div>
        </div>

        <div class="mb-4">
          <div class="text-caption">Program</div>

          <div class="font-weight-bold">
            {{ invoice.program?.name }}
          </div>
        </div>

        <v-file-input
          v-model="receipt"
          label="Upload Receipt"
          accept="image/*"
          variant="outlined"
        />
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn color="primary" :loading="loading" @click="uploadReceipt">Upload Receipt</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import api from '@/services/api'

// ======================
// ROUTE
// ======================

const route = useRoute()

const token = route.params.token

// ======================
// STATE
// ======================

const loading = ref(false)

const invoice = ref(null)

const receipt = ref(null)

// ======================
// FETCH
// ======================

const fetchInvoice = async () => {
  try {
    const res = await api.get(`/invoice-upload/${token}`)

    invoice.value = res.data.data
  } catch (err) {
    console.error(err)

    alert('Invoice not found')
  }
}

// ======================
// UPLOAD
// ======================

const uploadReceipt = async () => {
  if (!receipt.value) {
    alert('Please select receipt')

    return
  }

  try {
    loading.value = true

    const payload = new FormData()

    payload.append('receipt', receipt.value)

    await api.post(
      `/invoice-upload/${token}`,

      payload,

      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    alert('Receipt uploaded successfully')
  } catch (err) {
    console.error(err)

    alert(err.response?.data?.message || 'Upload failed')
  } finally {
    loading.value = false
  }
}

// ======================
// INIT
// ======================

onMounted(() => {
  fetchInvoice()
})
</script>
