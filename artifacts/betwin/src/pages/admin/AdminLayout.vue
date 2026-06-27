<template>
  <div class="admin-wrap">
    <!-- Sidebar -->
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
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
        <button v-if="!sidebarCollapsed" class="logout-btn" @click="handleLogout">Logout</button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="main-area">
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="page-title">{{ currentTitle }}</h1>
        </div>
        <div class="topbar-right">
          <div class="admin-badge">
            <span class="admin-dot"></span>
            Admin
          </div>
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
  { path: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/bets', label: 'Bets', icon: '🎯' },
  { path: '/admin/transactions', label: 'Transactions', icon: '💳' },
  { path: '/admin/wallet', label: 'Wallet', icon: '💰' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

const titleMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Users',
  '/admin/bets': 'Bets Management',
  '/admin/transactions': 'Transactions',
  '/admin/wallet': 'Wallet Overview',
  '/admin/settings': 'Site Settings',
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

function handleLogout() {
  adminLogout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-wrap {
  display: flex;
  min-height: 100vh;
  background: #0d0f1e;
  color: #e2e8f0;
  font-family: 'Inter', system-ui, sans-serif;
}
.sidebar {
  width: 220px;
  background: #13172b;
  border-right: 1px solid #1e2240;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.2s;
}
.sidebar.collapsed { width: 64px; }
.sidebar-logo {
  padding: 24px 16px 20px;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1px;
  border-bottom: 1px solid #1e2240;
  min-height: 64px;
  display: flex;
  align-items: center;
}
.logo-bet { color: #fff; }
.logo-win { color: #f5a623; }
.logo-dot { color: #7c3aed; }
.logo-admin { font-size: 10px; color: #7c3aed; margin-left: 6px; letter-spacing: 2px; font-weight: 600; }
.logo-short { color: #f5a623; }
.nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 8px;
  color: #8892b0;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}
.nav-item:hover { background: #1e2240; color: #e2e8f0; }
.nav-item.active { background: rgba(124, 58, 237, 0.15); color: #a78bfa; }
.nav-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
.nav-label { white-space: nowrap; }
.sidebar-footer {
  padding: 16px 8px;
  border-top: 1px solid #1e2240;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.collapse-btn {
  background: #1e2240;
  border: none;
  color: #aaa;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  width: 100%;
}
.logout-btn {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  width: 100%;
}
.logout-btn:hover { background: rgba(239, 68, 68, 0.2); }
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.topbar {
  background: #13172b;
  border-bottom: 1px solid #1e2240;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.admin-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  color: #a78bfa;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}
.admin-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
}
.time { font-size: 13px; color: #666; }
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>
