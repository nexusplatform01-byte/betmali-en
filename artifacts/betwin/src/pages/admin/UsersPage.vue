<template>
  <div class="users-page">
    <!-- Header -->
    <div class="page-header">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input v-model="search" placeholder="Search by name, phone or email..." />
      </div>
      <div class="filters">
        <select v-model="statusFilter">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>
      <div class="summary-pills">
        <span class="pill">Total: {{ users.length }}</span>
        <span class="pill green">Active: {{ users.filter(u=>u.status==='active').length }}</span>
        <span class="pill yellow">Suspended: {{ users.filter(u=>u.status==='suspended').length }}</span>
        <span class="pill red">Banned: {{ users.filter(u=>u.status==='banned').length }}</span>
      </div>
    </div>

    <!-- Table -->
    <div class="panel">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Wallet Balance</th>
            <th>Status</th>
            <th>Last Visit</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, i) in filtered" :key="u.id" @click="$router.push('/admin/users/' + u.id)" class="clickable">
            <td class="muted">{{ i + 1 }}</td>
            <td>
              <div class="user-cell">
                <div class="avatar">{{ u.name.charAt(0) }}</div>
                <span>{{ u.name }}</span>
              </div>
            </td>
            <td>{{ u.phone }}</td>
            <td class="muted">{{ u.email }}</td>
            <td class="bold">UGX {{ u.walletBalance.toLocaleString() }}</td>
            <td><span :class="['status-pill', u.status]">{{ u.status }}</span></td>
            <td class="muted">{{ formatDate(u.lastVisit) }}</td>
            <td class="muted">{{ formatDate(u.createdAt) }}</td>
            <td @click.stop>
              <button class="view-btn" @click="$router.push('/admin/users/' + u.id)">View →</button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="9" class="empty">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { users, formatDate } from '../../stores/adminData'

const search = ref('')
const statusFilter = ref('')

const filtered = computed(() => {
  return users.filter(u => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q)
    const matchStatus = !statusFilter.value || u.status === statusFilter.value
    return matchSearch && matchStatus
  })
})
</script>

<style scoped>
.users-page { display: flex; flex-direction: column; gap: 20px; }
.page-header { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.search-bar {
  display: flex; align-items: center; gap: 10px;
  background: #13172b; border: 1px solid #1e2240; border-radius: 8px;
  padding: 10px 14px; flex: 1; min-width: 220px;
}
.search-icon { font-size: 14px; }
.search-bar input { background: transparent; border: none; outline: none; color: #e2e8f0; font-size: 14px; width: 100%; }
.filters select {
  background: #13172b; border: 1px solid #1e2240; border-radius: 8px;
  color: #e2e8f0; padding: 10px 14px; font-size: 13px; outline: none; cursor: pointer;
}
.summary-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.pill { background: #1e2240; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #aaa; }
.pill.green { background: rgba(34,197,94,0.1); color: #22c55e; }
.pill.yellow { background: rgba(245,166,35,0.1); color: #f5a623; }
.pill.red { background: rgba(239,68,68,0.1); color: #ef4444; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 12px 16px; text-align: left; color: #666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; }
.data-table td { padding: 14px 16px; color: #ccc; border-bottom: 1px solid #1a1e35; }
.data-table tr:last-child td { border-bottom: none; }
.clickable { cursor: pointer; transition: background 0.15s; }
.clickable:hover td { background: rgba(124,58,237,0.05); }
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 32px; height: 32px; background: linear-gradient(135deg, #7c3aed, #5c35c9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.bold { color: #fff; font-weight: 700; }
.muted { color: #666 !important; font-size: 12px !important; }
.status-pill { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; }
.status-pill.active { background: rgba(34,197,94,0.15); color: #22c55e; }
.status-pill.suspended { background: rgba(245,166,35,0.15); color: #f5a623; }
.status-pill.banned { background: rgba(239,68,68,0.15); color: #ef4444; }
.view-btn { background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.view-btn:hover { background: rgba(124,58,237,0.25); }
.empty { text-align: center; color: #555; padding: 40px !important; }
</style>
