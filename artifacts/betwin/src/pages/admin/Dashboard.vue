<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card" v-for="s in stats" :key="s.label">
        <div class="si" :style="{background: s.bg}" v-html="s.icon"></div>
        <div>
          <div class="sv">{{ s.value }}</div>
          <div class="sl">{{ s.label }}</div>
          <div class="ss" :style="{color: s.subColor}">{{ s.sub }}</div>
        </div>
      </div>
    </div>

    <div class="two-col">
      <div class="panel">
        <div class="ph"><span>Recent Users</span><router-link to="/admin/users" class="va">View All</router-link></div>
        <div v-for="u in recentUsers" :key="u.id" class="lr" @click="$router.push('/admin/users/'+u.id)">
          <div class="av">{{ u.name.charAt(0) }}</div>
          <div class="li"><div class="ln">{{ u.name }}</div><div class="lm">{{ u.phone }}</div></div>
          <div class="lright"><div class="la">{{ fmt(u.walletBalance) }}</div><span :class="['sp', u.status]">{{ u.status }}</span></div>
        </div>
        <div v-if="!recentUsers.length" class="empty-list">No users yet</div>
      </div>
      <div class="panel">
        <div class="ph"><span>Recent Transactions</span><router-link to="/admin/transactions" class="va">View All</router-link></div>
        <div v-for="tx in recentTxs" :key="tx.id" class="lr">
          <div :class="['ti', tx.type]">
            <svg v-if="tx.type==='deposit'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          </div>
          <div class="li"><div class="ln">{{ getUserName(tx.userId) }}</div><div class="lm">{{ tx.method }} · {{ formatDate(tx.createdAt) }}</div></div>
          <div class="lright"><div :class="['ta', tx.type]">{{ tx.type==='deposit'?'+':'-' }}{{ fmt(tx.amount) }}</div><span :class="['sp', tx.status]">{{ tx.status }}</span></div>
        </div>
        <div v-if="!recentTxs.length" class="empty-list">No transactions yet</div>
      </div>
    </div>

    <div class="panel">
      <div class="ph"><span>Recent Bets</span><router-link to="/admin/bets" class="va">View All</router-link></div>
      <table class="dt">
        <thead><tr><th>Ticket</th><th>User</th><th>Match</th><th>Odds</th><th>Stake</th><th>Potential</th><th>Status</th><th>Placed</th></tr></thead>
        <tbody>
          <tr v-for="b in recentBets" :key="b.id">
            <td class="mono">{{ b.ticketId }}</td>
            <td>{{ getUserName(b.userId) }}</td>
            <td class="mc">{{ b.match }}</td>
            <td>{{ b.odds }}</td>
            <td>{{ fmt(b.stake) }}</td>
            <td class="green">{{ fmt(b.potentialWin) }}</td>
            <td><span :class="['sp', b.status]">{{ b.status }}</span></td>
            <td class="muted">{{ formatDate(b.placedAt) }}</td>
          </tr>
          <tr v-if="!recentBets.length"><td colspan="8" class="empty-list">No bets yet</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { users, bets, transactions, siteSettings, formatDate } from '../../stores/adminData'

const fmt = (n: number) => n.toLocaleString()
const totalUsersWallet = computed(() => users.reduce((s, u) => s + u.walletBalance, 0))

const ICON_USERS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
const ICON_BETS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="16 8 12 12 8 8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>`
const ICON_DEPOSIT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
const ICON_WITHDRAW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`
const ICON_WALLET = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/></svg>`
const ICON_SITE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`

const stats = computed(() => [
  { icon: ICON_USERS, label: 'Total Users', value: users.length, sub: users.filter(u=>u.status==='active').length+' active', bg: 'rgba(124,58,237,0.15)', subColor: '#22c55e' },
  { icon: ICON_BETS, label: 'Total Bets', value: bets.length, sub: bets.filter(b=>b.status==='pending').length+' pending', bg: 'rgba(245,166,35,0.15)', subColor: '#f5a623' },
  { icon: ICON_DEPOSIT, label: 'Deposits', value: fmt(transactions.filter(t=>t.type==='deposit'&&t.status==='completed').reduce((s,t)=>s+t.amount,0)), sub: 'UGX total', bg: 'rgba(59,130,246,0.15)', subColor: '#60a5fa' },
  { icon: ICON_WITHDRAW, label: 'Withdrawals', value: fmt(transactions.filter(t=>t.type==='withdrawal'&&t.status==='completed').reduce((s,t)=>s+t.amount,0)), sub: 'UGX total', bg: 'rgba(239,68,68,0.15)', subColor: '#ef4444' },
  { icon: ICON_WALLET, label: 'Users Wallet', value: fmt(totalUsersWallet.value), sub: 'UGX combined', bg: 'rgba(34,197,94,0.15)', subColor: '#22c55e' },
  { icon: ICON_SITE, label: 'Site Balance', value: fmt(siteSettings.siteBalance), sub: 'UGX', bg: 'rgba(20,184,166,0.15)', subColor: '#2dd4bf' },
])

const recentUsers = computed(() => [...users].sort((a,b)=>new Date(b.lastVisit).getTime()-new Date(a.lastVisit).getTime()).slice(0,5))
const recentTxs = computed(() => [...transactions].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,5))
const recentBets = computed(() => [...bets].sort((a,b)=>new Date(b.placedAt).getTime()-new Date(a.placedAt).getTime()).slice(0,5))
function getUserName(id: string) { return users.find(u=>u.id===id)?.name||id }
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 12px; }
.stats-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 10px; }
.stat-card { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 10px; }
.si { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #e2e8f0; }
.sv { font-size: 15px; font-weight: 800; color: #fff; }
.sl { font-size: 10px; color: #888; margin-top: 1px; }
.ss { font-size: 10px; margin-top: 1px; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; overflow: hidden; }
.ph { padding: 8px 12px; border-bottom: 1px solid #1e2240; font-size: 12px; font-weight: 700; color: #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.va { font-size: 11px; color: #7c3aed; text-decoration: none; }
.va:hover { text-decoration: underline; }
.lr { display: flex; align-items: center; gap: 8px; padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #0d0f1e; }
.lr:last-child { border-bottom: none; }
.lr:hover { background: rgba(255,255,255,0.02); }
.av { width: 28px; height: 28px; background: linear-gradient(135deg,#7c3aed,#5c35c9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
.ti { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ti.deposit { background: rgba(34,197,94,0.15); color: #22c55e; }
.ti.withdrawal { background: rgba(239,68,68,0.15); color: #ef4444; }
.li { flex: 1; min-width: 0; }
.ln { font-size: 12px; color: #e2e8f0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lm { font-size: 10px; color: #666; margin-top: 1px; }
.lright { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
.la { font-size: 12px; font-weight: 700; color: #fff; }
.ta.deposit { font-size: 11px; font-weight: 700; color: #22c55e; }
.ta.withdrawal { font-size: 11px; font-weight: 700; color: #ef4444; }
.sp { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 8px; text-transform: uppercase; }
.sp.active,.sp.completed,.sp.won { background: rgba(34,197,94,0.15); color: #22c55e; }
.sp.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.sp.suspended,.sp.lost,.sp.failed { background: rgba(239,68,68,0.15); color: #ef4444; }
.sp.banned { background: rgba(100,100,100,0.2); color: #888; }
.dt { width: 100%; border-collapse: collapse; font-size: 11px; }
.dt th { padding: 6px 12px; text-align: left; color: #555; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; }
.dt td { padding: 8px 12px; color: #bbb; border-bottom: 1px solid #0d0f1e; }
.dt tr:last-child td { border-bottom: none; }
.dt tr:hover td { background: rgba(255,255,255,0.02); }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 10px !important; }
.mc { max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.green { color: #22c55e !important; }
.muted { color: #555 !important; font-size: 10px !important; }
.empty-list { padding: 20px; text-align: center; color: #444; font-size: 11px; }
</style>
