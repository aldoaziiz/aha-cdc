<template>
  <div class="activity-create-page">

    <!-- HEADER -->
    <div class="page-header mb-6">

      <div>

        <h1 class="text-h4 font-weight-bold mb-2">
          Edit Activity
        </h1>

        <p class="text-body-2 text-grey">
          Edit therapy session activity documentation.
        </p>

      </div>

      <v-btn variant="tonal" prepend-icon="mdi-arrow-left" @click="goBack">
        Back
      </v-btn>

    </div>

    <!-- SELECTED SESSION -->
    <v-card v-if="selectedSessionData" elevation="1" class="mb-4 rounded-xl">

      <v-card-title>
        Selected Therapy Session
      </v-card-title>

      <v-card-text>

        <v-row>

          <!-- CHILD -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey mb-1">
              Child
            </div>

            <div class="font-weight-medium text-body-1">
              {{
                selectedSessionData
                  .registration?.child?.name
              }}
            </div>

          </v-col>

          <!-- PROGRAM -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey mb-1">
              Program
            </div>

            <div class="font-weight-medium text-body-1">
              {{
                selectedSessionData
                  .registration?.program?.name
              }}
            </div>

          </v-col>

          <!-- THERAPIST -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey mb-1">
              Therapist
            </div>

            <div class="font-weight-medium text-body-1">
              {{
                selectedSessionData
                  .therapist?.name
              }}
            </div>

          </v-col>

          <!-- ROOM -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey mb-1">
              Room
            </div>

            <div class="font-weight-medium text-body-1">
              {{
                selectedSessionData
                  .room?.name
              }}
            </div>

          </v-col>

          <!-- DATE -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey mb-1">
              Date
            </div>

            <div class="font-weight-medium text-body-1">
              {{
                formatDate(
                  selectedSessionData
                    .therapy_date
                )
              }}
            </div>

          </v-col>

          <!-- TIME -->
          <v-col cols="12" md="4">

            <div class="text-caption text-grey mb-1">
              Time
            </div>

            <div class="font-weight-medium text-body-1">
              {{
                selectedSessionData
                  .start_time?.slice(0, 5)
              }}
              -
              {{
                selectedSessionData
                  .end_time?.slice(0, 5)
              }}
            </div>

          </v-col>

        </v-row>

      </v-card-text>

    </v-card>

    <!-- FORM -->
    <v-card elevation="1" class="rounded-xl">

      <v-card-title>
        Activity Form
      </v-card-title>

      <v-card-text>

        <!-- CAPTION -->
        <v-textarea v-model="form.caption" label="Caption" variant="outlined" rows="4" auto-grow class="mb-4" />

        <!-- EXISTING PHOTOS -->
        <div v-if="existingPhotos.length" class="mb-6">

          <div class="text-subtitle-1 font-weight-medium mb-3">
            Existing Photos
          </div>

          <div class="preview-grid">

            <div v-for="photo in existingPhotos" :key="photo.id" class="preview-item">

              <v-img :src="storageUrl(photo.photo)" height="180" cover class="rounded-lg" />
              <v-btn icon size="x-small" color="error" class="preview-delete" @click="deleteExistingPhoto(photo.id)">

                <v-icon size="16">
                  mdi-trash-can-outline
                </v-icon>

              </v-btn>
            </div>

          </div>

        </div>

        <!-- UPLOAD NEW PHOTOS -->
        <v-file-input v-model="form.photos" label="Add New Photos" variant="outlined" prepend-icon="mdi-camera" multiple
          accept="image/*" chips show-size class="mb-4" />

        <!-- EXISTING VIDEO -->
        <div v-if="existingVideo" class="mb-6">

          <div class="text-subtitle-1 font-weight-medium mb-3">
            Existing Video
            <v-btn icon size="x-small" color="error" class="ml-2" @click="deleteExistingVideo">

              <v-icon size="16">
                mdi-trash-can-outline
              </v-icon>

            </v-btn>
          </div>

          <video controls preload="none" class="video-preview">

            <source :src="storageUrl(existingVideo)" type="video/mp4" />

          </video>

        </div>

        <!-- REPLACE VIDEO -->
        <v-file-input v-model="form.video" label="Replace Video" variant="outlined" prepend-icon="mdi-video"
          accept="video/*" show-size class="mb-6" />

        <!-- ACTION -->
        <div class="d-flex justify-end ga-3">

          <v-btn variant="tonal" @click="goBack">
            Cancel
          </v-btn>

          <v-btn color="primary" prepend-icon="mdi-content-save" :loading="loading" :disabled="loading"
            @click="updateActivity">
            Update Activity
          </v-btn>

        </div>

      </v-card-text>

    </v-card>

  </div>

  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top right">

    {{ snackbarText }}

  </v-snackbar>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import api from '@/services/api'

import {
  useRoute,
  useRouter
} from 'vue-router'

// ======================
// ROUTER
// ======================

const route = useRoute()

const router = useRouter()

// ======================
// STATE
// ======================

const snackbar = ref(false)

const snackbarText = ref('')

const snackbarColor = ref('success')

const activityData = ref(null)

const selectedSession = ref(null)

const existingPhotos = ref([])

const existingVideo = ref(null)

const loading = ref(false)

const form = ref({

  caption: '',

  photos: [],

  video: null

})

const showSnackbar = (
  text,
  color = 'success'
) => {

  snackbarText.value = text

  snackbarColor.value = color

  snackbar.value = true

}

// ======================
// GO BACK
// ======================

const goBack = () => {

  router.push('/activity')

}

// ======================
// FETCH ACTIVITY
// ======================

const fetchActivity = async () => {
  try {

    const res = await api.get(
      `/activities/${route.params.id}`
    )

    const activity = res.data.data

    // ======================
    // STORE DATA
    // ======================

    activityData.value = activity

    // ======================
    // SESSION
    // ======================

    selectedSession.value =
      activity.therapy_session_id

    // ======================
    // FORM
    // ======================

    form.value.caption =
      activity.caption || ''

    // ======================
    // EXISTING MEDIA
    // ======================

    existingPhotos.value =
      activity.photos || []

    existingVideo.value =
      activity.video || null

  } catch (err) {

    console.error(err)

  }

}

const updateActivity = async () => {
  try {

    loading.value = true

    const payload = new FormData()

    // ======================
    // METHOD SPOOFING
    // ======================

    payload.append('_method', 'PUT')

    // ======================
    // CAPTION
    // ======================

    payload.append(
      'caption',
      form.value.caption || ''
    )

    // ======================
    // VIDEO
    // ======================

    if (form.value.video) {

      payload.append(
        'video',
        form.value.video
      )

    }

    // ======================
    // PHOTOS
    // ======================

    if (form.value.photos?.length) {

      form.value.photos.forEach(photo => {

        payload.append(
          'photos[]',
          photo
        )

      })

    }

    // ======================
    // API
    // ======================

    await api.post(
      `/activities/${route.params.id}`,
      payload,
      {
        headers: {
          'Content-Type':
            'multipart/form-data'
        }
      }
    )

    showSnackbar(
      'Activity updated successfully'
    )

    router.push('/activity')

  } catch (err) {

    console.error(err)

    showSnackbar(

      err.response?.data?.message ||
      'Failed to update activity',

      'error'

    )

  } finally {

    loading.value = false

  }

}

// ======================
// SELECTED SESSION DATA
// ======================

const selectedSessionData = computed(() => {

  return activityData.value
    ?.therapy_session

})

// ======================
// FORMAT DATE
// ======================

const formatDate = (date) => {

  return new Date(date)
    .toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )

}

// ======================
// STORAGE URL
// ======================

const storageUrl = (path) => {

  return `http://127.0.0.1:8000/storage/${path}`

}

const deleteExistingPhoto = async (
  id
) => {

  const confirmed = confirm(
    'Delete this photo?'
  )

  if (!confirmed) return

  try {

    await api.delete(
      `/activity-photos/${id}`
    )

    existingPhotos.value =
      existingPhotos.value.filter(
        photo => photo.id !== id
      )

    showSnackbar(
      'Photo deleted successfully'
    )

  } catch (err) {

    console.error(err)

    showSnackbar(
      'Failed to delete photo',
      'error'
    )

  }

}

const deleteExistingVideo = async () => {

  const confirmed = confirm(
    'Delete this video?'
  )

  if (!confirmed) return

  try {

    await api.delete(
      `/activities/${route.params.id}/video`
    )

    existingVideo.value = null
    showSnackbar(
      'Video deleted successfully'
    )

  } catch (err) {

    console.error(err)

    showSnackbar(
      'Failed to delete video',
      'error'
    )

  }

}

// ======================
// INIT
// ======================

onMounted(async () => {

  await fetchActivity()

})
</script>

<style scoped>
.activity-create-page {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  flex-wrap: wrap;
}

.preview-delete {
  position: absolute;

  top: 8px;
  right: 8px;

  z-index: 2;
}

.preview-grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(180px, 1fr));

  gap: 16px;
}

.preview-item {
  position: relative;
}

.video-preview {
  width: 100%;
  max-width: 700px;

  border-radius: 16px;

  background: black;
}

@media (max-width: 768px) {

  .page-header {
    flex-direction: column;

    align-items: stretch;
  }

  .page-header .v-btn {
    width: 100%;
  }

}

@media (max-width: 600px) {

  .page-header h1 {
    font-size: 28px !important;

    line-height: 1.2;
  }

  .page-header p {
    font-size: 13px;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }

  .video-preview {
    border-radius: 12px;
  }

}
</style>