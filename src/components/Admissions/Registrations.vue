<template>
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top right" elevation="2">
    {{ snackbarText }}
  </v-snackbar>
  <div class="registration-page">
    <v-container max-width="800">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-h5 font-weight-bold">FORM DATA PESERTA ASSESMENT BEHAVIOR & LEARNING THERAPY</h1>
        <p class="text-body2 text-grey">Fill in the information below</p>
      </div>

      <v-form ref="formRef" @submit.prevent="submitForm">

        <!-- ================= CHILD ================= -->
        <v-card class="mb-6" elevation="1">
          <v-card-title>Child Information</v-card-title>
          <v-card-text>

            <v-radio-group v-model="childMode" inline>
              <v-radio label="New Child" value="new" />
              <v-radio label="Select Existing" value="existing" />
            </v-radio-group>

            <v-autocomplete v-model="selectedChild" :items="childrenOptions" item-title="name" item-value="id"
              label="Select Child" :disabled="childMode === 'new'" clearable />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.child.name" label="Full Name" :rules="[rules.required]"
                  :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.child.nickname" label="Nickname" :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.child.id_number" label="ID Number" :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.child.birth_date" type="date" label="Birth Date" :rules="[rules.required]"
                  :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete v-model="form.child.birthplace_id" :items="cities" item-title="name" item-value="id"
                  label="Birthplace" :rules="[rules.required]" clearable :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete v-model="form.child.hometown_id" :items="cities" item-title="name" item-value="id"
                  label="Hometown" :rules="[rules.required]" clearable :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete v-model="form.child.school_id" :items="schools" item-title="name" item-value="id"
                  label="School" clearable :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete v-model="form.child.school_class_id" :items="schoolClasses" item-title="name"
                  item-value="id" label="Class" clearable :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete v-model="form.child.school_education_id" :items="schoolEducations" item-title="name"
                  item-value="id" label="Education" clearable :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field :model-value="age" label="Age" readonly />
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="form.child.gender" :items="['Male', 'Female']" label="Gender"
                  :rules="[rules.required]" :readonly="childMode === 'existing'" />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="form.child.address" label="Address" rows="2"
                  :readonly="childMode === 'existing'" />
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>

        <!-- ================= GUARDIAN ================= -->
        <v-card class="mb-6" elevation="1">
          <v-card-title>Parent / Guardian</v-card-title>
          <v-card-text>

            <v-radio-group v-model="guardianMode" inline>
              <v-radio label="New Guardian" value="new" />
              <v-radio label="Select Existing" value="existing" />
            </v-radio-group>

            <v-autocomplete v-model="selectedGuardian" :items="guardiansOptions" item-title="name" item-value="id"
              label="Select Guardian" :disabled="guardianMode === 'new'" clearable />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.guardian.name" label="Name" :rules="[rules.required]"
                  :readonly="guardianMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.guardian.phone" label="Phone" :rules="[rules.required, rules.phone]"
                  :readonly="guardianMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.guardian.id_number" label="ID Number"
                  :readonly="guardianMode === 'existing'" />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete v-model="form.guardian.guardian_role_id" :items="guardianRoles" item-title="name"
                  item-value="id" label="Relation" :rules="[rules.required]" clearable
                  :readonly="guardianMode === 'existing'" />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="form.guardian.address" label="Address" rows="2"
                  :readonly="guardianMode === 'existing'" />
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>

        <!-- ================= PROGRAM ================= -->
        <v-card class="mb-6" elevation="1">
          <v-card-title>Program</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-textarea v-model="form.registration.complaint" label="Complaint" rows="2" />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete v-model="form.registration.program_id" :items="programs" item-title="name"
                  item-value="id" label="Program" :rules="[rules.required]" clearable />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete v-model="form.registration.payer_id" :items="payers" item-title="name" item-value="id"
                  label="Payment" :rules="[rules.required]" clearable />
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
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/services/api'

/* =========================
   STATE
========================= */

const loading = ref(false)
const formRef = ref(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// MODE
const childMode = ref('new')
const guardianMode = ref('new')

// SELECTED EXISTING
const selectedChild = ref(null)
const selectedGuardian = ref(null)

// PREVIEW (🔥 FIX ERROR)
const childPreview = ref(null)
const guardianPreview = ref(null)

// OPTIONS
const guardianRoles = ref([])
const programs = ref([])
const payers = ref([])
const cities = ref([])
const schools = ref([])
const schoolClasses = ref([])
const schoolEducations = ref([])

const childrenOptions = ref([])
const guardiansOptions = ref([])

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
    school_education_id: null
  },
  guardian: {
    id_number: '',
    name: '',
    phone: '',
    address: '',
    guardian_role_id: null
  },
  registration: {
    complaint: '',
    program_id: null,
    payer_id: null
  }
})

const resetForm = () => {
  form.value = {
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
      school_education_id: null
    },
    guardian: {
      id_number: '',
      name: '',
      phone: '',
      address: '',
      guardian_role_id: null
    },
    registration: {
      complaint: '',
      program_id: null,
      payer_id: null
    }
  }
}

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
  phone: (v) => (!v || /^08\d{8,12}$/.test(v)) || 'Invalid phone number',
}

/* =========================
   WATCHERS
========================= */

// CHILD
watch(selectedChild, (val) => {
  if (!val) {
    childPreview.value = null
    return
  }

  const c = childrenOptions.value.find(i => i.id === val)
  if (!c) return

  console.log('Selected Child:', c)

  childPreview.value = c

  form.value.child = {
    id_number: c.id_number,
    name: c.name,
    nickname: c.nickname,
    birth_date: c.birth_date,
    gender: c.gender,
    address: c.address,
    birthplace_id: c.birthplace?.id ?? null,
    hometown_id: c.hometown?.id ?? null,
    school_id: c.school?.id ?? null,
    school_class_id: c.school_class?.id ?? null,
    school_education_id: c.school_education?.id ?? null
  }
})

// CHILD MODE
watch(childMode, (mode) => {
  if (mode === 'new') {
    selectedChild.value = null
    childPreview.value = null

    form.value.child = {
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
      school_education_id: null
    }
  }
})

// GUARDIAN
watch(selectedGuardian, (val) => {
  if (!val) {
    guardianPreview.value = null
    return
  }

  const g = guardiansOptions.value.find(i => i.id === val)
  if (!g) return

  guardianPreview.value = g

  form.value.guardian = {
    id_number: g.id_number,
    name: g.name,
    phone: g.phone,
    address: g.address,
    guardian_role_id: form.value.guardian.guardian_role_id
  }
})

// GUARDIAN MODE
watch(guardianMode, (mode) => {
  if (mode === 'new') {
    selectedGuardian.value = null
    guardianPreview.value = null

    form.value.guardian = {
      id_number: '',
      name: '',
      phone: '',
      address: '',
      guardian_role_id: null
    }
  }
})

/* =========================
   API
========================= */

const fetchMaster = async () => {
  try {
    const [
      roles, prog, pay,
      cityRes, schoolRes, classRes, eduRes,
      childRes, guardianRes
    ] = await Promise.all([
      api.get('/guardian-roles'),
      api.get('/programs'),
      api.get('/payers'),
      api.get('/cities'),
      api.get('/schools'),
      api.get('/school-classes'),
      api.get('/school-educations'),
      api.get('/children'),
      api.get('/guardians')
    ])

    guardianRoles.value = roles.data.data
    programs.value = prog.data.data
    payers.value = pay.data.data

    cities.value = cityRes.data.data
    schools.value = schoolRes.data.data
    schoolClasses.value = classRes.data.data
    schoolEducations.value = eduRes.data.data

    childrenOptions.value = childRes.data.data
    guardiansOptions.value = guardianRes.data.data

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
      child: childMode.value === 'existing'
        ? { id: selectedChild.value }
        : { ...form.value.child },

      guardian: guardianMode.value === 'existing'
        ? {
          id: selectedGuardian.value,
          guardian_role_id: form.value.guardian.guardian_role_id
        }
        : { ...form.value.guardian },

      registration: { ...form.value.registration }
    }

    const res = await api.post('/registrations', payload)

    snackbarText.value = 'Registration saved successfully'
    snackbarColor.value = 'success'
    snackbar.value = true

    resetForm()

    console.log('Saved:', res.data)

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
.registration-page {
  padding-top: 32px;
}
</style>