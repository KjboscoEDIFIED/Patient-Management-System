<template>
  <Navbar v-if="auth.token" />
  <router-view />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { useAuth } from './store/auth'

const auth = useAuth()
</script>
