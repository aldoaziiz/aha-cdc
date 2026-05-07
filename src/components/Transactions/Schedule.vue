<template>
  <div class="schedule-content">

    <!-- HEADER -->
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Schedule Therapy Session
        </h1>

        <p class="text-body2 text-grey">
          Create therapy session schedule
        </p>
      </div>
    </div>

    <v-row>

      <!-- LEFT -->
      <v-col cols="12" md="4">

        <!-- PATIENT INFO -->
        <v-card elevation="1" class="mb-4">
          <v-card-title>
            Patient Information
          </v-card-title>

          <v-card-text>

            <div class="mb-3">
              <div class="text-caption text-grey">
                Child
              </div>

              <div class="font-weight-medium">
                {{ registration.child?.name || '-' }}
              </div>
            </div>

            <div class="mb-3">
              <div class="text-caption text-grey">
                Program
              </div>

              <div class="font-weight-medium">
                {{ registration.program?.name || '-' }}
              </div>
            </div>

            <div>
              <div class="text-caption text-grey">
                Guardian
              </div>

              <div v-for="g in registration.child?.guardians || []" :key="g.id" class="mb-2">
                <div class="font-weight-medium">
                  {{ g.name }}
                </div>

                <div class="text-caption text-grey">
                  {{ g.phone }}
                </div>
              </div>
            </div>

          </v-card-text>
        </v-card>

      </v-col>

      <!-- RIGHT -->
      <v-col cols="12" md="8">

        <!-- FORM -->
        <v-card elevation="1" class="mb-4">

          <v-card-title>
            New Schedule
          </v-card-title>

          <v-card-text>
            <v-form ref="formRef">

              <v-row>

                <!-- THERAPIST -->
                <v-col cols="12" md="6">
                  <v-select v-model="form.therapist_id" :items="therapists" item-title="name" item-value="id"
                    label="Therapist" variant="outlined" :rules="requiredRule" />
                </v-col>

                <!-- ROOM -->
                <v-col cols="12" md="6">
                  <v-select v-model="form.room_id" :items="rooms" item-title="name" item-value="id" label="Room"
                    variant="outlined" :rules="requiredRule" />
                </v-col>

                <!-- DATE -->
                <v-col cols="12" md="4">
                  <v-text-field v-model="form.therapy_date" label="Date" type="date" variant="outlined"
                    :rules="requiredRule" />
                </v-col>

                <!-- START -->
                <v-col cols="12" md="4">
                  <v-text-field v-model="form.start_time" label="Start Time" type="time" variant="outlined"
                    :rules="requiredRule" />
                </v-col>

                <!-- END -->
                <v-col cols="12" md="4">
                  <v-text-field v-model="form.end_time" label="End Time" type="time" variant="outlined"
                    :rules="requiredRule" />
                </v-col>

                <!-- NOTES -->
                <v-col cols="12">
                  <v-textarea v-model="form.notes" label="Notes" variant="outlined" rows="3" />
                </v-col>

              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn @click="saveSchedule" color="primary" variant="elevated" :loading="saving" :disabled="saving">
              Save Schedule
            </v-btn>
          </v-card-actions>

        </v-card>

        <!-- SESSION HISTORY -->
        <v-card elevation="1">

          <v-card-title>
            Therapy Sessions
          </v-card-title>

          <v-data-table :headers="headers" :items="sessions" density="comfortable">
            <template v-slot:item.actions="{ item }">

              <v-btn icon size="small" color="error" variant="text" @click="deleteSession(item)">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>

            </template>
          </v-data-table>

        </v-card>

      </v-col>

    </v-row>

  </div>

  <v-snackbar v-model="snackbar" :color="snackbarColor" location="top right" timeout="3000">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()

const registration = ref({})
const therapists = ref([])
const rooms = ref([])
const sessions = ref([])

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const saving = ref(false)

const requiredRule = [
  v => !!v || 'This field is required'
]

const form = ref({
  therapist_id: null,
  room_id: null,

  therapy_date: '',
  start_time: '',
  end_time: '',

  notes: ''
})

const formRef = ref(null)

const headers = [
  { title: 'Date', key: 'therapy_date' },
  { title: 'Therapist', key: 'therapist.name' },
  { title: 'Room', key: 'room.name' },
  { title: 'Start', key: 'start_time' },
  { title: 'End', key: 'end_time' },
  { title: '', key: 'actions', sortable: false }
]

// ======================
// FETCH REGISTRATION
// ======================

const fetchRegistration = async () => {
  try {
    const res = await api.get(`/registrations/${route.params.id}`)
    registration.value = res.data.data

  } catch (err) {
    console.error(err)
  }
}

// ======================
// FETCH THERAPISTS
// ======================

const fetchTherapists = async () => {
  try {
    const res = await api.get('/staff', {
      params: {
        staff_role_id: 2,
        per_page: 100
      }
    })

    therapists.value = res.data.data

  } catch (err) {
    console.error(err)
  }
}

// ======================
// FETCH ROOMS
// ======================

const fetchRooms = async () => {
  try {
    const res = await api.get('/rooms', {
      params: {
        per_page: 100
      }
    })

    rooms.value = res.data.data

  } catch (err) {
    console.error(err)
  }
}

// ======================
// FETCH SESSIONS
// ======================

const fetchSessions = async () => {
  try {
    const res = await api.get('/therapy-sessions', {
      params: {
        registration_id: route.params.id
      }
    })

    sessions.value = res.data.data
    console.log(route.params.id)

  } catch (err) {
    console.error(err)
  }
}

// ======================
// SAVE
// ======================

const saveSchedule = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  try {

    await api.post('/therapy-sessions', {
      registration_id: route.params.id,

      therapist_id: form.value.therapist_id,
      room_id: form.value.room_id,

      therapy_date: form.value.therapy_date,
      start_time: form.value.start_time,
      end_time: form.value.end_time,

      notes: form.value.notes
    })

    // 🔥 SUCCESS
    snackbarText.value = 'Schedule created successfully'
    snackbarColor.value = 'success'
    snackbar.value = true

    // REFRESH TABLE
    fetchSessions()

    // CLEAR FORM
    form.value = {
      therapist_id: null,
      room_id: null,

      therapy_date: '',
      start_time: '',
      end_time: '',

      notes: ''
    }

  } catch (err) {

    console.error(err)

    // 🔥 ERROR MESSAGE BACKEND
    snackbarText.value =
      err.response?.data?.message ||
      'Failed to create schedule'

    snackbarColor.value = 'error'
    snackbar.value = true

  }
}

const deleteSession = async (item) => {

  if (!confirm('Delete this session?')) return

  try {

    await api.delete(
      `/therapy-sessions/${item.id}`
    )

    snackbarText.value = 'Session deleted'
    snackbarColor.value = 'success'
    snackbar.value = true

    fetchSessions()

  } catch (err) {

    snackbarText.value = 'Failed to delete session'
    snackbarColor.value = 'error'
    snackbar.value = true

  }
}

onMounted(() => {
  fetchRegistration()
  fetchTherapists()
  fetchRooms()
  fetchSessions()
})
</script>

<style scoped>
.schedule-content {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>