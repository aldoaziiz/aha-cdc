import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '@/components/Login.vue'
import Dashboard from '@/components/Dashboard.vue'
import Children from '@/components/Children.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
    meta: { layout: 'blank' },
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { layout: 'app' },
  },
  {
    path: '/children',
    component: Children,
    meta: { layout: 'app' },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
