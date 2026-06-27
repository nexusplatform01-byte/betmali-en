import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import { adminAuth } from './stores/adminData'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/profile', component: () => import('./pages/ProfilePage.vue') },

    // Admin login (no auth required)
    { path: '/admin/login', component: () => import('./pages/admin/AdminLogin.vue') },

    // Admin protected routes
    {
      path: '/admin',
      component: () => import('./pages/admin/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', component: () => import('./pages/admin/Dashboard.vue') },
        { path: 'users', component: () => import('./pages/admin/UsersPage.vue') },
        { path: 'users/:id', component: () => import('./pages/admin/UserDetail.vue') },
        { path: 'bets', component: () => import('./pages/admin/BetsPage.vue') },
        { path: 'transactions', component: () => import('./pages/admin/TransactionsPage.vue') },
        { path: 'wallet', component: () => import('./pages/admin/WalletPage.vue') },
        { path: 'settings', component: () => import('./pages/admin/SettingsPage.vue') },
      ]
    },
  ]
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAdmin && !adminAuth.isLoggedIn) {
    next('/admin/login')
  } else if (to.path === '/admin/login' && adminAuth.isLoggedIn) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
