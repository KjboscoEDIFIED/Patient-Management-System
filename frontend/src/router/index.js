import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import PatientList from '../views/PatientList.vue'
import PatientForm from '../views/PatientForm.vue'
import PatientDetail from '../views/PatientDetail.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'Login', component: Login, meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guestOnly: true } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/patients', name: 'PatientList', component: PatientList, meta: { requiresAuth: true } },
  { path: '/patients/new', name: 'PatientNew', component: PatientForm, meta: { requiresAuth: true } },
  { path: '/patients/:id', name: 'PatientDetail', component: PatientDetail, meta: { requiresAuth: true }, props: true },
  { path: '/patients/:id/edit', name: 'PatientEdit', component: PatientForm, meta: { requiresAuth: true }, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.guestOnly && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
