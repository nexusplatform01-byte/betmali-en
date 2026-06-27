<template>
  <div class="user-detail" v-if="user">
    <!-- Back + header -->
    <div class="detail-header">
      <button class="back-btn" @click="$router.push('/admin/users')">← Back to Users</button>
      <div class="user-header-info">
        <div class="big-avatar">{{ user.name.charAt(0) }}</div>
        <div>
          <div class="user-full-name">{{ user.name }}</div>
          <div class="user-meta">{{ user.phone }} · {{ user.email }}</div>
          <div class="user-meta">Joined {{ formatDate(user.createdAt) }} · Last seen {{ formatDate(user.lastVisit) }}</div>
        </div>
        <div class="header-actions">
          <span :class="['status-pill big', user.status]">{{ user.status }}</span>
          <select v-model="user.status" class="status-select">
            <option value="active">Set Active</option>
            <option value="suspended">Suspend</option>
            <option value="banned">Ban</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab" :class="['tab', { active: activeTab === tab }]" @click="activeTab = tab">{{ tab }}</button>
    </div>

    <!-- OVERVIEW -->
    <div v-if="activeTab === 'Overview'" class="tab-content">
      <div class="stats-row">
        <div class="mini-stat">
          <div class="mini-val">UGX {{ user.walletBalance.toLocaleString() }}</div>
          <div class="mini-label">Wallet Balance</div>
        </div>
        <div class="mini-stat">
          <div class="mini-val">{{ userBets.length }}</div>
          <div class="mini-label">Total Bets</div>
        </div>
        <div class="mini-stat green">
          <div class="mini-val">{{ userBets.filter(b=>b.status==='won').length }}</div>
          <div class="mini-label">Bets Won</div>
        </div>
        <div class="mini-stat yellow">
          <div class="mini-val">{{ userBets.filter(b=>b.status==='pending').length }}</div>
          <div class="mini-label">Pending Bets</div>
        </div>
        <div class="mini-stat red">
          <div class="mini-val">{{ userBets.filter(b=>b.status==='lost').length }}</div>
          <div class="mini-label">Bets Lost</div>
        </div>
        <div class="mini-stat">
          <div class="mini-val">{{ userTxs.filter(t=>t.type==='deposit').length }}</div>
          <div class="mini-label">Deposits</div>
        </div>
        <div class="mini-stat">
          <div class="mini-val">UGX {{ userTxs.filter(t=>t.type==='deposit'&&t.status==='completed').reduce((s,t)=>s+t.amount,0).toLocaleString() }}</div>
          <div class="mini-label">Total Deposited</div>
        </div>
        <div class="mini-stat">
          <div class="mini-val">UGX {{ userTxs.filter(t=>t.type==='withdrawal'&&t.status==='completed').reduce((s,t)=>s+t.amount,0).toLocaleString() }}</div>
          <div class="mini-label">Total Withdrawn</div>
        </div>
      </div>
      <div class="panel mt">
        <div class="panel-head">Recent Activities</div>
        <div v-for="a in userActivities.slice(0,6)" :key="a.id" class="activity-row">
          <div class="activity-dot"></div>
          <div class="activity-info">
            <div class="act-action">{{ a.action }}</div>
            <div class="act-details">{{ a.details }}</div>
            <div class="act-meta">{{ a.page }} · {{ a.ip }} · {{ formatFullDate(a.createdAt) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- WALLET -->
    <div v-if="activeTab === 'Wallet'" class="tab-content">
      <div class="wallet-balance-card">
        <div class="wbc-label">Current Wallet Balance</div>
        <div class="wbc-val">UGX {{ user.walletBalance.toLocaleString() }}</div>
      </div>
      <div class="wallet-actions-grid">
        <!-- Add Money -->
        <div class="action-card">
          <div class="action-title green">➕ Add Money</div>
          <div class="field">
            <label>Amount (UGX)</label>
            <input v-model.number="addAmount" type="number" min="0" placeholder="Enter amount" />
          </div>
          <div class="field">
            <label>Reason</label>
            <input v-model="addNote" placeholder="e.g. Bonus, Correction..." />
          </div>
          <button class="action-btn green" @click="doAdd">Add to Wallet</button>
          <div v-if="addMsg" class="msg green">{{ addMsg }}</div>
        </div>
        <!-- Deduct Money -->
        <div class="action-card">
          <div class="action-title red">➖ Deduct Money</div>
          <div class="field">
            <label>Amount (UGX)</label>
            <input v-model.number="deductAmount" type="number" min="0" placeholder="Enter amount" />
          </div>
          <div class="field">
            <label>Reason</label>
            <input v-model="deductNote" placeholder="e.g. Penalty, Correction..." />
          </div>
          <button class="action-btn red" @click="doDeduct">Deduct from Wallet</button>
          <div v-if="deductMsg" class="msg red">{{ deductMsg }}</div>
        </div>
      </div>
      <!-- Wallet Transactions -->
      <div class="panel mt">
        <div class="panel-head">Wallet Transactions</div>
        <table class="data-table">
          <thead><tr><th>Ref</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <tr v-for="tx in userTxs" :key="tx.id">
              <td class="mono">{{ tx.reference }}</td>
              <td><span :class="['type-pill', tx.type]">{{ tx.type }}</span></td>
              <td :class="tx.type === 'deposit' ? 'green' : 'red'">{{ tx.type==='deposit'?'+':'-' }}{{ tx.amount.toLocaleString() }}</td>
              <td>{{ tx.method }}</td>
              <td><span :class="['status-pill', tx.status]">{{ tx.status }}</span></td>
              <td class="muted">{{ formatFullDate(tx.createdAt) }}</td>
            </tr>
            <tr v-if="userTxs.length === 0"><td colspan="6" class="empty">No transactions</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- BETS -->
    <div v-if="activeTab === 'Bets'" class="tab-content">
      <div class="bet-stats">
        <div class="bs-card pending">
          <div class="bs-val">{{ userBets.filter(b=>b.status==='pending').length }}</div>
          <div class="bs-label">Pending</div>
          <div class="bs-amt">UGX {{ userBets.filter(b=>b.status==='pending').reduce((s,b)=>s+b.stake,0).toLocaleString() }}</div>
        </div>
        <div class="bs-card won">
          <div class="bs-val">{{ userBets.filter(b=>b.status==='won').length }}</div>
          <div class="bs-label">Won</div>
          <div class="bs-amt">UGX {{ userBets.filter(b=>b.status==='won').reduce((s,b)=>s+b.potentialWin,0).toLocaleString() }}</div>
        </div>
        <div class="bs-card lost">
          <div class="bs-val">{{ userBets.filter(b=>b.status==='lost').length }}</div>
          <div class="bs-label">Lost</div>
          <div class="bs-amt">UGX {{ userBets.filter(b=>b.status==='lost').reduce((s,b)=>s+b.stake,0).toLocaleString() }}</div>
        </div>
      </div>
      <div class="panel mt">
        <div class="panel-head">Bet History</div>
        <table class="data-table">
          <thead><tr><th>Ticket</th><th>Match</th><th>Selection</th><th>Odds</th><th>Stake</th><th>Potential Win</th><th>Status</th><th>Placed</th><th>Manage</th></tr></thead>
          <tbody>
            <tr v-for="b in userBets" :key="b.id">
              <td class="mono">{{ b.ticketId }}</td>
              <td>{{ b.match }}</td>
              <td class="muted">{{ b.selection }}</td>
              <td>{{ b.odds }}</td>
              <td>{{ b.stake.toLocaleString() }}</td>
              <td class="green">{{ b.potentialWin.toLocaleString() }}</td>
              <td><span :class="['status-pill', b.status]">{{ b.status }}</span></td>
              <td class="muted">{{ formatDate(b.placedAt) }}</td>
              <td @click.stop>
                <select v-if="b.status === 'pending'" v-model="b.status" class="inline-select">
                  <option value="pending">Pending</option>
                  <option value="won">Mark Won</option>
                  <option value="lost">Mark Lost</option>
                </select>
                <span v-else class="settled">Settled</span>
              </td>
            </tr>
            <tr v-if="userBets.length === 0"><td colspan="9" class="empty">No bets placed</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TRANSACTIONS -->
    <div v-if="activeTab === 'Transactions'" class="tab-content">
      <div class="panel">
        <div class="panel-head">All Transactions</div>
        <table class="data-table">
          <thead><tr><th>Reference</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <tr v-for="tx in userTxs" :key="tx.id">
              <td class="mono">{{ tx.reference }}</td>
              <td><span :class="['type-pill', tx.type]">{{ tx.type }}</span></td>
              <td :class="tx.type === 'deposit' ? 'green' : 'red'">UGX {{ tx.amount.toLocaleString() }}</td>
              <td>{{ tx.method }}</td>
              <td><span :class="['status-pill', tx.status]">{{ tx.status }}</span></td>
              <td class="muted">{{ formatFullDate(tx.createdAt) }}</td>
            </tr>
            <tr v-if="userTxs.length === 0"><td colspan="6" class="empty">No transactions</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ACTIVITIES -->
    <div v-if="activeTab === 'Activities'" class="tab-content">
      <div class="panel">
        <div class="panel-head">User Activity Log ({{ userActivities.length }} events)</div>
        <div v-for="a in userActivities" :key="a.id" class="activity-row">
          <div class="activity-dot"></div>
          <div class="activity-info">
            <div class="act-action">{{ a.action }}</div>
            <div class="act-details">{{ a.details }}</div>
            <div class="act-meta">Page: {{ a.page }} · IP: {{ a.ip }} · {{ formatFullDate(a.createdAt) }}</div>
          </div>
        </div>
        <div v-if="userActivities.length === 0" class="empty p40">No activities recorded</div>
      </div>
    </div>

    <!-- SETTINGS -->
    <div v-if="activeTab === 'Settings'" class="tab-content">
      <div class="settings-grid">
        <div class="settings-card">
          <div class="settings-title">Account Information</div>
          <div class="field"><label>Full Name</label><input v-model="user.name" /></div>
          <div class="field"><label>Phone Number</label><input v-model="user.phone" /></div>
          <div class="field"><label>Email Address</label><input v-model="user.email" /></div>
          <div class="field"><label>Country</label><input v-model="user.country" /></div>
          <button class="save-btn" @click="savedMsg = 'Account info saved!'">Save Changes</button>
          <div v-if="savedMsg" class="msg green">{{ savedMsg }}</div>
        </div>
        <div class="settings-card">
          <div class="settings-title">Account Status</div>
          <div class="field">
            <label>Status</label>
            <select v-model="user.status">
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div class="field">
            <label>Currency</label>
            <input v-model="user.currency" />
          </div>
          <div class="divider"></div>
          <div class="danger-zone">
            <div class="settings-title red">Danger Zone</div>
            <button class="danger-btn" @click="user.status = 'suspended'">Suspend Account</button>
            <button class="danger-btn darker" @click="user.status = 'banned'">Ban Account</button>
            <button class="danger-btn reset" @click="user.walletBalance = 0">Reset Wallet to Zero</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">User not found. <router-link to="/admin/users">Go back</router-link></div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { users, getUserBets, getUserTransactions, getUserActivities, adjustWallet, formatDate, formatFullDate } from '../../stores/adminData'

const route = useRoute()
const user = computed(() => users.find(u => u.id === route.params.id))
const userBets = computed(() => user.value ? getUserBets(user.value.id) : [])
const userTxs = computed(() => user.value ? getUserTransactions(user.value.id) : [])
const userActivities = computed(() => user.value ? getUserActivities(user.value.id) : [])

const tabs = ['Overview', 'Wallet', 'Bets', 'Transactions', 'Activities', 'Settings']
const activeTab = ref('Overview')

const addAmount = ref(0)
const addNote = ref('')
const addMsg = ref('')
const deductAmount = ref(0)
const deductNote = ref('')
const deductMsg = ref('')
const savedMsg = ref('')

function doAdd() {
  if (!user.value || addAmount.value <= 0) return
  adjustWallet(user.value.id, addAmount.value, 'add', addNote.value || 'Admin Credit')
  addMsg.value = `✅ Added UGX ${addAmount.value.toLocaleString()} successfully`
  addAmount.value = 0; addNote.value = ''
  setTimeout(() => { addMsg.value = '' }, 3000)
}

function doDeduct() {
  if (!user.value || deductAmount.value <= 0) return
  adjustWallet(user.value.id, deductAmount.value, 'deduct', deductNote.value || 'Admin Deduction')
  deductMsg.value = `✅ Deducted UGX ${deductAmount.value.toLocaleString()} successfully`
  deductAmount.value = 0; deductNote.value = ''
  setTimeout(() => { deductMsg.value = '' }, 3000)
}
</script>

<style scoped>
.user-detail { display: flex; flex-direction: column; gap: 20px; }
.back-btn { background: #1e2240; border: none; color: #a78bfa; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 4px; }
.back-btn:hover { background: #252a4a; }
.detail-header { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; padding: 24px; }
.user-header-info { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 12px; }
.big-avatar { width: 64px; height: 64px; background: linear-gradient(135deg, #7c3aed, #5c35c9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 900; color: #fff; flex-shrink: 0; }
.user-full-name { font-size: 22px; font-weight: 800; color: #fff; }
.user-meta { font-size: 13px; color: #666; margin-top: 3px; }
.header-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.status-pill { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; }
.status-pill.big { font-size: 12px; padding: 6px 16px; }
.status-pill.active { background: rgba(34,197,94,0.15); color: #22c55e; }
.status-pill.suspended { background: rgba(245,166,35,0.15); color: #f5a623; }
.status-pill.banned { background: rgba(239,68,68,0.15); color: #ef4444; }
.status-pill.completed, .status-pill.won { background: rgba(34,197,94,0.15); color: #22c55e; }
.status-pill.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.status-pill.failed, .status-pill.lost { background: rgba(239,68,68,0.15); color: #ef4444; }
.status-select { background: #1e2240; border: 1px solid #252840; color: #e2e8f0; padding: 8px 12px; border-radius: 8px; font-size: 13px; cursor: pointer; outline: none; }
.tabs { display: flex; gap: 4px; background: #13172b; border: 1px solid #1e2240; border-radius: 10px; padding: 6px; }
.tab { background: transparent; border: none; color: #888; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.tab.active { background: rgba(124,58,237,0.2); color: #a78bfa; }
.tab:hover:not(.active) { color: #ccc; }
.tab-content { display: flex; flex-direction: column; gap: 16px; }
.stats-row { display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px; }
.mini-stat { background: #13172b; border: 1px solid #1e2240; border-radius: 10px; padding: 16px; text-align: center; }
.mini-stat.green .mini-val { color: #22c55e; }
.mini-stat.yellow .mini-val { color: #f5a623; }
.mini-stat.red .mini-val { color: #ef4444; }
.mini-val { font-size: 18px; font-weight: 800; color: #fff; }
.mini-label { font-size: 11px; color: #666; margin-top: 4px; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; overflow: hidden; }
.panel.mt { margin-top: 0; }
.panel-head { padding: 14px 20px; border-bottom: 1px solid #1e2240; font-size: 14px; font-weight: 700; color: #e2e8f0; }
.activity-row { display: flex; gap: 14px; padding: 14px 20px; border-bottom: 1px solid #0d0f1e; }
.activity-row:last-child { border-bottom: none; }
.activity-dot { width: 8px; height: 8px; background: #7c3aed; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.activity-info { flex: 1; }
.act-action { font-size: 13px; font-weight: 700; color: #e2e8f0; }
.act-details { font-size: 13px; color: #aaa; margin-top: 2px; }
.act-meta { font-size: 11px; color: #555; margin-top: 4px; }
.wallet-balance-card { background: linear-gradient(135deg, #7c3aed 0%, #5c35c9 100%); border-radius: 12px; padding: 32px; text-align: center; }
.wbc-label { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.wbc-val { font-size: 36px; font-weight: 900; color: #fff; margin-top: 8px; }
.wallet-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.action-card { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.action-title { font-size: 15px; font-weight: 700; }
.action-title.green { color: #22c55e; }
.action-title.red { color: #ef4444; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 11px; color: #888; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.field input, .field select { background: #0d0f1e; border: 1px solid #252840; border-radius: 8px; color: #fff; padding: 10px 12px; font-size: 14px; outline: none; }
.field input:focus { border-color: #7c3aed; }
.action-btn { padding: 12px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }
.action-btn.green { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.action-btn.green:hover { background: rgba(34,197,94,0.25); }
.action-btn.red { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
.action-btn.red:hover { background: rgba(239,68,68,0.25); }
.msg { font-size: 13px; font-weight: 600; }
.msg.green { color: #22c55e; }
.msg.red { color: #ef4444; }
.bet-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.bs-card { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; padding: 20px; text-align: center; }
.bs-card.pending { border-color: rgba(245,166,35,0.3); }
.bs-card.won { border-color: rgba(34,197,94,0.3); }
.bs-card.lost { border-color: rgba(239,68,68,0.3); }
.bs-val { font-size: 36px; font-weight: 900; color: #fff; }
.bs-card.pending .bs-val { color: #f5a623; }
.bs-card.won .bs-val { color: #22c55e; }
.bs-card.lost .bs-val { color: #ef4444; }
.bs-label { font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
.bs-amt { font-size: 13px; color: #aaa; margin-top: 6px; font-weight: 600; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 16px; text-align: left; color: #666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; }
.data-table td { padding: 12px 16px; color: #ccc; border-bottom: 1px solid #1a1e35; }
.data-table tr:last-child td { border-bottom: none; }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 12px !important; }
.muted { color: #666 !important; font-size: 12px !important; }
.green { color: #22c55e !important; }
.red { color: #ef4444 !important; }
.type-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; }
.type-pill.deposit { background: rgba(34,197,94,0.15); color: #22c55e; }
.type-pill.withdrawal { background: rgba(239,68,68,0.15); color: #ef4444; }
.inline-select { background: #1e2240; border: 1px solid #252840; color: #e2e8f0; padding: 4px 8px; border-radius: 6px; font-size: 12px; cursor: pointer; outline: none; }
.settled { font-size: 11px; color: #555; }
.empty { text-align: center; color: #555; padding: 32px !important; }
.p40 { padding: 40px !important; }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.settings-card { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.settings-title { font-size: 14px; font-weight: 700; color: #e2e8f0; }
.settings-title.red { color: #ef4444; }
.save-btn { background: linear-gradient(135deg, #7c3aed, #5c35c9); color: #fff; border: none; border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 700; cursor: pointer; }
.save-btn:hover { opacity: 0.9; }
.divider { height: 1px; background: #1e2240; }
.danger-zone { display: flex; flex-direction: column; gap: 10px; }
.danger-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #ef4444; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.danger-btn:hover { background: rgba(239,68,68,0.2); }
.danger-btn.darker { background: rgba(239,68,68,0.2); }
.danger-btn.reset { border-color: rgba(245,166,35,0.3); color: #f5a623; background: rgba(245,166,35,0.1); }
.not-found { text-align: center; color: #888; padding: 80px; }
.not-found a { color: #a78bfa; }
</style>
