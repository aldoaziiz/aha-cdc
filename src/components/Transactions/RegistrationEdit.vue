<template>
  <div class="registration-edit-page">
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Edit Registration</h1>
        <p class="text-body-2 text-grey">Update registration information.</p>
      </div>

      <v-btn variant="tonal" prepend-icon="mdi-arrow-left" @click="goBack">Back</v-btn>
    </div>

    <v-card v-if="pageLoading" elevation="1" class="rounded-xl pa-8">
      <div class="d-flex justify-center align-center flex-column ga-4">
        <v-progress-circular indeterminate color="primary" size="48" />
        <div class="text-body-1 text-grey">Loading registration data...</div>
      </div>
    </v-card>

    <v-card v-else elevation="1" class="rounded-xl">
      <v-card-text>
        <!-- INFO SECTION -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-4">Registration Information</h3>

          <v-row>
            <!-- REGISTRATION NO -->
            <v-col cols="12" md="6">
              <div class="text-caption text-grey mb-1">Registration No.</div>

              <div class="font-weight-medium">
                {{ form.registration_number || '-' }}
              </div>
            </v-col>

            <!-- REGISTRATION DATE -->
            <v-col cols="12" md="6">
              <div class="text-caption text-grey mb-1">Registration Date</div>

              <div class="font-weight-medium">
                {{ formatDate(form.created_at) || '-' }}
              </div>
            </v-col>

            <!-- CHILD NAME -->
            <v-col cols="12" md="6">
              <div class="text-caption text-grey mb-1">Child Name</div>

              <div class="font-weight-medium">
                {{ form.child?.name || '-' }}
              </div>
            </v-col>

            <!-- PAYMENT STATUS -->
            <v-col cols="12" md="6">
              <div class="text-caption text-grey mb-1">Payment Status</div>
              <v-chip
                :color="getStatusColor(form.payment_status?.id)"
                variant="tonal"
                size="small"
                class="mb-1"
              >
                {{ form.payment_status?.name || '-' }}
              </v-chip>
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

const fetchMasterData = async () => {
  try {
    const res = await api.get(`/registration-edit-master-data/${route.params.id}`)

    const registration = res.data.registration

    programs.value = res.data.programs || []

    payers.value = res.data.payers || []

    form.value = {
      registration_number: registration.registration_number || '',

      created_at: registration.created_at || '',

      child: registration.child || null,

      payment_status: registration.payment_status || null,

      program_id: registration.program?.id || null,

      payer_id: registration.payer?.id || null,

      complaint: registration.complaint || '',
    }
  } catch (err) {
    console.error('Error loading registration:', err)

    showSnackbar(
      'Error loading registration data',

      'error',
    )
  }
}

const getStatusColor = (id) => {
  if (id === 1) return 'warning' // Unpaid (kuning)
  if (id === 2) return 'grey' // Waiting
  if (id === 3) return 'green' // Paid
  return 'grey'
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
    showSnackbar(error.response?.data?.message || 'Error updating registration', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  await fetchMasterData()
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
