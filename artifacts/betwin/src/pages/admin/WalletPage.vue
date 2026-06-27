<template>
  <div class="wallet-page">
    <!-- Main balance cards -->
    <div class="balance-grid">
      <div class="balance-card primary">
        <div class="bc-icon">🏦</div>
        <div class="bc-body">
          <div class="bc-label">Real Site Balance</div>
          <div class="bc-val">UGX {{ siteSettings.siteBalance.toLocaleString() }}</div>
          <div class="bc-sub">Full gross balance in site account</div>
        </div>
      </div>
      <div class="balance-card users">
        <div class="bc-icon">👥</div>
        <div class="bc-body">
          <div class="bc-label">Total Users Wallet Balance</div>
          <div class="bc-val">UGX {{ totalUsersWallet.toLocaleString() }}</div>
          <div class="bc-sub">Sum of all user wallets ({{ users.length }} users)</div>
        </div>
      </div>
      <div class="balance-card pending">
        <div class="bc-icon">🎯</div>
        <div class="bc-body">
          <div class="bc-label">Pending Bets Balance</div>
          <div class="bc-val">UGX {{ pendingBetsTotal.toLocaleString() }}</div>
          <div class="bc-sub">At-risk stake in {{ pendingBetsCount }} active bets</div>
        </div>
      </div>
      <div class="balance-card net">
        <div class="bc-icon">💵</div>
        <div class="bc-body">
          <div class="bc-label">Site Balance (minus users)</div>
          <div class="bc-val" :class="siteMinusUsers < 0 ? 'red' : ''">UGX {{ siteMinusUsers.toLocaleString() }}</div>
          <div class="bc-sub">Site balance after removing all user wallets</div>
        </div>
      </div>
      <div class="balance-card net2">
        <div class="bc-icon">📊</div>
        <div class="bc-body">
          <div class="bc-label">Site Balance (minus users & pending)</div>
          <div class="bc-val" :class="siteMinusUsersPending < 0 ? 'red' : ''">UGX {{ siteMinusUsersPending.toLocaleString() }}</div>
          <div class="bc-sub">True available balance after all obligations</div>
        </div>
      </div>
    </div>

    <!-- Balance breakdown visual -->
    <div class="breakdown-panel">
      <div class="bp-head">Balance Breakdown</div>
      <div class="bp-body">
        <div class="bp-row">
          <div class="bp-label">Real Site Balance</div>
          <div class="bp-bar-wrap">
            <div class="bp-bar" style="background:#7c3aed" :style="{ width: '100%' }"></div>
          </div>
          <div class="bp-val">UGX {{ siteSettings.siteBalance.toLocaleString() }}</div>
        </div>
        <div class="bp-row">
          <div class="bp-label">Users Wallets</div>
          <div class="bp-bar-wrap">
            <div class="bp-bar" style="background:#3b82f6" :style="{ width: pct(totalUsersWallet) }"></div>
          </div>
          <div class="bp-val">UGX {{ totalUsersWallet.toLocaleString() }}</div>
        </div>
        <div class="bp-row">
          <div class="bp-label">Pending Bets</div>
          <div class="bp-bar-wrap">
            <div class="bp-bar" style="background:#f5a623" :style="{ width: pct(pendingBetsTotal) }"></div>
          </div>
          <div class="bp-val">UGX {{ pendingBetsTotal.toLocaleString() }}</div>
        </div>
        <div class="bp-row">
          <div class="bp-label">Free Site Balance</div>
          <div class="bp-bar-wrap">
            <div class="bp-bar" style="background:#22c55e" :style="{ width: pct(Math.max(0, siteMinusUsersPending)) }"></div>
          </div>
          <div class="bp-val">UGX {{ Math.max(0, siteMinusUsersPending).toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <!-- Two panels: Users wallet list + Pending bets -->
    <div class="two-col">
      <!-- Users wallet list -->
      <div class="panel">
        <div class="panel-head">
          <span>Users Wallet Balances</span>
          <span class="total-badge">Total: UGX {{ totalUsersWallet.toLocaleString() }}</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Wallet Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usersSorted" :key="u.id" class="clickable" @click="$router.push('/admin/users/' + u.id)">
              <td>
                <div class="user-cell">
                  <div class="avatar">{{ u.name.charAt(0) }}</div>
                  <span>{{ u.name }}</span>
                </div>
              </td>
              <td class="muted">{{ u.phone }}</td>
              <td class="bold">UGX {{ u.walletBalance.toLocaleString() }}</td>
              <td><span :class="['status-pill', u.status]">{{ u.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pending bets -->
      <div class="panel">
        <div class="panel-head">
          <span>Pending Bets at Risk</span>
          <span class="total-badge yellow">UGX {{ pendingBetsTotal.toLocaleString() }}</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>User</th>
              <th>Stake</th>
              <th>Potential Win</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in pendingBets" :key="b.id">
              <td class="mono">{{ b.ticketId }}</td>
              <td class="user-link" @click="$router.push('/admin/users/' + b.userId)">{{ getUserName(b.userId) }}</td>
              <td>UGX {{ b.stake.toLocaleString() }}</td>
              <td class="red">UGX {{ b.potentialWin.toLocaleString() }}</td>
            </tr>
            <tr v-if="pendingBets.length === 0">
              <td colspan="4" class="empty">No pending bets</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Site balance adjustment -->
    <div class="panel">
      <div class="panel-head">Adjust Site Balance</div>
      <div class="adjust-row">
        <div class="adjust-form">
          <input v-model.number="adjustAmount" type="number" placeholder="Amount (UGX)" class="adj-input" />
          <input v-model="adjustNote" type="text" placeholder="Reason / Note" class="adj-input" />
          <button class="adj-btn green" @click="doAdjust('add')">+ Add to Site</button>
          <button class="adj-btn red" @click="doAdjust('deduct')">- Deduct from Site</button>
          <div v-if="adjustMsg" class="adj-msg">{{ adjustMsg }}</div>
        </div>
        <div class="adj-current">
          <div class="adj-cur-label">Current Site Balance</div>
          <div class="adj-cur-val">UGX {{ siteSettings.siteBalance.toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { users, bets, siteSettings, formatDate } from '../../stores/adminData'

const pendingBets = computed(() => bets.filter(b => b.status === 'pending'))
const pendingBetsTotal = computed(() => pendingBets.value.reduce((s, b) => s + b.stake, 0))
const pendingBetsCount = computed(() => pendingBets.value.length)
const totalUsersWallet = computed(() => users.reduce((s, u) => s + u.walletBalance, 0))
const siteMinusUsers = computed(() => siteSettings.siteBalance - totalUsersWallet.value)
const siteMinusUsersPending = computed(() => siteSettings.siteBalance - totalUsersWallet.value - pendingBetsTotal.value)
const usersSorted = computed(() => [...users].sort((a, b) => b.walletBalance - a.walletBalance))

function pct(val: number) {
  const max = siteSettings.siteBalance || 1
  return Math.min(100, Math.round((val / max) * 100)) + '%'
}

function getUserName(userId: string) {
  return users.find(u => u.id === userId)?.name || userId
}

const adjustAmount = ref(0)
const adjustNote = ref('')
const adjustMsg = ref('')

function doAdjust(type: 'add' | 'deduct') {
  if (adjustAmount.value <= 0) return
  if (type === 'add') {
    siteSettings.siteBalance += adjustAmount.value
    adjustMsg.value = `✅ Added UGX ${adjustAmount.value.toLocaleString()} to site balance`
  } else {
    siteSettings.siteBalance = Math.max(0, siteSettings.siteBalance - adjustAmount.value)
    adjustMsg.value = `✅ Deducted UGX ${adjustAmount.value.toLocaleString()} from site balance`
  }
  adjustAmount.value = 0
  adjustNote.value = ''
  setTimeout(() => { adjustMsg.value = '' }, 3000)
}
</script>

<style scoped>
.wallet-page { display: flex; flex-direction: column; gap: 24px; }
.balance-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.balance-card { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; padding: 20px; display: flex; align-items: flex-start; gap: 14px; }
.balance-card.primary { border-color: rgba(124,58,237,0.4); }
.balance-card.users { border-color: rgba(59,130,246,0.4); }
.balance-card.pending { border-color: rgba(245,166,35,0.4); }
.balance-card.net { border-color: rgba(34,197,94,0.3); }
.balance-card.net2 { border-color: rgba(20,184,166,0.3); }
.bc-icon { font-size: 24px; flex-shrink: 0; }
.bc-label { font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.bc-val { font-size: 20px; font-weight: 900; color: #fff; margin-top: 6px; }
.bc-val.red { color: #ef4444; }
.bc-sub { font-size: 11px; color: #555; margin-top: 4px; }
.breakdown-panel { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; overflow: hidden; }
.bp-head { padding: 16px 24px; border-bottom: 1px solid #1e2240; font-size: 14px; font-weight: 700; color: #e2e8f0; }
.bp-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.bp-row { display: flex; align-items: center; gap: 16px; }
.bp-label { width: 220px; font-size: 13px; color: #aaa; flex-shrink: 0; }
.bp-bar-wrap { flex: 1; background: #1e2240; border-radius: 4px; height: 10px; overflow: hidden; }
.bp-bar { height: 100%; border-radius: 4px; transition: width 0.3s; }
.bp-val { width: 180px; font-size: 13px; font-weight: 700; color: #e2e8f0; text-align: right; flex-shrink: 0; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; overflow: hidden; }
.panel-head { padding: 14px 20px; border-bottom: 1px solid #1e2240; font-size: 14px; font-weight: 700; color: #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.total-badge { font-size: 13px; color: #22c55e; font-weight: 700; }
.total-badge.yellow { color: #f5a623; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 16px; text-align: left; color: #666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; }
.data-table td { padding: 12px 16px; color: #ccc; border-bottom: 1px solid #1a1e35; }
.data-table tr:last-child td { border-bottom: none; }
.clickable { cursor: pointer; }
.clickable:hover td { background: rgba(124,58,237,0.05); }
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 30px; height: 30px; background: linear-gradient(135deg, #7c3aed, #5c35c9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
.bold { color: #fff; font-weight: 700; }
.muted { color: #666 !important; font-size: 12px !important; }
.red { color: #ef4444 !important; }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 12px !important; }
.user-link { color: #a78bfa !important; cursor: pointer; font-weight: 600; }
.user-link:hover { text-decoration: underline; }
.status-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; }
.status-pill.active { background: rgba(34,197,94,0.15); color: #22c55e; }
.status-pill.suspended { background: rgba(245,166,35,0.15); color: #f5a623; }
.status-pill.banned { background: rgba(239,68,68,0.15); color: #ef4444; }
.empty { text-align: center; color: #555; padding: 32px !important; }
.adjust-row { padding: 20px 24px; display: flex; align-items: center; gap: 32px; }
.adjust-form { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.adj-input { background: #0d0f1e; border: 1px solid #252840; border-radius: 8px; color: #fff; padding: 10px 14px; font-size: 14px; outline: none; }
.adj-input:focus { border-color: #7c3aed; }
.adj-btn { padding: 10px 20px; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
.adj-btn.green { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.adj-btn.red { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
.adj-msg { font-size: 13px; color: #22c55e; font-weight: 600; }
.adj-current { text-align: right; }
.adj-cur-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
.adj-cur-val { font-size: 24px; font-weight: 900; color: #fff; margin-top: 4px; }
</style>
