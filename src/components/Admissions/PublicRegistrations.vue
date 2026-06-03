<template>
  <!-- SNACKBAR -->
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
    location="top right"
    elevation="2"
  >
    {{ snackbarText }}
  </v-snackbar>

  <div class="registration-page">
    <div class="registration-content">
      <!-- HEADER -->
      <div class="page-header mb-8">
        <div class="d-flex align-center">
          <img :src="logo" alt="AHA CDC" class="aha-logo mr-4" />

          <div>
            <h1 class="text-h5 font-weight-bold mb-2">
              New Registration for Assessment Behavior & Learning Therapy
            </h1>

            <p class="text-body2 text-grey">Fill in the information below</p>
          </div>
        </div>
      </div>

      <!-- FORM -->
      <v-form ref="formRef" @submit.prevent="submitForm">
        <!-- ================= CHILD ================= -->
        <v-card class="mb-8 rounded-xl" elevation="1">
          <v-card-title>Child Information</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.child.name"
                  label="Full Name"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.child.nickname" label="Nickname" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.child.id_number"
                  label="ID Number / KIA"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.child.birth_date"
                  type="date"
                  label="Birth Date"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.child.birthplace_id"
                  :items="cities"
                  item-title="name"
                  item-value="id"
                  label="Birthplace"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.child.hometown_id"
                  :items="cities"
                  item-title="name"
                  item-value="id"
                  label="Hometown"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.child.school_id"
                  :items="schools"
                  item-title="name"
                  item-value="id"
                  label="School"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.child.school_class_id"
                  :items="schoolClasses"
                  item-title="name"
                  item-value="id"
                  label="Class"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.child.school_education_id"
                  :items="schoolEducations"
                  item-title="name"
                  item-value="id"
                  label="Education"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field :model-value="age" label="Age" readonly />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.child.gender"
                  :items="['Male', 'Female']"
                  label="Gender"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="form.child.address" label="Address" rows="2" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ================= GUARDIAN ================= -->
        <v-card class="mb-8 rounded-xl" elevation="1">
          <v-card-title>Parent / Guardian</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.guardian.id_number"
                  label="ID Number / KTP"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.guardian.name" label="Name" :rules="[rules.required]" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.guardian.phone"
                  label="Phone"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.guardian.occupation"
                  label="Occupation"
                  :readonly="guardianMode === 'existing'"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.guardian.social_media"
                  label="Social Media Instagram"
                  :readonly="guardianMode === 'existing'"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.guardian.email"
                  label="Email"
                  type="email"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.guardian.guardian_role_id"
                  :items="guardianRoles"
                  item-title="name"
                  item-value="id"
                  label="Relation"
                  :rules="[rules.required]"
                  clearable
                />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="form.guardian.address" label="Address" rows="2" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ================= PROGRAM ================= -->
        <v-card class="mb-8 rounded-xl" elevation="1">
          <v-card-title>Program</v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="form.registration.complaint"
                  label="Problem"
                  rows="2"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.registration.clinic_id"
                  :items="clinics"
                  item-title="name"
                  item-value="id"
                  label="Clinic"
                  :rules="[rules.required]"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.registration.program_id"
                  :items="programs"
                  item-title="name"
                  item-value="id"
                  label="Program"
                  :rules="[rules.required]"
                  clearable
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.registration.payer_id"
                  :items="payers"
                  item-title="name"
                  item-value="id"
                  label="Payment"
                  :rules="[rules.required]"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ACTION -->
        <div class="text-right">
          <v-btn color="primary" type="submit" :loading="loading" :disabled="loading">
            Save Registration
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/ahacdc-logo.jpeg'
import api from '@/services/api'
const router = useRouter()

/* =========================
   STATE
========================= */

const loading = ref(false)
const formRef = ref(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// OPTIONS
const guardianRoles = ref([])
const programs = ref([])
const payers = ref([])
const cities = ref([])
const schools = ref([])
const schoolClasses = ref([])
const schoolEducations = ref([])
const clinics = ref([])

/* =========================
   FORM
========================= */

const form = ref({
  child: {
    id_number: '',
    name: '',
    nickname: '',
    birth_date: '',
    birthplace_id: null,
    hometown_id: null,
    gender: '',
    address: '',
    school_id: null,
    school_class_id: null,
    school_education_id: null,
  },
  guardian: {
    id_number: '',
    name: '',
    phone: '',
    occupation: '',
    social_media: '',
    address: '',
    guardian_role_id: null,
    email: '',
  },
  registration: {
    complaint: '',
    program_id: null,
    payer_id: null,
  },
})

/* =========================
   COMPUTED
========================= */

const age = computed(() => {
  if (!form.value.child.birth_date) return ''

  const birth = new Date(form.value.child.birth_date)
  if (isNaN(birth)) return ''

  const today = new Date()

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()

  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--
    months += 12
  }

  return `${years} yr, ${months} mo`
})

/* =========================
   RULES
========================= */

const rules = {
  required: (v) => !!v || 'Field is required',
}

/* =========================
   API
========================= */

const fetchMaster = async () => {
  try {
    const res = await api.get('/master-data')

    guardianRoles.value = res.data.guardian_roles

    clinics.value = res.data.clinics

    programs.value = res.data.programs

    payers.value = res.data.payers

    cities.value = res.data.cities

    schools.value = res.data.schools

    schoolClasses.value = res.data.school_classes

    schoolEducations.value = res.data.school_educations
  } catch (err) {
    console.error(err)
  }
}

/* =========================
   SUBMIT
========================= */

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    const payload = {
      child: {
        ...form.value.child,
      },

      guardian: {
        ...form.value.guardian,
      },

      registration: {
        ...form.value.registration,
      },
    }

    const res = await api.post('/public-registrations', payload)

    snackbarText.value = 'Registration saved successfully'
    snackbarColor.value = 'success'
    snackbar.value = true

    router.replace({
      path: '/public-registration-success',

      query: {
        registration_number: res.data.data.registration_number,
      },
    })
  } catch (err) {
    console.error(err)

    const message =
      err.response?.data?.message ||
      Object.values(err.response?.data?.errors || {})[0]?.[0] ||
      'Failed to save registration'

    snackbarText.value = message
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

/* =========================
   LIFECYCLE
========================= */

onMounted(fetchMaster)
</script>

<style scoped>
.aha-logo {
  width: 120px;
  height: auto;
  object-fit: contain;
}

.registration-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 32px 16px;
}

.registration-content {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}
</style>
