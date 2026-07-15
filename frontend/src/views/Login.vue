<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Welcome back</h1>
      <p class="subtitle">Log in to manage patient records.</p>
      <PulseRule />

      <div v-if="error" class="error-msg">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" required autocomplete="email" />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" required autocomplete="current-password" />
        </div>
        <button class="btn btn-primary btn-block" type="submit" :disabled="loading">
          {{ loading ? 'Logging in…' : 'Log in' }}
        </button>
      </form>

      <p class="hint-msg">No account yet? <router-link to="/register" style="color: var(--teal); font-weight: 600;">Create one</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { setAuth } from '../store/auth'
import PulseRule from '../components/PulseRule.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await api.post('/auth/login', { email: email.value, password: password.value })
    setAuth(res.data.token, res.data.user)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Unable to log in. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
