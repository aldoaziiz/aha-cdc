<template>
  <div class="schedule-content">

    <!-- HEADER -->
    <div class="page-header mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Schedule Therapy Session
        </h1>

        <p class="text-body-2 text-grey">
          Create therapy session schedule
        </p>
      </div>
    </div>

    <!-- PATIENT INFO -->
    <v-card elevation="1" class="mb-4 rounded-lg">
      <v-card-title>
        Patient Information
      </v-card-title>

      <v-card-text>

        <v-row>

          <!-- CHILD -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey">
              Child
            </div>

            <div class="font-weight-medium">
              {{ registration.child?.name || '-' }}
            </div>

          </v-col>

          <!-- PROGRAM -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey">
              Program
            </div>

            <div class="font-weight-medium">
              {{ registration.program?.name || '-' }}
            </div>

          </v-col>

          <!-- GUARDIANS -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey mb-1">
              Guardians
            </div>

            <div v-for="g in registration.child?.guardians || []" :key="g.id" class="mb-2">
              <div class="font-weight-medium">
                {{ g.name }}
              </div>

              <div class="text-caption text-grey">
                {{ g.phone }}
              </div>
            </div>

          </v-col>

        </v-row>

      </v-card-text>
    </v-card>

    <!-- FORM -->
    <v-card elevation="1" class="mb-4 rounded-lg">

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
    <v-card elevation="1" class="rounded-lg">

      <v-card-title>
        Therapy Sessions
      </v-card-title>

      <v-data-table :headers="headers" :items="sessions" density="comfortable">

        <!-- THERAPIST -->
        <template v-slot:item.therapist="{ item }">
          {{ item.therapist?.name || '-' }}
        </template>

        <!-- ROOM -->
        <template v-slot:item.room="{ item }">
          {{ item.room?.name || '-' }}
        </template>

        <!-- START -->
        <template v-slot:item.start_time="{ item }">
          {{ item.start_time?.slice(0, 5) }}
        </template>

        <!-- END -->
        <template v-slot:item.end_time="{ item }">
          {{ item.end_time?.slice(0, 5) }}
        </template>

        <!-- ACTION -->
        <template v-slot:item.actions="{ item }">

          <v-menu>

            <template v-slot:activator="{ props }">

              <v-btn variant="tonal" size="small" v-bind="props">
                Action

                <v-icon end>
                  mdi-chevron-down
                </v-icon>
              </v-btn>

            </template>

            <v-list density="compact">

              <v-list-item @click="deleteSession(item)">
                <v-list-item-title class="text-error">
                  Delete
                </v-list-item-title>
              </v-list-item>

            </v-list>

          </v-menu>

        </template>

      </v-data-table>

    </v-card>

    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" location="top right" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>

  </div>
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

const formRef = ref(null)

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

const headers = [
  { title: 'Date', key: 'therapy_date' },
  { title: 'Therapist', key: 'therapist' },
  { title: 'Room', key: 'room' },
  { title: 'Start', key: 'start_time' },
  { title: 'End', key: 'end_time' },
  {
    title: '',
    key: 'actions',
    sortable: false,
    align: 'center'
  }
]

// ======================
// FETCH REGISTRATION
// ======================

const fetchRegistration = async () => {

  try {

    const res = await api.get(
      `/registrations/${route.params.id}`
    )

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

    saving.value = true

    await api.post('/therapy-sessions', {

      registration_id: route.params.id,

      therapist_id: form.value.therapist_id,
      room_id: form.value.room_id,

      therapy_date: form.value.therapy_date,
      start_time: form.value.start_time,
      end_time: form.value.end_time,

      notes: form.value.notes

    })

    snackbarText.value =
      'Schedule created successfully'

    snackbarColor.value = 'success'
    snackbar.value = true

    fetchSessions()

  } catch (err) {

    snackbarText.value =
      err.response?.data?.message ||
      'Failed to create schedule'

    snackbarColor.value = 'error'
    snackbar.value = true

  } finally {

    saving.value = false

  }
}

// ======================
// DELETE SESSION
// ======================

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

    snackbarText.value =
      'Failed to delete session'

    snackbarColor.value = 'error'
    snackbar.value = true

  }
}

// ======================
// INIT
// ======================

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