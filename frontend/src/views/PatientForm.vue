<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="eyebrow">{{ isEdit ? 'Update record' : 'New record' }}</div>
        <h2>{{ isEdit ? 'Edit patient' : 'Register patient' }}</h2>
      </div>
    </div>
    <PulseRule />

    <div v-if="error" class="error-msg">{{ error }}</div>

    <form class="card" @submit.prevent="handleSubmit">
      <div class="field-row">
        <div class="field">
          <label>First name</label>
          <input v-model="form.first_name" required />
        </div>
        <div class="field">
          <label>Last name</label>
          <input v-model="form.last_name" required />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>Date of birth</label>
          <input v-model="form.date_of_birth" type="date" required />
        </div>
        <div class="field">
          <label>Gender</label>
          <select v-model="form.gender" required>
            <option value="" disabled>Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>Phone</label>
          <input v-model="form.phone" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" />
        </div>
      </div>

      <div class="field">
        <label>Address</label>
        <input v-model="form.address" />
      </div>

      <div class="field-row">
        <div class="field">
          <label>Blood group</label>
          <input v-model="form.blood_group" placeholder="e.g. O+" />
        </div>
        <div class="field"></div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>Emergency contact name</label>
          <input v-model="form.emergency_contact_name" />
        </div>
        <div class="field">
          <label>Emergency contact phone</label>
          <input v-model="form.emergency_contact_phone" />
        </div>
      </div>

      <div class="toolbar">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Saving…' : (isEdit ? 'Save changes' : 'Register patient') }}
        </button>
        <button class="btn btn-ghost" type="button" @click="$router.back()">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'
import PulseRule from '../components/PulseRule.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const error = ref('')
const loading = ref(false)

const form = reactive({
  first_name: '', last_name: '', date_of_birth: '', gender: '',
  phone: '', email: '', address: '', blood_group: '',
  emergency_contact_name: '', emergency_contact_phone: ''
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await api.get('/patients/' + route.params.id)
      const p = res.data.patient
      Object.keys(form).forEach(k => {
        if (k === 'date_of_birth') {
          form[k] = p[k] ? new Date(p[k]).toISOString().slice(0, 10) : ''
        } else {
          form[k] = p[k] || ''
        }
      })
    } catch (err) {
      error.value = 'Could not load patient details.'
    }
  }
})

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (isEdit.value) {
      await api.put('/patients/' + route.params.id, form)
      router.push('/patients/' + route.params.id)
    } else {
      const res = await api.post('/patients', form)
      router.push('/patients/' + res.data.patient.id)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong. Please check the form and try again.'
  } finally {
    loading.value = false
  }
}
</script>
