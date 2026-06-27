import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/profile', component: () => import('./pages/ProfilePage.vue') },
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
