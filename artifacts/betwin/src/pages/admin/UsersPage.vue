<template>
  <div class="users-page">
    <div class="page-header">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" style="color:#555;flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" placeholder="Search name, phone, email..." />
      </div>
      <select v-model="statusFilter">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="banned">Banned</option>
      </select>
      <div class="pills">
        <span class="pill">{{ users.length }} total</span>
        <span class="pill g">{{ users.filter(u=>u.status==='active').length }} active</span>
        <span class="pill y">{{ users.filter(u=>u.status==='suspended').length }} suspended</span>
        <span class="pill r">{{ users.filter(u=>u.status==='banned').length }} banned</span>
      </div>
    </div>
    <div class="panel">
      <table class="dt">
        <thead>
          <tr><th>#</th><th>User</th><th>Phone</th><th>Email</th><th>Balance</th><th>Status</th><th>Last Visit</th><th>Joined</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="(u,i) in filtered" :key="u.id" class="crow" @click="$router.push('/admin/users/'+u.id)">
            <td class="muted">{{ i+1 }}</td>
            <td><div class="uc"><div class="av">{{ u.name.charAt(0) }}</div><span>{{ u.name }}</span></div></td>
            <td>{{ u.phone }}</td>
            <td class="muted">{{ u.email }}</td>
            <td class="bold">UGX {{ u.walletBalance.toLocaleString() }}</td>
            <td><span :class="['sp', u.status]">{{ u.status }}</span></td>
            <td class="muted">{{ formatDate(u.lastVisit) }}</td>
            <td class="muted">{{ formatDate(u.createdAt) }}</td>
            <td @click.stop><button class="vb" @click="$router.push('/admin/users/'+u.id)">View &#8594;</button></td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="9" class="empty">No users found</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { users, formatDate } from '../../stores/adminData'
const search = ref(''); const statusFilter = ref('')
const filtered = computed(() => users.filter(u => {
  const q = search.value.toLowerCase()
  const ms = !q || u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q)
  return ms && (!statusFilter.value || u.status === statusFilter.value)
}))
</script>

<style scoped>
.users-page { display: flex; flex-direction: column; gap: 10px; height: 100%; }
.page-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.search-bar { display: flex; align-items: center; gap: 8px; background: #13172b; border: 1px solid #1e2240; border-radius: 6px; padding: 6px 10px; flex: 1; min-width: 180px; }
.search-bar input { background: transparent; border: none; outline: none; color: #e2e8f0; font-size: 12px; width: 100%; }
select { background: #13172b; border: 1px solid #1e2240; border-radius: 6px; color: #e2e8f0; padding: 6px 10px; font-size: 11px; outline: none; cursor: pointer; }
.pills { display: flex; gap: 6px; }
.pill { background: #1e2240; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 600; color: #aaa; }
.pill.g { background: rgba(34,197,94,0.1); color: #22c55e; }
.pill.y { background: rgba(245,166,35,0.1); color: #f5a623; }
.pill.r { background: rgba(239,68,68,0.1); color: #ef4444; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; overflow: auto; flex: 1; }
.dt { width: 100%; border-collapse: collapse; font-size: 11px; }
.dt th { padding: 7px 10px; text-align: left; color: #555; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; position: sticky; top: 0; }
.dt td { padding: 8px 10px; color: #bbb; border-bottom: 1px solid #1a1e35; white-space: nowrap; }
.dt tr:last-child td { border-bottom: none; }
.crow { cursor: pointer; transition: background 0.1s; }
.crow:hover td { background: rgba(124,58,237,0.04); }
.uc { display: flex; align-items: center; gap: 7px; }
.av { width: 26px; height: 26px; background: linear-gradient(135deg,#7c3aed,#5c35c9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; flex-shrink: 0; }
.bold { color: #fff; font-weight: 700; }
.muted { color: #555 !important; font-size: 10px !important; }
.sp { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 8px; text-transform: uppercase; }
.sp.active { background: rgba(34,197,94,0.15); color: #22c55e; }
.sp.suspended { background: rgba(245,166,35,0.15); color: #f5a623; }
.sp.banned { background: rgba(239,68,68,0.15); color: #ef4444; }
.vb { background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.25); color: #a78bfa; padding: 4px 10px; border-radius: 5px; font-size: 10px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.vb:hover { background: rgba(124,58,237,0.22); }
.empty { text-align: center; color: #444; padding: 30px !important; }
</style>
