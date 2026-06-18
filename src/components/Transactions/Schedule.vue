<template>
  <div class="schedule-content">
    <template v-if="loading">
      <v-skeleton-loader type="heading" class="mb-4" />

      <v-skeleton-loader type="article" class="mb-4" />

      <v-skeleton-loader type="article" class="mb-4" />

      <v-skeleton-loader type="table" />
    </template>

    <template v-else>
      <!-- HEADER -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Schedule</h1>

          <p class="text-body-2 text-grey">Manage therapy schedules.</p>
        </div>

        <v-btn variant="tonal" prepend-icon="mdi-arrow-left" @click="goBack">Back</v-btn>
      </div>

      <!-- Registration Information -->
      <v-card elevation="1" class="mb-4 rounded-lg">
        <v-card-title>Registration Information</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Registration No.</div>
              <div class="font-weight-medium">
                {{ registration.registration_number || '-' }}
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Registration Date</div>
              <div class="font-weight-medium">
                {{ formatDate(registration.created_at) || '-' }}
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Child Name</div>
              <div class="font-weight-medium">
                {{ registration.child?.name || '-' }}
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Child Birth Date</div>
              <div class="font-weight-medium">
                {{ formatDate(registration.child?.birth_date) || '-' }}
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Problem</div>
              <div class="font-weight-medium">
                {{ registration.complaint || '-' }}
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Payer</div>
              <div class="font-weight-medium">
                {{ registration.payer?.name || '-' }}
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-caption text-grey">Program</div>
              <div v-for="program in registration.programs || []" :key="program.id">
                • {{ program.name }}
              </div>
            </v-col>

            <v-divider></v-divider>

            <v-col cols="12" md="4">
              <div class="text-caption text-grey mb-1">Guardians</div>
              <div v-for="g in registration.child?.guardians || []" :key="g.id" class="mb-2">
                <div class="font-weight-medium">
                  {{ g.name }}
                </div>
                <div class="text-caption text-blue">
                  {{ g.guardian_role.name }}
                </div>
                <div class="text-caption text-grey">
                  {{ g.phone }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- AVAILABILITY GRID -->
      <!-- WEEKLY AVAILABILITY GRID -->

      <v-divider />
      <v-card elevation="1" class="mb-4 rounded-lg">
        <v-card-title>Therapist Availability</v-card-title>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="availabilityFilter.start_date"
                type="date"
                label="Start Date"
                density="compact"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="availabilityFilter.end_date"
                type="date"
                label="End Date"
                density="compact"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="availabilityFilter.therapist_id"
                :items="therapists"
                item-title="name"
                item-value="id"
                label="Therapist"
                density="compact"
                clearable
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-btn color="primary" block @click="applyAvailabilityFilter">Apply</v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pa-0">
          <div class="availability-grid-wrapper">
            <table class="availability-grid">
              <thead>
                <tr>
                  <th>Therapist</th>
                  <th v-for="day in weekDates" :key="day.key">
                    {{ day.label }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <template v-for="therapist in therapistsGrid" :key="therapist.name">
                  <tr v-for="hour in availabilityHours" :key="therapist.name + hour">
                    <td
                      v-if="hour === '08'"
                      :rowspan="availabilityHours.length"
                      class="therapist-name"
                    >
                      {{ therapist.name }}
                    </td>

                    <td
                      v-for="day in weekDates"
                      :key="day.date + hour"
                      :style="{
                        background: getCellColor(therapist, day, hour),
                      }"
                    >
                      <template v-if="getSessionInfo(therapist.id, day, hour)">
                        <v-tooltip location="top">
                          <template #activator="{ props }">
                            <span v-bind="props" class="slot-content">
                              <span class="slot-hour">
                                {{ hour }}
                              </span>

                              <span class="slot-child">
                                {{
                                  getSessionInfo(
                                    therapist.id,
                                    day,
                                    hour,
                                  ).registration.child.name.split(' ')[0]
                                }}
                              </span>
                            </span>
                          </template>

                          {{ getSessionInfo(therapist.id, day, hour).registration.child.name }}
                        </v-tooltip>
                      </template>

                      <template v-else>
                        <span class="slot-hour">
                          {{ hour }}
                        </span>
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div class="d-flex ga-4 pa-4 flex-wrap">
            <div>🟥 Occupied</div>

            <div>🟩 Available</div>

            <div>🟨 Break</div>

            <div>🟦 Weekend</div>
          </div>
        </v-card-text>
      </v-card>

      <!-- FORM -->
      <v-card elevation="1" class="mb-4 rounded-lg">
        <v-card-title>{{ editingSession ? 'Edit Schedule' : 'Generate Schedule' }}</v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-form ref="formRef">
            <v-row>
              <!-- THERAPIST -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.therapist_id"
                  :items="therapists"
                  item-title="name"
                  item-value="id"
                  label="Therapist"
                  variant="outlined"
                  :rules="requiredRule"
                />
              </v-col>

              <!-- DATE -->
              <v-col v-if="!editingSession" cols="12" md="6">
                <v-text-field
                  v-model="form.start_date"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  :rules="requiredRule"
                />
              </v-col>

              <v-col v-if="editingSession" cols="12" md="4">
                <v-text-field
                  v-model="form.therapy_date"
                  label="Date"
                  type="date"
                  variant="outlined"
                  :rules="requiredRule"
                />
              </v-col>

              <v-col v-if="editingSession" cols="12">
                <v-radio-group v-model="form.time_slot" label="Session Time">
                  <v-radio
                    v-for="slot in timeSlots"
                    :key="slot.title"
                    :label="slot.label"
                    :value="slot.start"
                  />
                </v-radio-group>
              </v-col>

              <v-col v-if="editingSession" cols="12">
                <div class="text-caption text-warning">Use only for approved reschedules.</div>
              </v-col>

              <!-- day name -->
              <v-col v-if="!editingSession" cols="12">
                <div class="text-subtitle-2 mb-2">Days</div>

                <div class="d-flex flex-wrap ga-4">
                  <v-checkbox
                    v-for="day in daysOfWeek"
                    :key="day.value"
                    v-model="form.days"
                    :label="day.label"
                    :value="day.value"
                    hide-details
                    density="compact"
                  />
                </div>

                <div
                  v-if="!editingSession && form.days.length === 0"
                  class="text-error text-caption mt-1"
                >
                  Please select at least one day.
                </div>
              </v-col>

              <v-col v-if="!editingSession" cols="12">
                <div class="text-subtitle-2 mb-2">Session Time</div>

                <v-radio-group v-model="form.time_slot" :rules="requiredRule" hide-details="auto">
                  <v-radio
                    v-for="slot in timeSlots"
                    :key="slot.start"
                    :label="slot.label"
                    :value="slot.start"
                    :disabled="slot.disabled"
                  />
                </v-radio-group>
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
          <v-btn variant="text" @click="cancelEdit">Cancel</v-btn>

          <v-btn
            @click="saveSchedule"
            color="primary"
            variant="elevated"
            :loading="saving"
            :disabled="saving"
          >
            {{ editingSession ? 'Update Schedule' : 'Generate Sessions' }}
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- SUMMARY -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div class="text-caption">Target Sessions</div>

              <div class="text-h5 font-weight-bold">
                {{ targetSessions }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div class="text-caption">Generated</div>

              <div class="text-h5 font-weight-bold">
                {{ generatedSessions }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div class="text-caption">Remaining</div>

              <div class="text-h5 font-weight-bold">
                {{ remainingSessions }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- SESSION HISTORY -->
      <v-card elevation="1" class="rounded-lg">
        <v-card-title>Therapy Sessions</v-card-title>
        <v-divider></v-divider>

        <v-data-table
          :headers="headers"
          :items="sessions"
          :items-per-page="20"
          density="comfortable"
        >
          <!-- THERAPIST -->
          <template v-slot:item.therapist="{ item }">
            {{ item.therapist?.name || '-' }}
          </template>

          <!-- START -->
          <template v-slot:item.start_time="{ item }">
            {{ item.start_time?.slice(0, 5) }}
          </template>

          <!-- END -->
          <template v-slot:item.end_time="{ item }">
            {{ item.end_time?.slice(0, 5) }}
          </template>

          <!-- STATUS -->
          <template #item.status="{ item }">
            <v-chip size="small" :color="item.activity ? 'success' : 'primary'" variant="tonal">
              {{ item.activity ? 'Completed' : 'Scheduled' }}
            </v-chip>
          </template>

          <!-- ACTION -->
          <template v-slot:item.actions="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn variant="tonal" size="small" v-bind="props">
                  Action

                  <v-icon end>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item :disabled="!!item.activity" @click="editSession(item)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>

                <v-list-item :disabled="!!item.activity" @click="deleteSession(item)">
                  <v-list-item-title>Delete</v-list-item-title>
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
    </template>
  </div>

  <v-dialog v-model="deleting" persistent width="320">
    <v-card rounded="xl" class="pa-8 d-flex flex-column align-center justify-center text-center">
      <v-progress-circular indeterminate color="primary" size="56" width="5" />

      <div class="text-h6 font-weight-medium mt-6">Deleting Session...</div>

      <div class="text-body-2 text-medium-emphasis mt-2">Please wait a moment</div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const registration = ref({})
const therapists = ref([])
const sessions = ref([])
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const loading = ref(true)
const saving = ref(false)
const formRef = ref(null)
const deleting = ref(false)
const editingSession = ref(null)
const availabilityDate = ref(new Date())

const weekDates = computed(() => {
  const result = []

  if (!appliedAvailabilityFilter.value.start_date || !appliedAvailabilityFilter.value.end_date) {
    return result
  }

  const current = new Date(appliedAvailabilityFilter.value.start_date)

  const end = new Date(appliedAvailabilityFilter.value.end_date)

  while (current <= end) {
    result.push({
      key: current.toISOString(),

      date: current.toISOString().split('T')[0],

      label: current.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
      }),
    })

    current.setDate(current.getDate() + 1)
  }

  return result
})

const availabilityHours = ['08', '09', '10', '11', '12', '13', '14', '15', '16']

const availabilityFilter = ref({
  start_date: '',
  end_date: '',
  therapist_id: null,
})

const appliedAvailabilityFilter = ref({
  start_date: '',
  end_date: '',
  therapist_id: null,
})

const therapistsGrid = ref([])

const availabilitySessions = ref([])

const daysOfWeek = [
  {
    label: 'Monday',
    value: 1,
  },
  {
    label: 'Tuesday',
    value: 2,
  },
  {
    label: 'Wednesday',
    value: 3,
  },
  {
    label: 'Thursday',
    value: 4,
  },
  {
    label: 'Friday',
    value: 5,
  },
  {
    label: 'Saturday',
    value: 6,
  },
  {
    label: 'Sunday',
    value: 0,
  },
]

const timeSlots = [
  {
    label: '08:00 - 09:00',
    start: '08:00',
    end: '09:00',
    disabled: false,
  },
  {
    label: '09:00 - 10:00',
    start: '09:00',
    end: '10:00',
    disabled: false,
  },
  {
    label: '10:00 - 11:00',
    start: '10:00',
    end: '11:00',
    disabled: false,
  },
  {
    label: '11:00 - 12:00',
    start: '11:00',
    end: '12:00',
    disabled: false,
  },
  {
    label: '12:00 - 13:00 (Break)',
    start: '12:00',
    end: '13:00',
    disabled: true,
  },
  {
    label: '13:00 - 14:00',
    start: '13:00',
    end: '14:00',
    disabled: false,
  },
  {
    label: '14:00 - 15:00',
    start: '14:00',
    end: '15:00',
    disabled: false,
  },
  {
    label: '15:00 - 16:00',
    start: '15:00',
    end: '16:00',
    disabled: false,
  },
  {
    label: '16:00 - 17:00',
    start: '16:00',
    end: '17:00',
    disabled: false,
  },
]

const getCellKey = (day, hour) => {
  return `${day.substring(0, 3)}-${hour}`
}

const getCellColor = (therapist, day, hour) => {
  if (hour === '12') {
    return '#fff3cd'
  }

  const weekday = new Date(day.date).getDay()

  if (weekday === 0 || weekday === 6) {
    return '#9fc5e8'
  }

  const session = getSessionInfo(therapist.id, day, hour)

  if (session) {
    return '#f4cccc'
  }

  return '#d9ead3'
}

const goBack = () => {
  router.back()
}

const requiredRule = [(v) => !!v || 'This field is required']

const form = ref({
  therapist_id: null,
  days: [],
  start_date: '',
  time_slot: null,
  therapy_date: '',
  start_time: '',
  end_time: '',
  notes: '',
})

const headers = [
  { title: 'Date', key: 'therapy_date' },
  { title: 'Start', key: 'start_time' },
  { title: 'End', key: 'end_time' },
  { title: 'Therapist', key: 'therapist' },
  { title: 'Session Status', key: 'status' },
  { title: 'Notes', key: 'notes' },
  {
    title: '',
    key: 'actions',
    sortable: false,
    align: 'center',
  },
]

const getSessionInfo = (therapistId, day, hour) => {
  return availabilitySessions.value.find((session) => {
    const therapistMatch = session.therapist_id === therapistId

    const dateMatch = session.therapy_date === day.date

    const hourMatch = session.start_time.startsWith(hour)

    return therapistMatch && dateMatch && hourMatch
  })
}

const targetSessions = computed(() => {
  return (
    registration.value?.programs?.reduce(
      (total, program) => total + Number(program.session_count || 0),
      0,
    ) || 0
  )
})

const generatedSessions = computed(() => {
  return sessions.value.length
})

const remainingSessions = computed(() => {
  return targetSessions.value - generatedSessions.value
})

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
        per_page: 100,
      },
    })

    therapists.value = res.data.data
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
        registration_id: route.params.id,
        per_page: 999,
      },
    })

    sessions.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

const fetchAvailability = async () => {
  try {
    const res = await api.get('/therapy-sessions/availability', {
      params: {
        start_date: availabilityFilter.value.start_date,
        end_date: availabilityFilter.value.end_date,
        therapist_id: availabilityFilter.value.therapist_id,
      },
    })
    therapistsGrid.value = res.data.therapists
    availabilitySessions.value = res.data.sessions
  } catch (err) {
    console.error(err)
  }
}

// FORMAT DATE
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-ID', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

const applyAvailabilityFilter = async () => {
  const start = new Date(availabilityFilter.value.start_date)

  const end = new Date(availabilityFilter.value.end_date)

  const diff = (end - start) / (1000 * 60 * 60 * 24)

  if (diff > 6) {
    snackbarText.value = 'Maximum range is 7 days'

    snackbarColor.value = 'error'

    snackbar.value = true

    return
  }
  appliedAvailabilityFilter.value = {
    ...availabilityFilter.value,
  }
  await fetchAvailability()
}

const previousAvailabilityDay = () => {
  const d = new Date(availabilityDate.value)

  d.setDate(d.getDate() - 1)

  availabilityDate.value = d
}

const nextAvailabilityDay = () => {
  const d = new Date(availabilityDate.value)

  d.setDate(d.getDate() + 1)

  availabilityDate.value = d
}

const formatAvailabilityDate = () => {
  return availabilityDate.value.toLocaleDateString('en-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getAvailabilityColor = (status) => {
  if (status === 'available') return 'success'

  if (status === 'occupied') return 'error'

  return 'grey'
}

const getAvailabilityLabel = (status) => {
  if (status === 'available') return 'A'

  if (status === 'occupied') return 'O'

  return 'B'
}

const getStatusColor = (id) => {
  if (id === 1) return 'warning' // Unpaid (kuning)
  if (id === 2) return 'info' // Waiting
  if (id === 3) return 'green' // Paid
  return 'grey'
}

// ======================
// SAVE
// ======================

const saveSchedule = async () => {
  if (!editingSession.value && form.value.days.length === 0) {
    snackbarText.value = 'Please select at least one day'
    snackbarColor.value = 'error'
    snackbar.value = true

    return
  }
  const { valid } = await formRef.value.validate()

  if (!valid) return

  try {
    saving.value = true

    if (editingSession.value) {
      const selectedSlot = timeSlots.find((slot) => slot.start === form.value.time_slot)

      form.value.start_time = selectedSlot.start_time
      form.value.end_time = selectedSlot.end_time
      await api.put(`/therapy-sessions/${editingSession.value.id}`, {
        therapist_id: form.value.therapist_id,
        therapy_date: form.value.therapy_date,
        start_time: form.value.start_time,
        end_time: form.value.end_time,
        notes: form.value.notes,
      })

      snackbarText.value = 'Schedule updated successfully'
    } else {
      const slot = timeSlots.find((s) => s.start === form.value.time_slot)

      await api.post('/therapy-sessions/generate', {
        registration_id: route.params.id,

        therapist_id: form.value.therapist_id,

        days: form.value.days,

        start_date: form.value.start_date,

        start_time: slot.start,

        end_time: slot.end,

        notes: form.value.notes,
      })

      snackbarText.value = 'Sessions generated successfully'
    }

    snackbarColor.value = 'success'
    snackbar.value = true
    editingSession.value = null

    form.value = {
      therapist_id: null,

      days: [],

      start_date: '',

      time_slot: null,

      therapy_date: '',

      start_time: '',
      end_time: '',

      notes: '',
    }

    await fetchSessions()
  } catch (err) {
    snackbarText.value =
      err.response?.data?.message ||
      (editingSession.value ? 'Failed to update schedule' : 'Failed to create schedule')

    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    saving.value = false
  }
}

const editSession = (item) => {
  editingSession.value = item

  const selectedSlot =
    timeSlots.find((slot) => slot.start === item.start_time && slot.end === item.end_time)?.start ||
    null

  form.value = {
    therapist_id: item.therapist_id,

    therapy_date: item.therapy_date,

    start_time: item.start_time,

    end_time: item.end_time,

    time_slot: selectedSlot,

    notes: item.notes || '',

    days: [],

    start_date: '',
  }
}

// ======================
// DELETE SESSION
// ======================

const deleteSession = async (item) => {
  if (!confirm('Delete this session?')) {
    return
  }

  deleting.value = true

  try {
    await api.delete(`/therapy-sessions/${item.id}`)

    snackbarText.value = 'Session deleted'

    snackbarColor.value = 'success'

    snackbar.value = true

    await fetchSessions()
  } catch (err) {
    snackbarText.value = err.response?.data?.message || 'Failed to delete session'

    snackbarColor.value = 'error'

    snackbar.value = true
  } finally {
    deleting.value = false
  }
}

const cancelEdit = () => {
  editingSession.value = null

  form.value = {
    therapist_id: null,
    therapy_date: '',

    days: [],
    start_date: '',

    time_slot: null,

    start_time: '',
    end_time: '',

    notes: '',
  }
}

// ======================
// INIT
// ======================

onMounted(async () => {
  loading.value = true

  await Promise.all([fetchRegistration(), fetchTherapists(), fetchSessions()])
  const today = new Date()

  const endDate = new Date()

  endDate.setDate(today.getDate() + 6)

  availabilityFilter.value = {
    start_date: today.toISOString().split('T')[0],

    end_date: endDate.toISOString().split('T')[0],

    therapist_id: null,
  }

  loading.value = false
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

.availability-grid {
  border-collapse: collapse;
  table-layout: auto;
}

.availability-grid thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 4px;
  font-size: 12px;
}

.availability-grid td {
  border: 1px solid #ddd;
  padding: 4px;
  font-size: 12px;
}

.therapist-name {
  vertical-align: top;
  text-align: left;

  white-space: nowrap;

  width: 1%;

  padding-top: 8px;

  font-weight: 600;
}

.slot-content {
  display: flex;
  align-items: center;
  gap: 8px;

  justify-content: flex-start;
}

.slot-hour {
  width: 24px;
  flex-shrink: 0;
  font-weight: 600;
}

.slot-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.availability-grid-wrapper {
  overflow: auto;
  max-height: 600px;
}
</style>
