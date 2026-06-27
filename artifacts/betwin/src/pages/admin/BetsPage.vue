<template>
  <div class="bets-page">
    <!-- Totals -->
    <div class="totals-grid">
      <div class="total-card all">
        <div class="tc-val">{{ bets.length }}</div>
        <div class="tc-label">Total Bets</div>
        <div class="tc-amount">UGX {{ totalStake.toLocaleString() }} staked</div>
      </div>
      <div class="total-card pending">
        <div class="tc-val">{{ pendingBets.length }}</div>
        <div class="tc-label">Pending</div>
        <div class="tc-amount">UGX {{ pendingStake.toLocaleString() }} at risk</div>
      </div>
      <div class="total-card won">
        <div class="tc-val">{{ wonBets.length }}</div>
        <div class="tc-label">Won</div>
        <div class="tc-amount">UGX {{ wonPayout.toLocaleString() }} paid out</div>
      </div>
      <div class="total-card lost">
        <div class="tc-val">{{ lostBets.length }}</div>
        <div class="tc-label">Lost</div>
        <div class="tc-amount">UGX {{ lostStake.toLocaleString() }} collected</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <div class="search-bar">
        <span>🔍</span>
        <input v-model="search" placeholder="Search ticket, match, user..." />
      </div>
      <div class="filter-tabs">
        <button v-for="f in ['All', 'Pending', 'Won', 'Lost']" :key="f" :class="['ftab', { active: statusFilter === f }]" @click="statusFilter = f">{{ f }}</button>
      </div>
      <select v-model="sportFilter">
        <option value="">All Sports</option>
        <option value="Soccer">Soccer</option>
        <option value="Basketball">Basketball</option>
        <option value="Tennis">Tennis</option>
      </select>
    </div>

    <!-- Table -->
    <div class="panel">
      <div class="panel-head">
        <span>{{ filtered.length }} bets shown</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>User</th>
            <th>Match</th>
            <th>Selection</th>
            <th>Sport</th>
            <th>Odds</th>
            <th>Stake</th>
            <th>Potential Win</th>
            <th>Status</th>
            <th>Placed</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in filtered" :key="b.id">
            <td class="mono">{{ b.ticketId }}</td>
            <td class="user-link" @click="$router.push('/admin/users/' + b.userId)">{{ getUserName(b.userId) }}</td>
            <td>{{ b.match }}</td>
            <td class="muted">{{ b.selection }}</td>
            <td class="muted">{{ b.sport }}</td>
            <td class="bold">{{ b.odds }}</td>
            <td>UGX {{ b.stake.toLocaleString() }}</td>
            <td class="green">UGX {{ b.potentialWin.toLocaleString() }}</td>
            <td><span :class="['status-pill', b.status]">{{ b.status }}</span></td>
            <td class="muted">{{ formatDate(b.placedAt) }}</td>
            <td>
              <select v-if="b.status === 'pending'" v-model="b.status" class="inline-select">
                <option value="pending">Pending</option>
                <option value="won">Mark Won</option>
                <option value="lost">Mark Lost</option>
              </select>
              <span v-else class="settled">Settled</span>
            </td>
          </tr>
          <tr v-if="filtered.length === 0"><td colspan="11" class="empty">No bets found</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { bets, users, formatDate } from '../../stores/adminData'

const search = ref('')
const statusFilter = ref('All')
const sportFilter = ref('')

const pendingBets = computed(() => bets.filter(b => b.status === 'pending'))
const wonBets = computed(() => bets.filter(b => b.status === 'won'))
const lostBets = computed(() => bets.filter(b => b.status === 'lost'))
const totalStake = computed(() => bets.reduce((s, b) => s + b.stake, 0))
const pendingStake = computed(() => pendingBets.value.reduce((s, b) => s + b.stake, 0))
const wonPayout = computed(() => wonBets.value.reduce((s, b) => s + b.potentialWin, 0))
const lostStake = computed(() => lostBets.value.reduce((s, b) => s + b.stake, 0))

const filtered = computed(() => {
  return bets.filter(b => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || b.ticketId.toLowerCase().includes(q) || b.match.toLowerCase().includes(q) || getUserName(b.userId).toLowerCase().includes(q)
    const matchStatus = statusFilter.value === 'All' || b.status === statusFilter.value.toLowerCase()
    const matchSport = !sportFilter.value || b.sport === sportFilter.value
    return matchSearch && matchStatus && matchSport
  }).sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
})

function getUserName(userId: string) {
  return users.find(u => u.id === userId)?.name || userId
}
</script>

<style scoped>
.bets-page { display: flex; flex-direction: column; gap: 20px; }
.totals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.total-card { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; padding: 20px; }
.total-card.pending { border-color: rgba(245,166,35,0.3); }
.total-card.won { border-color: rgba(34,197,94,0.3); }
.total-card.lost { border-color: rgba(239,68,68,0.3); }
.tc-val { font-size: 40px; font-weight: 900; color: #fff; }
.total-card.pending .tc-val { color: #f5a623; }
.total-card.won .tc-val { color: #22c55e; }
.total-card.lost .tc-val { color: #ef4444; }
.tc-label { font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
.tc-amount { font-size: 12px; color: #555; margin-top: 6px; }
.filters-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.search-bar { display: flex; align-items: center; gap: 10px; background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 10px 14px; flex: 1; min-width: 200px; }
.search-bar input { background: transparent; border: none; outline: none; color: #e2e8f0; font-size: 14px; width: 100%; }
.filter-tabs { display: flex; gap: 4px; background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 4px; }
.ftab { background: transparent; border: none; color: #888; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
.ftab.active { background: rgba(124,58,237,0.2); color: #a78bfa; }
.ftab:hover:not(.active) { color: #ccc; }
select { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; color: #e2e8f0; padding: 10px 14px; font-size: 13px; outline: none; cursor: pointer; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; overflow: hidden; }
.panel-head { padding: 14px 20px; border-bottom: 1px solid #1e2240; font-size: 13px; color: #666; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 14px; text-align: left; color: #666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; }
.data-table td { padding: 12px 14px; color: #ccc; border-bottom: 1px solid #1a1e35; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 12px !important; }
.muted { color: #666 !important; font-size: 12px !important; }
.bold { color: #fff; font-weight: 700; }
.green { color: #22c55e !important; }
.user-link { color: #a78bfa !important; cursor: pointer; font-weight: 600; }
.user-link:hover { text-decoration: underline; }
.status-pill { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; }
.status-pill.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.status-pill.won { background: rgba(34,197,94,0.15); color: #22c55e; }
.status-pill.lost { background: rgba(239,68,68,0.15); color: #ef4444; }
.inline-select { background: #1e2240; border: 1px solid #252840; color: #e2e8f0; padding: 4px 8px; border-radius: 6px; font-size: 12px; cursor: pointer; outline: none; }
.settled { font-size: 11px; color: #555; }
.empty { text-align: center; color: #555; padding: 40px !important; }
</style>
