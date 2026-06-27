<template>
  <div class="tx-page">
    <!-- Summary cards -->
    <div class="summary-grid">
      <div class="sum-card">
        <div class="sum-icon dep">↓</div>
        <div class="sum-body">
          <div class="sum-val">UGX {{ totalDeposits.toLocaleString() }}</div>
          <div class="sum-label">Total Deposits</div>
          <div class="sum-sub">{{ transactions.filter(t=>t.type==='deposit').length }} transactions</div>
        </div>
      </div>
      <div class="sum-card">
        <div class="sum-icon wit">↑</div>
        <div class="sum-body">
          <div class="sum-val">UGX {{ totalWithdrawals.toLocaleString() }}</div>
          <div class="sum-label">Total Withdrawals</div>
          <div class="sum-sub">{{ transactions.filter(t=>t.type==='withdrawal').length }} transactions</div>
        </div>
      </div>
      <div class="sum-card">
        <div class="sum-icon pend">⏳</div>
        <div class="sum-body">
          <div class="sum-val">{{ transactions.filter(t=>t.status==='pending').length }}</div>
          <div class="sum-label">Pending</div>
          <div class="sum-sub">UGX {{ transactions.filter(t=>t.status==='pending').reduce((s,t)=>s+t.amount,0).toLocaleString() }}</div>
        </div>
      </div>
      <div class="sum-card">
        <div class="sum-icon fail">✗</div>
        <div class="sum-body">
          <div class="sum-val">{{ transactions.filter(t=>t.status==='failed').length }}</div>
          <div class="sum-label">Failed</div>
          <div class="sum-sub">UGX {{ transactions.filter(t=>t.status==='failed').reduce((s,t)=>s+t.amount,0).toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <!-- Filters row -->
    <div class="filters-row">
      <div class="search-bar">
        <span>🔍</span>
        <input v-model="search" placeholder="Search reference, user, method..." />
      </div>
      <!-- Quick date filters -->
      <div class="date-filter-tabs">
        <button v-for="df in dateFilters" :key="df.key" :class="['dftab', { active: activeDateFilter === df.key }]" @click="setDateFilter(df.key)">{{ df.label }}</button>
      </div>
      <!-- Calendar picker -->
      <div class="calendar-filter">
        <input type="date" v-model="dateFrom" class="date-input" />
        <span class="date-sep">→</span>
        <input type="date" v-model="dateTo" class="date-input" />
        <button class="clear-btn" @click="clearDates">Clear</button>
      </div>
      <select v-model="typeFilter">
        <option value="">All Types</option>
        <option value="deposit">Deposits</option>
        <option value="withdrawal">Withdrawals</option>
      </select>
      <select v-model="statusFilter">
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <!-- Table -->
    <div class="panel">
      <div class="panel-head">
        <span>{{ filtered.length }} transactions</span>
        <span class="head-total">
          Net: <span class="green">+UGX {{ filteredDeposits.toLocaleString() }}</span>
          <span class="muted"> / </span>
          <span class="red">-UGX {{ filteredWithdrawals.toLocaleString() }}</span>
        </span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date & Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in filtered" :key="tx.id">
            <td class="mono">{{ tx.reference }}</td>
            <td class="user-link" @click="$router.push('/admin/users/' + tx.userId)">{{ getUserName(tx.userId) }}</td>
            <td><span :class="['type-pill', tx.type]">{{ tx.type }}</span></td>
            <td :class="tx.type === 'deposit' ? 'green bold' : 'red bold'">
              {{ tx.type === 'deposit' ? '+' : '-' }}UGX {{ tx.amount.toLocaleString() }}
            </td>
            <td class="muted">{{ tx.method }}</td>
            <td>
              <span :class="['status-pill', tx.status]">{{ tx.status }}</span>
            </td>
            <td class="muted">{{ formatFullDate(tx.createdAt) }}</td>
            <td>
              <select v-if="tx.status === 'pending'" v-model="tx.status" class="inline-select">
                <option value="pending">Pending</option>
                <option value="completed">Approve</option>
                <option value="failed">Reject</option>
              </select>
              <span v-else class="settled">—</span>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="8" class="empty">No transactions found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { transactions, users, formatFullDate } from '../../stores/adminData'

const search = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const activeDateFilter = ref('all')
const dateFrom = ref('')
const dateTo = ref('')

const dateFilters = [
  { key: 'all', label: 'All Time' },
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
]

function setDateFilter(key: string) {
  activeDateFilter.value = key
  const now = new Date()
  dateFrom.value = ''
  dateTo.value = ''
  if (key === 'today') {
    dateFrom.value = now.toISOString().slice(0, 10)
    dateTo.value = now.toISOString().slice(0, 10)
  } else if (key === 'yesterday') {
    const y = new Date(now); y.setDate(y.getDate() - 1)
    dateFrom.value = y.toISOString().slice(0, 10)
    dateTo.value = y.toISOString().slice(0, 10)
  } else if (key === 'week') {
    const s = new Date(now); s.setDate(s.getDate() - s.getDay())
    dateFrom.value = s.toISOString().slice(0, 10)
    dateTo.value = now.toISOString().slice(0, 10)
  } else if (key === 'month') {
    dateFrom.value = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    dateTo.value = now.toISOString().slice(0, 10)
  }
}

function clearDates() {
  dateFrom.value = ''; dateTo.value = ''; activeDateFilter.value = 'all'
}

const filtered = computed(() => {
  return transactions.filter(tx => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || tx.reference.toLowerCase().includes(q) || getUserName(tx.userId).toLowerCase().includes(q) || tx.method.toLowerCase().includes(q)
    const matchType = !typeFilter.value || tx.type === typeFilter.value
    const matchStatus = !statusFilter.value || tx.status === statusFilter.value
    let matchDate = true
    if (dateFrom.value || dateTo.value) {
      const txDate = new Date(tx.createdAt).toISOString().slice(0, 10)
      if (dateFrom.value && txDate < dateFrom.value) matchDate = false
      if (dateTo.value && txDate > dateTo.value) matchDate = false
    }
    return matchSearch && matchType && matchStatus && matchDate
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const totalDeposits = computed(() => transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0))
const totalWithdrawals = computed(() => transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((s, t) => s + t.amount, 0))
const filteredDeposits = computed(() => filtered.value.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0))
const filteredWithdrawals = computed(() => filtered.value.filter(t => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0))

function getUserName(userId: string) {
  return users.find(u => u.id === userId)?.name || userId
}
</script>

<style scoped>
.tx-page { display: flex; flex-direction: column; gap: 20px; }
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.sum-card { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; }
.sum-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; flex-shrink: 0; }
.sum-icon.dep { background: rgba(34,197,94,0.15); color: #22c55e; }
.sum-icon.wit { background: rgba(239,68,68,0.15); color: #ef4444; }
.sum-icon.pend { background: rgba(245,166,35,0.15); color: #f5a623; }
.sum-icon.fail { background: rgba(100,100,100,0.15); color: #888; }
.sum-val { font-size: 18px; font-weight: 800; color: #fff; }
.sum-label { font-size: 12px; color: #888; margin-top: 2px; }
.sum-sub { font-size: 11px; color: #555; margin-top: 2px; }
.filters-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.search-bar { display: flex; align-items: center; gap: 10px; background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 10px 14px; flex: 1; min-width: 180px; }
.search-bar input { background: transparent; border: none; outline: none; color: #e2e8f0; font-size: 14px; width: 100%; }
.date-filter-tabs { display: flex; gap: 2px; background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 4px; }
.dftab { background: transparent; border: none; color: #888; padding: 7px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.dftab.active { background: rgba(124,58,237,0.2); color: #a78bfa; }
.dftab:hover:not(.active) { color: #ccc; }
.calendar-filter { display: flex; align-items: center; gap: 6px; }
.date-input { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; color: #e2e8f0; padding: 8px 10px; font-size: 12px; outline: none; cursor: pointer; }
.date-sep { color: #555; font-size: 12px; }
.clear-btn { background: #1e2240; border: none; color: #aaa; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
select { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; color: #e2e8f0; padding: 10px 12px; font-size: 13px; outline: none; cursor: pointer; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; overflow: hidden; }
.panel-head { padding: 14px 20px; border-bottom: 1px solid #1e2240; font-size: 13px; color: #666; display: flex; justify-content: space-between; align-items: center; }
.head-total { font-size: 13px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 14px; text-align: left; color: #666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; }
.data-table td { padding: 12px 14px; color: #ccc; border-bottom: 1px solid #1a1e35; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 12px !important; }
.muted { color: #666 !important; font-size: 12px !important; }
.bold { font-weight: 700; }
.green { color: #22c55e !important; }
.red { color: #ef4444 !important; }
.user-link { color: #a78bfa !important; cursor: pointer; font-weight: 600; }
.user-link:hover { text-decoration: underline; }
.type-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; }
.type-pill.deposit { background: rgba(34,197,94,0.15); color: #22c55e; }
.type-pill.withdrawal { background: rgba(239,68,68,0.15); color: #ef4444; }
.status-pill { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; }
.status-pill.completed { background: rgba(34,197,94,0.15); color: #22c55e; }
.status-pill.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.status-pill.failed { background: rgba(239,68,68,0.15); color: #ef4444; }
.inline-select { background: #1e2240; border: 1px solid #252840; color: #e2e8f0; padding: 4px 8px; border-radius: 6px; font-size: 12px; cursor: pointer; outline: none; }
.settled { color: #444; }
.empty { text-align: center; color: #555; padding: 40px !important; }
</style>
