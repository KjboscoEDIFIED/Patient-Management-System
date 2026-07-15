<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="eyebrow">Records</div>
        <h2>Patients</h2>
      </div>
      <router-link to="/patients/new" class="btn btn-primary">+ Register patient</router-link>
    </div>
    <PulseRule />

    <div class="search-row">
      <input v-model="search" placeholder="Search by name, email or phone…" @input="debouncedSearch" />
    </div>

    <div class="table-wrap">
      <table v-if="patients.length">
        <thead>
          <tr><th>Name</th><th>DOB</th><th>Gender</th><th>Phone</th><th>Blood group</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in patients" :key="p.id" @click="$router.push('/patients/' + p.id)" style="cursor:pointer;">
            <td class="row-link">{{ p.first_name }} {{ p.last_name }}</td>
            <td>{{ formatDate(p.date_of_birth) }}</td>
            <td><span :class="'badge badge-' + p.gender">{{ p.gender }}</span></td>
            <td>{{ p.phone || '—' }}</td>
            <td>{{ p.blood_group || '—' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        No patients found{{ search ? ' for "' + search + '"' : '' }}.
      </div>
    </div>

    <div v-if="totalPages > 1" style="display:flex; gap:8px; justify-content:center; margin-top:20px;">
      <button class="btn btn-ghost btn-sm" :disabled="page <= 1" @click="changePage(page - 1)">Previous</button>
      <span style="align-self:center; font-size:13px; color: var(--ink-soft);">Page {{ page }} of {{ totalPages }}</span>
      <button class="btn btn-ghost btn-sm" :disabled="page >= totalPages" @click="changePage(page + 1)">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import PulseRule from '../components/PulseRule.vue'

const patients = ref([])
const search = ref('')
const page = ref(1)
const totalPages = ref(1)
let debounceTimer = null

async function fetchPatients() {
  try {
    const res = await api.get('/patients', {
      params: { search: search.value || undefined, page: page.value, limit: 15 }
    })
    patients.value = res.data.patients
    totalPages.value = res.data.totalPages
  } catch (err) {
    console.error(err)
  }
}

function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchPatients() }, 350)
}

function changePage(p) {
  page.value = p
  fetchPatients()
}

function formatDate(d) {
  return new Date(d).toLocaleDateString()
}

onMounted(fetchPatients)
</script>
