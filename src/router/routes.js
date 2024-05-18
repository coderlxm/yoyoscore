import HomeView from '../views/HomeView.vue'
const routes = [
  {
    path: '/',
    name: 'start',
    meta: {
      start: true
    },
    component: () => import('../views/StartPage.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/result',
    name: 'result',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ResultView.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/SettingView.vue')
  },
  {
    path: '/record',
    name: 'record',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/RecordView.vue')
  }
]
export default routes