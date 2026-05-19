<template>
  <div class="registration-edit-page">
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Edit Registration</h1>
        <p class="text-body-2 text-grey">Update registration information.</p>
      </div>

      <v-btn variant="tonal" prepend-icon="mdi-arrow-left" @click="goBack">
        Back
      </v-btn>
    </div>

    <v-card v-if="pageLoading" elevation="1" class="rounded-xl pa-8">
      <div class="d-flex justify-center align-center flex-column ga-4">
        <v-progress-circular indeterminate color="primary" size="48" />
        <div class="text-body-1 text-grey">Loading registration data...</div>
      </div>
    </v-card>

    <v-card v-else elevation="1" class="rounded-xl">
      <v-card-text>
        <!-- READ-ONLY SECTION -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-4">Registration Information</h3>
          <v-row>
            <!-- REGISTRATION NO -->
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="form.registration_number"
                label="Registration No."
                variant="outlined"
                readonly
              />
            </v-col>

            <!-- REGISTRATION DATE -->
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="formatDate(form.created_at)"
                label="Registration Date"
                variant="outlined"
                readonly
              />
            </v-col>

            <!-- CHILD NAME -->
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="form.child?.name || '-'"
                label="Child Name"
                variant="outlined"
                readonly
              />
            </v-col>

            <!-- PAYMENT STATUS -->
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="form.payment_status?.name || '-'"
                label="Payment Status"
                variant="outlined"
                readonly
              />
            </v-col>
          </v-row>
        </div>

        <!-- DIVIDER -->
        <v-divider class="my-6" />

        <!-- EDITABLE SECTION -->
        <div>
          <h3 class="text-h6 font-weight-bold mb-4">Registration Details</h3>
          <v-row>
            <!-- PROGRAM -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.program_id"
                :items="programs"
                item-title="name"
                item-value="id"
                label="Program"
                variant="outlined"
              />
            </v-col>

            <!-- PAYER -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.payer_id"
                :items="payers"
                item-title="name"
                item-value="id"
                label="Payer"
                variant="outlined"
              />
            </v-col>

            <!-- COMPLAINT -->
            <v-col cols="12">
              <v-textarea
                v-model="form.complaint"
                label="Complaint/Notes"
                variant="outlined"
                rows="3"
              />
            </v-col>
          </v-row>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="d-flex justify-end ga-3 mt-6">
          <v-btn variant="tonal" @click="goBack">Cancel</v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-content-save"
            :loading="loading"
            :disabled="loading"
            @click="updateRegistration"
          >
            Update Registration
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top right">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const pageLoading = ref(true)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const programs = ref([])
const payers = ref([])

const form = ref({
  registration_number: '',
  created_at: '',
  child: null,
  payment_status: null,
  program_id: null,
  payer_id: null,
  complaint: '',
})

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const goBack = () => {
  router.push('/registrations')
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const fetchRegistration = async () => {
  try {
    const res = await api.get(`/registrations/${route.params.id}`)
    form.value = {
      registration_number: res.data.data.registration_number || '',
      created_at: res.data.data.created_at || '',
      child: res.data.data.child || null,
      payment_status: res.data.data.payment_status || null,
      program_id: res.data.data.program?.id || null,
      payer_id: res.data.data.payer?.id || null,
      complaint: res.data.data.complaint || '',
    }
  } catch (err) {
    console.error('Error loading registration:', err)
    showSnackbar('Error loading registration data', 'error')
  }
}

const fetchPrograms = async () => {
  try {
    const res = await api.get('/programs')
    programs.value = res.data.data || []
  } catch (err) {
    console.error('Error loading programs:', err)
  }
}

const fetchPayers = async () => {
  try {
    const res = await api.get('/payers')
    payers.value = res.data.data || []
  } catch (err) {
    console.error('Error loading payers:', err)
  }
}

const updateRegistration = async () => {
  loading.value = true

  try {
    await api.put(`/registrations/${route.params.id}`, {
      program_id: form.value.program_id,
      payer_id: form.value.payer_id,
      complaint: form.value.complaint,
    })

    showSnackbar('Registration updated successfully')
    goBack()
  } catch (error) {
    console.error('Error updating registration:', error)
    showSnackbar(
      error.response?.data?.message || 'Error updating registration',
      'error',
    )
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  await Promise.all([fetchRegistration(), fetchPrograms(), fetchPayers()])
  pageLoading.value = false
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.registration-edit-page {
  width: 100%;
}
</style>
