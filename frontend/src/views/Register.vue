<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Create an account</h1>
      <p class="subtitle">Set up staff access to the system.</p>
      <PulseRule />

      <div v-if="error" class="error-msg">{{ error }}</div>

      <form @submit.prevent="handleRegister">
        <div class="field">
          <label>Full name</label>
          <input v-model="full_name" type="text" required />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" required autocomplete="email" />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" required minlength="6" autocomplete="new-password" />
        </div>
        <div class="field">
          <label>Role</label>
          <select v-model="role">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button class="btn btn-primary btn-block" type="submit" :disabled="loading">
          {{ loading ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

      <p class="hint-msg">Already have an account? <router-link to="/login" style="color: var(--teal); font-weight: 600;">Log in</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { setAuth } from '../store/auth'
import PulseRule from '../components/PulseRule.vue'

const full_name = ref('')
const email = ref('')
const password = ref('')
const role = ref('staff')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    const res = await api.post('/auth/register', {
      full_name: full_name.value, email: email.value, password: password.value, role: role.value
    })
    setAuth(res.data.token, res.data.user)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Unable to create account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
