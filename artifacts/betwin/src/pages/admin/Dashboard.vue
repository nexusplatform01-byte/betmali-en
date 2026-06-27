<template>
  <div class="dashboard">
    <!-- Stats Row -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon purple">👥</div>
        <div class="stat-body">
          <div class="stat-value">{{ users.length }}</div>
          <div class="stat-label">Total Users</div>
          <div class="stat-sub green">{{ activeUsers }} active</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">🎯</div>
        <div class="stat-body">
          <div class="stat-value">{{ bets.length }}</div>
          <div class="stat-label">Total Bets</div>
          <div class="stat-sub yellow">{{ pendingBets }} pending</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">💳</div>
        <div class="stat-body">
          <div class="stat-value">{{ fmt(totalDeposits) }}</div>
          <div class="stat-label">Total Deposits</div>
          <div class="stat-sub green">UGX</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">💸</div>
        <div class="stat-body">
          <div class="stat-value">{{ fmt(totalWithdrawals) }}</div>
          <div class="stat-label">Total Withdrawals</div>
          <div class="stat-sub">UGX</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">💰</div>
        <div class="stat-body">
          <div class="stat-value">{{ fmt(totalUsersWallet) }}</div>
          <div class="stat-label">Users Wallet Total</div>
          <div class="stat-sub">UGX</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon teal">🏦</div>
        <div class="stat-body">
          <div class="stat-value">{{ fmt(siteSettings.siteBalance) }}</div>
          <div class="stat-label">Site Balance</div>
          <div class="stat-sub">UGX</div>
        </div>
      </div>
    </div>

    <!-- Two columns -->
    <div class="two-col">
      <!-- Recent Users -->
      <div class="panel">
        <div class="panel-head">
          <span>Recent Users</span>
          <router-link to="/admin/users" class="view-all">View All →</router-link>
        </div>
        <div class="panel-body">
          <div v-for="u in recentUsers" :key="u.id" class="list-row" @click="$router.push('/admin/users/' + u.id)">
            <div class="user-avatar">{{ u.name.charAt(0) }}</div>
            <div class="list-info">
              <div class="list-name">{{ u.name }}</div>
              <div class="list-sub">{{ u.phone }}</div>
            </div>
            <div class="list-right">
              <div class="list-amount">{{ fmt(u.walletBalance) }}</div>
              <div :class="['status-pill', u.status]">{{ u.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="panel">
        <div class="panel-head">
          <span>Recent Transactions</span>
          <router-link to="/admin/transactions" class="view-all">View All →</router-link>
        </div>
        <div class="panel-body">
          <div v-for="tx in recentTxs" :key="tx.id" class="list-row">
            <div :class="['tx-icon', tx.type]">{{ tx.type === 'deposit' ? '↓' : '↑' }}</div>
            <div class="list-info">
              <div class="list-name">{{ getUserName(tx.userId) }}</div>
              <div class="list-sub">{{ tx.method }} · {{ formatDate(tx.createdAt) }}</div>
            </div>
            <div class="list-right">
              <div :class="['tx-amount', tx.type]">{{ tx.type === 'deposit' ? '+' : '-' }}{{ fmt(tx.amount) }}</div>
              <div :class="['status-pill', tx.status]">{{ tx.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bets -->
    <div class="panel mt">
      <div class="panel-head">
        <span>Recent Bets</span>
        <router-link to="/admin/bets" class="view-all">View All →</router-link>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>User</th>
            <th>Match</th>
            <th>Odds</th>
            <th>Stake</th>
            <th>Potential Win</th>
            <th>Status</th>
            <th>Placed</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in recentBets" :key="b.id">
            <td class="mono">{{ b.ticketId }}</td>
            <td>{{ getUserName(b.userId) }}</td>
            <td class="match-cell">{{ b.match }}</td>
            <td>{{ b.odds }}</td>
            <td>{{ fmt(b.stake) }}</td>
            <td class="green">{{ fmt(b.potentialWin) }}</td>
            <td><span :class="['status-pill', b.status]">{{ b.status }}</span></td>
            <td class="muted">{{ formatDate(b.placedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { users, bets, transactions, siteSettings, formatDate } from '../../stores/adminData'

const fmt = (n: number) => n.toLocaleString()

const activeUsers = computed(() => users.filter(u => u.status === 'active').length)
const pendingBets = computed(() => bets.filter(b => b.status === 'pending').length)
const totalDeposits = computed(() => transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0))
const totalWithdrawals = computed(() => transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((s, t) => s + t.amount, 0))
const totalUsersWallet = computed(() => users.reduce((s, u) => s + u.walletBalance, 0))

const recentUsers = computed(() => [...users].sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()).slice(0, 5))
const recentTxs = computed(() => [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5))
const recentBets = computed(() => [...bets].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()).slice(0, 6))

function getUserName(userId: string) {
  return users.find(u => u.id === userId)?.name || userId
}
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.stat-card {
  background: #13172b;
  border: 1px solid #1e2240;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.stat-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.stat-icon.purple { background: rgba(124,58,237,0.15); }
.stat-icon.orange { background: rgba(245,166,35,0.15); }
.stat-icon.blue { background: rgba(59,130,246,0.15); }
.stat-icon.red { background: rgba(239,68,68,0.15); }
.stat-icon.green { background: rgba(34,197,94,0.15); }
.stat-icon.teal { background: rgba(20,184,166,0.15); }
.stat-value { font-size: 20px; font-weight: 800; color: #fff; }
.stat-label { font-size: 11px; color: #888; margin-top: 2px; }
.stat-sub { font-size: 11px; color: #666; margin-top: 2px; }
.stat-sub.green { color: #22c55e; }
.stat-sub.yellow { color: #f5a623; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.panel {
  background: #13172b;
  border: 1px solid #1e2240;
  border-radius: 12px;
  overflow: hidden;
}
.panel.mt { margin-top: 0; }
.panel-head {
  padding: 16px 20px;
  border-bottom: 1px solid #1e2240;
  font-size: 14px;
  font-weight: 700;
  color: #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.view-all { font-size: 12px; color: #7c3aed; text-decoration: none; font-weight: 500; }
.panel-body { padding: 8px 0; }
.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.15s;
}
.list-row:hover { background: rgba(255,255,255,0.03); }
.user-avatar {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #7c3aed, #5c35c9);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.tx-icon {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; flex-shrink: 0;
}
.tx-icon.deposit { background: rgba(34,197,94,0.15); color: #22c55e; }
.tx-icon.withdrawal { background: rgba(239,68,68,0.15); color: #ef4444; }
.list-info { flex: 1; min-width: 0; }
.list-name { font-size: 13px; color: #e2e8f0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.list-sub { font-size: 11px; color: #666; margin-top: 2px; }
.list-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.list-amount { font-size: 13px; font-weight: 700; color: #fff; }
.tx-amount.deposit { color: #22c55e; font-size: 13px; font-weight: 700; }
.tx-amount.withdrawal { color: #ef4444; font-size: 13px; font-weight: 700; }
.status-pill {
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px;
}
.status-pill.active, .status-pill.completed, .status-pill.won { background: rgba(34,197,94,0.15); color: #22c55e; }
.status-pill.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.status-pill.suspended, .status-pill.lost, .status-pill.failed { background: rgba(239,68,68,0.15); color: #ef4444; }
.status-pill.banned { background: rgba(100,100,100,0.2); color: #888; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 20px; text-align: left; color: #666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; border-bottom: 1px solid #1e2240; }
.data-table td { padding: 12px 20px; color: #ccc; border-bottom: 1px solid #0d0f1e; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 12px !important; }
.match-cell { max-width: 200px; }
.green { color: #22c55e !important; }
.muted { color: #666 !important; font-size: 12px !important; }
</style>
