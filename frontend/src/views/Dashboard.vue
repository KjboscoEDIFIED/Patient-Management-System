<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="eyebrow">Overview</div>
        <h2>Good to see you, {{ auth.user?.full_name?.split(' ')[0] }}</h2>
      </div>
      <router-link to="/patients/new" class="btn btn-primary">+ Register patient</router-link>
    </div>
    <PulseRule />

    <div class="stat-grid">
      <div class="stat-card">
        <div class="value">{{ total }}</div>
        <div class="label">Total patients</div>
      </div>
      <div class="stat-card">
        <div class="value">{{ recent.length }}</div>
        <div class="label">Added recently</div>
      </div>
      <div class="stat-card">
        <div class="value">{{ auth.user?.role }}</div>
        <div class="label">Your role</div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 16px;">Recently registered</h3>
      <div v-if="recent.length === 0" class="empty-state">No patients registered yet.</div>
      <table v-else>
        <thead>
          <tr><th>Name</th><th>Gender</th><th>Phone</th><th>Registered</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in recent" :key="p.id" @click="$router.push('/patients/' + p.id)" style="cursor:pointer;">
            <td class="row-link">{{ p.first_name }} {{ p.last_name }}</td>
            <td><span :class="'badge badge-' + p.gender">{{ p.gender }}</span></td>
            <td>{{ p.phone || '—' }}</td>
            <td>{{ new Date(p.created_at).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useAuth } from '../store/auth'
import PulseRule from '../components/PulseRule.vue'

const auth = useAuth()
const total = ref(0)
const recent = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/patients', { params: { limit: 5 } })
    total.value = res.data.total
    recent.value = res.data.patients
  } catch (err) {
    console.error(err)
  }
})
</script>
