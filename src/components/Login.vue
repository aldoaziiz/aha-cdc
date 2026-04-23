<template>
  <div class="login-page">
    <v-container class="login-container" fluid>
      <v-row class="h-100" no-gutters>
        <!-- Left Section - Branding -->
        <v-col cols="12" sm="6" class="d-none d-sm-flex left-section">
          <div class="branding-content">
            <img src="@/assets/ahacdc-logo.jpeg" alt="Login Illustration" class="mb-6" style="max-width: 100%; height: auto;" />
          </div>
        </v-col>

        <!-- Right Section - Login Form -->
        <v-col cols="12" sm="6" class="d-flex right-section">
          <div class="form-wrapper">
            <!-- Header -->
            <div class="text-center mb-8">
              <v-icon size="48" color="#E6611D" class="mb-4">mdi-account-circle</v-icon>  
              <h1 class="text-h3 font-weight-bold mb-4">Selamat Datang</h1>
              <p class="text-body1 mb-8">Silahkan login menggunakan akun Anda</p>
            </div>

            <!-- Success Alert -->
            <v-alert
              v-if="successMessage"
              type="success"
              class="mb-6"
              closable
            >
              {{ successMessage }}
            </v-alert>

            <!-- Error Alert -->
            <v-alert
              v-if="errorMessage"
              type="error"
              class="mb-6"
              closable
              @update:model-value="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- Login Form -->
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                class="mb-6"
                :rules="emailRules"
                :error="!!errorMessage"
                required
              />

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                class="mb-4"
                :rules="passwordRules"
                :error="!!errorMessage"
                required
              />

              <!-- Remember Me & Forgot Password -->
              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="rememberMe"
                  label="Remember me"
                  density="compact"
                  class="flex-grow-0"
                />
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  class="text-none"
                >
                  Lupa password?
                </v-btn>
              </div>

              <!-- Sign In Button -->
              <v-btn
                type="submit"
                block
                color="#64AF64"
                size="large"
                :loading="isLoading"
                class="mb-4 font-weight-bold"
              >
                Login
              </v-btn>

              
            </v-form>

          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const form = ref<InstanceType<typeof VForm>>()

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
]

const handleLogin = async () => {
  const isValid = await form.value?.validate()

  if (!isValid?.valid) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful login
    successMessage.value = 'Login successful! Redirecting...'
    console.log('Login successful for:', email.value)
    console.log('Remember me:', rememberMe.value)

    // Store user email in localStorage
    localStorage.setItem('userEmail', email.value)

    // Navigate to dashboard after 1 second
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (error) {
    errorMessage.value = 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.login-container {
  display: flex;
  align-items: center;
  min-height: 100vh;
}

.h-100 {
  height: 100%;
}

.left-section {
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  padding: 60px 40px;
  min-height: 100vh;
}

.branding-content {
  text-align: center;
  max-width: 400px;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 30px;
  background: #f8f9fa;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.divider {
  position: relative;
  text-align: center;
  color: #999;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 50px);
  height: 1px;
  background: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-buttons {
  width: 100%;
}

@media (max-width: 600px) {
  .left-section {
    padding: 30px 20px;
  }

  .right-section {
    padding: 30px 20px;
    min-height: auto;
  }

  .form-wrapper {
    max-width: 100%;
  }
}
</style>
