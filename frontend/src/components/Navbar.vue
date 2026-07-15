<template>
  <header class="navbar">
    <div class="brand"><span class="dot"></span> MediChart</div>
    <nav>
      <router-link to="/dashboard" :class="{ active: route.path === '/dashboard' }">Dashboard</router-link>
      <router-link to="/patients" :class="{ active: route.path.startsWith('/patients') }">Patients</router-link>
      <span class="user-chip" v-if="auth.user">{{ auth.user.full_name }} · {{ auth.user.role }}</span>
      <button class="logout" @click="logout">Log out</button>
    </nav>
  </header>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuth, clearAuth } from '../store/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

function logout() {
  clearAuth()
  router.push('/login')
}
</script>
