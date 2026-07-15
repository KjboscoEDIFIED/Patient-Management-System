<template>
  <div class="page" v-if="patient">
    <div class="page-header">
      <div>
        <div class="eyebrow">Patient profile</div>
        <h2>{{ patient.first_name }} {{ patient.last_name }}</h2>
      </div>
      <div class="toolbar">
        <router-link :to="'/patients/' + patient.id + '/edit'" class="btn btn-ghost">Edit</router-link>
        <button class="btn btn-danger" @click="handleDelete">Delete</button>
      </div>
    </div>
    <PulseRule />

    <div class="detail-grid">
      <div class="card">
        <h3 style="margin-bottom: 14px;">Profile</h3>
        <div class="info-row"><span class="k">Date of birth</span><span class="v">{{ formatDate(patient.date_of_birth) }}</span></div>
        <div class="info-row"><span class="k">Gender</span><span class="v" style="text-transform:capitalize;">{{ patient.gender }}</span></div>
        <div class="info-row"><span class="k">Phone</span><span class="v">{{ patient.phone || '—' }}</span></div>
        <div class="info-row"><span class="k">Email</span><span class="v">{{ patient.email || '—' }}</span></div>
        <div class="info-row"><span class="k">Address</span><span class="v">{{ patient.address || '—' }}</span></div>
        <div class="info-row"><span class="k">Blood group</span><span class="v">{{ patient.blood_group || '—' }}</span></div>
        <div class="info-row"><span class="k">Emergency contact</span><span class="v">{{ patient.emergency_contact_name || '—' }}</span></div>
        <div class="info-row"><span class="k">Emergency phone</span><span class="v">{{ patient.emergency_contact_phone || '—' }}</span></div>
      </div>

      <div>
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px;">
            <h3>Medical records</h3>
            <button class="btn btn-ghost btn-sm" @click="showForm = !showForm">
              {{ showForm ? 'Cancel' : '+ Add record' }}
            </button>
          </div>

          <form v-if="showForm" class="form-panel" @submit.prevent="addRecord" style="margin-top:0; margin-bottom: 20px;">
            <div v-if="recordError" class="error-msg">{{ recordError }}</div>
            <div class="field-row">
              <div class="field">
                <label>Visit date</label>
                <input v-model="recordForm.visit_date" type="date" required />
              </div>
              <div class="field">
                <label>Diagnosis</label>
                <input v-model="recordForm.diagnosis" />
              </div>
            </div>
            <div class="field">
              <label>Treatment</label>
              <input v-model="recordForm.treatment" />
            </div>
            <div class="field">
              <label>Notes</label>
              <textarea v-model="recordForm.notes" rows="3"></textarea>
            </div>
            <button class="btn btn-primary btn-sm" type="submit" :disabled="savingRecord">
              {{ savingRecord ? 'Saving…' : 'Save record' }}
            </button>
          </form>

          <div v-if="records.length === 0" class="empty-state">No medical records yet.</div>
          <div v-else>
            <div class="record-item" v-for="r in records" :key="r.id">
              <div style="display:flex; justify-content:space-between;">
                <span class="date">{{ formatDate(r.visit_date) }}</span>
                <button class="btn btn-danger btn-sm" @click="deleteRecord(r.id)">Delete</button>
              </div>
              <div class="diagnosis" v-if="r.diagnosis">{{ r.diagnosis }}</div>
              <div class="notes" v-if="r.treatment"><strong>Treatment:</strong> {{ r.treatment }}</div>
              <div class="notes" v-if="r.notes">{{ r.notes }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="page" v-else-if="error">
    <div class="error-msg">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'
import PulseRule from '../components/PulseRule.vue'

const route = useRoute()
const router = useRouter()
const patient = ref(null)
const records = ref([])
const error = ref('')
const showForm = ref(false)
const savingRecord = ref(false)
const recordError = ref('')

const recordForm = reactive({ visit_date: '', diagnosis: '', treatment: '', notes: '' })

async function load() {
  try {
    const res = await api.get('/patients/' + route.params.id)
    patient.value = res.data.patient
    records.value = res.data.records
  } catch (err) {
    error.value = 'Patient not found.'
  }
}

async function addRecord() {
  recordError.value = ''
  savingRecord.value = true
  try {
    await api.post('/patients/' + route.params.id + '/records', recordForm)
    recordForm.visit_date = ''; recordForm.diagnosis = ''; recordForm.treatment = ''; recordForm.notes = ''
    showForm.value = false
    await load()
  } catch (err) {
    recordError.value = err.response?.data?.message || 'Could not save record.'
  } finally {
    savingRecord.value = false
  }
}

async function deleteRecord(recordId) {
  if (!confirm('Delete this record?')) return
  await api.delete('/patients/' + route.params.id + '/records/' + recordId)
  await load()
}

async function handleDelete() {
  if (!confirm('Delete this patient and all their records? This cannot be undone.')) return
  await api.delete('/patients/' + route.params.id)
  router.push('/patients')
}

function formatDate(d) {
  return new Date(d).toLocaleDateString()
}

onMounted(load)
</script>
