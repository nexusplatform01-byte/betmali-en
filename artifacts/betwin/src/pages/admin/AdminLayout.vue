<template>
  <div class="admin-wrap">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-logo">
        <span v-if="!sidebarCollapsed">
          <span class="logo-bet">BET</span><span class="logo-win">WIN</span><span class="logo-dot">.</span>
          <span class="logo-admin">ADMIN</span>
        </span>
        <span v-else class="logo-short">B.</span>
      </div>
      <nav class="nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" active-class="active">
          <span class="nav-icon" v-html="item.icon"></span>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg v-if="sidebarCollapsed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button v-if="!sidebarCollapsed" class="logout-btn" @click="handleLogout">Logout</button>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <h1 class="page-title">{{ currentTitle }}</h1>
        <div class="topbar-right">
          <div class="admin-badge"><span class="admin-dot"></span>Admin</div>
          <div class="time">{{ currentTime }}</div>
        </div>
      </header>
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminLogout } from '../../stores/adminData'

const router = useRouter()
const route = useRoute()
const sidebarCollapsed = ref(false)
const currentTime = ref('')

const navItems = [
  {
    path: '/admin/dashboard', label: 'Dashboard',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
  },
  {
    path: '/admin/users', label: 'Users',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  {
    path: '/admin/bets', label: 'Bets',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  },
  {
    path: '/admin/transactions', label: 'Transactions',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
  },
  {
    path: '/admin/wallet', label: 'Wallet',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`
  },
  {
    path: '/admin/settings', label: 'Settings',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  },
]

const titleMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard', '/admin/users': 'Users',
  '/admin/bets': 'Bets', '/admin/transactions': 'Transactions',
  '/admin/wallet': 'Wallet', '/admin/settings': 'Settings',
}

const currentTitle = computed(() => {
  const path = route.path
  if (path.startsWith('/admin/users/')) return 'User Details'
  return titleMap[path] || 'Admin'
})

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })
}
let timer: ReturnType<typeof setInterval>
onMounted(() => { updateTime(); timer = setInterval(updateTime, 60000) })
onUnmounted(() => clearInterval(timer))

function handleLogout() { adminLogout(); router.push('/admin/login') }
</script>

<style scoped>
* { box-sizing: border-box; }
.admin-wrap { display: flex; height: 100vh; overflow: hidden; background: #0d0f1e; color: #e2e8f0; font-family: system-ui, sans-serif; font-size: 12px; }
.sidebar { width: 180px; background: #13172b; border-right: 1px solid #1e2240; display: flex; flex-direction: column; flex-shrink: 0; transition: width 0.2s; }
.sidebar.collapsed { width: 52px; }
.sidebar-logo { padding: 12px; font-size: 14px; font-weight: 900; border-bottom: 1px solid #1e2240; height: 44px; display: flex; align-items: center; white-space: nowrap; overflow: hidden; }
.logo-bet { color: #fff; } .logo-win { color: #f5a623; } .logo-dot { color: #7c3aed; }
.logo-admin { font-size: 9px; color: #7c3aed; margin-left: 4px; letter-spacing: 2px; font-weight: 600; }
.logo-short { color: #f5a623; }
.nav { flex: 1; padding: 6px; display: flex; flex-direction: column; gap: 1px; overflow: hidden; }
.nav-item { display: flex; align-items: center; gap: 8px; padding: 8px 8px; border-radius: 6px; color: #8892b0; text-decoration: none; font-size: 12px; font-weight: 500; transition: all 0.15s; white-space: nowrap; }
.nav-item:hover { background: #1e2240; color: #e2e8f0; }
.nav-item.active { background: rgba(124,58,237,0.15); color: #a78bfa; }
.nav-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 16px; }
.sidebar-footer { padding: 8px; border-top: 1px solid #1e2240; display: flex; flex-direction: column; gap: 4px; }
.collapse-btn { background: #1e2240; border: none; color: #aaa; padding: 6px; border-radius: 5px; cursor: pointer; font-size: 11px; width: 100%; display: flex; align-items: center; justify-content: center; }
.logout-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #ef4444; padding: 6px 8px; border-radius: 5px; cursor: pointer; font-size: 11px; font-weight: 600; width: 100%; }
.logout-btn:hover { background: rgba(239,68,68,0.2); }
.main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.topbar { background: #13172b; border-bottom: 1px solid #1e2240; padding: 0 16px; height: 44px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.page-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin: 0; }
.topbar-right { display: flex; align-items: center; gap: 10px; }
.admin-badge { display: flex; align-items: center; gap: 5px; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.admin-dot { width: 5px; height: 5px; background: #22c55e; border-radius: 50%; }
.time { font-size: 11px; color: #666; }
.content-area { flex: 1; overflow-y: auto; padding: 14px; min-height: 0; }
</style>
