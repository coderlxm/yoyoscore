import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to) => {
  const isRegUser = sessionStorage.getItem('isRegUser')
  if (!isRegUser && to.name !== 'start') {
    return { name: 'start' }
  }
})
export default router
