<template>
  <div class="user-detail" v-if="user">
    <!-- Header -->
    <div class="detail-hdr">
      <button class="back-btn" @click="$router.push('/admin/users')">← Users</button>
      <div class="uhdr-info">
        <div class="uhdr-av">{{ user.name.charAt(0) }}</div>
        <div>
          <div class="uhdr-name">{{ user.name }}</div>
          <div class="uhdr-meta">{{ user.phone }} · {{ user.email }}</div>
          <div class="uhdr-meta">Joined {{ formatDate(user.createdAt) }} · Last seen {{ formatDate(user.lastVisit) }}</div>
        </div>
        <div class="uhdr-right">
          <span :class="['sp', user.status]">{{ user.status }}</span>
          <select v-model="user.status" class="ss">
            <option value="active">Set Active</option>
            <option value="suspended">Suspend</option>
            <option value="banned">Ban</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-bar">
      <button v-for="tab in tabs" :key="tab" :class="['tb', { active: activeTab === tab }]" @click="activeTab = tab">{{ tab }}</button>
    </div>

    <!-- OVERVIEW -->
    <div v-if="activeTab==='Overview'" class="tc">
      <div class="stats-row">
        <div class="ms"><div class="msv">UGX {{ user.walletBalance.toLocaleString() }}</div><div class="msl">Balance</div></div>
        <div class="ms"><div class="msv">{{ userBets.length }}</div><div class="msl">Total Bets</div></div>
        <div class="ms g"><div class="msv">{{ userBets.filter(b=>b.status==='won').length }}</div><div class="msl">Won</div></div>
        <div class="ms y"><div class="msv">{{ userBets.filter(b=>b.status==='pending').length }}</div><div class="msl">Pending</div></div>
        <div class="ms r"><div class="msv">{{ userBets.filter(b=>b.status==='lost').length }}</div><div class="msl">Lost</div></div>
        <div class="ms"><div class="msv">{{ userTxs.filter(t=>t.type==='deposit').length }}</div><div class="msl">Deposits</div></div>
        <div class="ms"><div class="msv">{{ userTxs.filter(t=>t.type==='deposit'&&t.status==='completed').reduce((s,t)=>s+t.amount,0).toLocaleString() }}</div><div class="msl">Total Deposited</div></div>
        <div class="ms"><div class="msv">{{ userTxs.filter(t=>t.type==='withdrawal'&&t.status==='completed').reduce((s,t)=>s+t.amount,0).toLocaleString() }}</div><div class="msl">Total Withdrawn</div></div>
      </div>
      <div class="panel">
        <div class="ph">Recent Activities</div>
        <div v-for="a in userActivities.slice(0,6)" :key="a.id" class="arow">
          <div class="adot"></div>
          <div class="ainfo"><div class="aact">{{ a.action }}</div><div class="adet">{{ a.details }}</div><div class="amet">{{ a.page }} · {{ a.ip }} · {{ formatFullDate(a.createdAt) }}</div></div>
        </div>
        <div v-if="!userActivities.length" class="empty">No activities</div>
      </div>
    </div>

    <!-- WALLET -->
    <div v-if="activeTab==='Wallet'" class="tc">
      <div class="wbal-card">
        <div class="wbl">Current Balance</div>
        <div class="wbv">UGX {{ user.walletBalance.toLocaleString() }}</div>
      </div>
      <div class="two-col">
        <div class="panel">
          <div class="ph g">➕ Add Money</div>
          <div class="padded">
            <div class="field"><label>Amount (UGX)</label><input v-model.number="addAmount" type="number" min="0" placeholder="Enter amount" /></div>
            <div class="field"><label>Reason</label><input v-model="addNote" placeholder="e.g. Bonus, Correction..." /></div>
            <button class="abtn g" @click="doAdd">Add to Wallet</button>
            <div v-if="addMsg" class="msg g">{{ addMsg }}</div>
          </div>
        </div>
        <div class="panel">
          <div class="ph r">➖ Deduct Money</div>
          <div class="padded">
            <div class="field"><label>Amount (UGX)</label><input v-model.number="deductAmount" type="number" min="0" placeholder="Enter amount" /></div>
            <div class="field"><label>Reason</label><input v-model="deductNote" placeholder="e.g. Penalty, Correction..." /></div>
            <button class="abtn r" @click="doDeduct">Deduct from Wallet</button>
            <div v-if="deductMsg" class="msg r">{{ deductMsg }}</div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="ph">Transaction History</div>
        <table class="dt">
          <thead><tr><th>Ref</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <tr v-for="tx in userTxs" :key="tx.id">
              <td class="mono">{{ tx.reference }}</td>
              <td><span :class="['tp', tx.type]">{{ tx.type }}</span></td>
              <td :class="tx.type==='deposit'?'green':'red'">{{ tx.type==='deposit'?'+':'-' }}UGX {{ tx.amount.toLocaleString() }}</td>
              <td class="muted">{{ tx.method }}</td>
              <td><span :class="['sp', tx.status]">{{ tx.status }}</span></td>
              <td class="muted">{{ formatFullDate(tx.createdAt) }}</td>
            </tr>
            <tr v-if="!userTxs.length"><td colspan="6" class="empty">No transactions</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- BETS -->
    <div v-if="activeTab==='Bets'" class="tc">
      <div class="bs-grid">
        <div class="bsc y"><div class="bsv">{{ userBets.filter(b=>b.status==='pending').length }}</div><div class="bsl">Pending</div><div class="bsa">UGX {{ userBets.filter(b=>b.status==='pending').reduce((s,b)=>s+b.stake,0).toLocaleString() }}</div></div>
        <div class="bsc g"><div class="bsv">{{ userBets.filter(b=>b.status==='won').length }}</div><div class="bsl">Won</div><div class="bsa">UGX {{ userBets.filter(b=>b.status==='won').reduce((s,b)=>s+b.potentialWin,0).toLocaleString() }}</div></div>
        <div class="bsc r"><div class="bsv">{{ userBets.filter(b=>b.status==='lost').length }}</div><div class="bsl">Lost</div><div class="bsa">UGX {{ userBets.filter(b=>b.status==='lost').reduce((s,b)=>s+b.stake,0).toLocaleString() }}</div></div>
      </div>
      <div class="panel">
        <div class="ph">Bet History</div>
        <div class="bets-list">
          <div v-for="b in userBets" :key="b.id" class="tkt-card">
            <div class="tkt-left">
              <div class="tkt-top"><span class="tkt-id">{{ b.ticketId }}</span><span class="tkt-type">{{ b.sport }} · 1 match</span></div>
              <div class="tkt-match">{{ b.match }}</div>
              <div class="tkt-sel">{{ b.selection }} · <span class="odds-v">{{ b.odds }}x</span></div>
            </div>
            <div class="tkt-right">
              <span :class="['sp', b.status]">{{ b.status }}</span>
              <div class="tkt-stake">UGX {{ b.stake.toLocaleString() }}</div>
              <div class="tkt-win">→ UGX {{ b.potentialWin.toLocaleString() }}</div>
              <select v-if="b.status==='pending'" v-model="b.status" class="is">
                <option value="pending">Pending</option>
                <option value="won">Mark Won</option>
                <option value="lost">Mark Lost</option>
              </select>
              <span v-else class="settled">Settled</span>
            </div>
          </div>
          <div v-if="!userBets.length" class="empty">No bets placed</div>
        </div>
      </div>
    </div>

    <!-- TRANSACTIONS -->
    <div v-if="activeTab==='Transactions'" class="tc">
      <div class="panel">
        <div class="ph">All Transactions</div>
        <table class="dt">
          <thead><tr><th>Reference</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <tr v-for="tx in userTxs" :key="tx.id">
              <td class="mono">{{ tx.reference }}</td>
              <td><span :class="['tp', tx.type]">{{ tx.type }}</span></td>
              <td :class="tx.type==='deposit'?'green':'red'">UGX {{ tx.amount.toLocaleString() }}</td>
              <td class="muted">{{ tx.method }}</td>
              <td><span :class="['sp', tx.status]">{{ tx.status }}</span></td>
              <td class="muted">{{ formatFullDate(tx.createdAt) }}</td>
            </tr>
            <tr v-if="!userTxs.length"><td colspan="6" class="empty">No transactions</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ACTIVITIES -->
    <div v-if="activeTab==='Activities'" class="tc">
      <div class="panel">
        <div class="ph">Activity Log ({{ userActivities.length }} events)</div>
        <div v-for="a in userActivities" :key="a.id" class="arow">
          <div class="adot"></div>
          <div class="ainfo"><div class="aact">{{ a.action }}</div><div class="adet">{{ a.details }}</div><div class="amet">{{ a.page }} · {{ a.ip }} · {{ formatFullDate(a.createdAt) }}</div></div>
        </div>
        <div v-if="!userActivities.length" class="empty">No activities recorded</div>
      </div>
    </div>

    <!-- SETTINGS -->
    <div v-if="activeTab==='Settings'" class="tc">
      <div class="two-col">
        <div class="panel">
          <div class="ph">Account Information</div>
          <div class="padded">
            <div class="field"><label>Full Name</label><input v-model="user.name" /></div>
            <div class="field"><label>Phone Number</label><input v-model="user.phone" /></div>
            <div class="field"><label>Email Address</label><input v-model="user.email" /></div>
            <div class="field"><label>Country</label><input v-model="user.country" /></div>
            <button class="abtn p" @click="savedMsg='Saved!'">Save Changes</button>
            <div v-if="savedMsg" class="msg g">{{ savedMsg }}</div>
          </div>
        </div>
        <div class="panel">
          <div class="ph">Account Status & Danger Zone</div>
          <div class="padded">
            <div class="field"><label>Status</label>
              <select v-model="user.status">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            <div class="field"><label>Currency</label><input v-model="user.currency" /></div>
            <div class="divider"></div>
            <div class="dzone-label r">⚠️ Danger Zone</div>
            <div class="danger-btns">
              <button class="dbtn y" @click="user.status='suspended'">Suspend Account</button>
              <button class="dbtn r" @click="user.status='banned'">Ban Account</button>
              <button class="dbtn o" @click="user.walletBalance=0">Reset Wallet to Zero</button>
            </div>
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
const addAmount = ref(0); const addNote = ref(''); const addMsg = ref('')
const deductAmount = ref(0); const deductNote = ref(''); const deductMsg = ref('')
const savedMsg = ref('')

function doAdd() {
  if (!user.value || addAmount.value <= 0) return
  adjustWallet(user.value.id, addAmount.value, 'add', addNote.value || 'Admin Credit')
  addMsg.value = `✅ Added UGX ${addAmount.value.toLocaleString()}`
  addAmount.value = 0; addNote.value = ''
  setTimeout(() => { addMsg.value = '' }, 3000)
}
function doDeduct() {
  if (!user.value || deductAmount.value <= 0) return
  adjustWallet(user.value.id, deductAmount.value, 'deduct', deductNote.value || 'Admin Deduction')
  deductMsg.value = `✅ Deducted UGX ${deductAmount.value.toLocaleString()}`
  deductAmount.value = 0; deductNote.value = ''
  setTimeout(() => { deductMsg.value = '' }, 3000)
}
</script>

<style scoped>
* { box-sizing: border-box; }
.user-detail { display: flex; flex-direction: column; gap: 10px; height: 100%; overflow-y: auto; }
.back-btn { background: #1e2240; border: none; color: #a78bfa; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; margin-bottom: 4px; }
.detail-hdr { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 12px 14px; }
.uhdr-info { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
.uhdr-av { width: 44px; height: 44px; background: linear-gradient(135deg,#7c3aed,#5c35c9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: #fff; flex-shrink: 0; }
.uhdr-name { font-size: 15px; font-weight: 800; color: #fff; }
.uhdr-meta { font-size: 10px; color: #666; margin-top: 2px; }
.uhdr-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.sp { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 8px; text-transform: uppercase; }
.sp.active { background: rgba(34,197,94,0.15); color: #22c55e; }
.sp.suspended { background: rgba(245,166,35,0.15); color: #f5a623; }
.sp.banned { background: rgba(239,68,68,0.15); color: #ef4444; }
.sp.completed,.sp.won { background: rgba(34,197,94,0.15); color: #22c55e; }
.sp.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.sp.failed,.sp.lost { background: rgba(239,68,68,0.15); color: #ef4444; }
.ss { background: #1e2240; border: 1px solid #252840; color: #e2e8f0; padding: 5px 8px; border-radius: 6px; font-size: 11px; cursor: pointer; outline: none; }
.tabs-bar { display: flex; gap: 2px; background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 4px; }
.tb { background: transparent; border: none; color: #888; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; }
.tb.active { background: rgba(124,58,237,0.2); color: #a78bfa; }
.tb:hover:not(.active) { color: #ccc; }
.tc { display: flex; flex-direction: column; gap: 10px; }
.stats-row { display: grid; grid-template-columns: repeat(8,1fr); gap: 8px; }
.ms { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 10px 8px; text-align: center; }
.msv { font-size: 14px; font-weight: 800; color: #fff; }
.msl { font-size: 9px; color: #666; margin-top: 2px; }
.ms.g .msv { color: #22c55e; } .ms.y .msv { color: #f5a623; } .ms.r .msv { color: #ef4444; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; overflow: hidden; }
.ph { padding: 8px 12px; border-bottom: 1px solid #1e2240; font-size: 12px; font-weight: 700; color: #e2e8f0; }
.ph.g { color: #22c55e; } .ph.r { color: #ef4444; }
.padded { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.arow { display: flex; gap: 10px; padding: 8px 12px; border-bottom: 1px solid #0d0f1e; }
.arow:last-child { border-bottom: none; }
.adot { width: 7px; height: 7px; background: #7c3aed; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.aact { font-size: 12px; font-weight: 700; color: #e2e8f0; }
.adet { font-size: 11px; color: #aaa; margin-top: 1px; }
.amet { font-size: 10px; color: #555; margin-top: 2px; }
.wbal-card { background: linear-gradient(135deg,#7c3aed,#5c35c9); border-radius: 8px; padding: 20px; text-align: center; }
.wbl { font-size: 11px; color: rgba(255,255,255,0.7); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.wbv { font-size: 26px; font-weight: 900; color: #fff; margin-top: 6px; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field { display: flex; flex-direction: column; gap: 3px; }
.field label { font-size: 10px; color: #888; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.field input, .field select { background: #0d0f1e; border: 1px solid #252840; border-radius: 6px; color: #fff; padding: 7px 10px; font-size: 12px; outline: none; }
.field input:focus { border-color: #7c3aed; }
.abtn { padding: 8px 12px; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; }
.abtn.g { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.abtn.r { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
.abtn.p { background: linear-gradient(135deg,#7c3aed,#5c35c9); color: #fff; }
.msg { font-size: 11px; font-weight: 600; }
.msg.g { color: #22c55e; } .msg.r { color: #ef4444; }
.bs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.bsc { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 14px; text-align: center; }
.bsc.y { border-color: rgba(245,166,35,0.3); } .bsc.g { border-color: rgba(34,197,94,0.3); } .bsc.r { border-color: rgba(239,68,68,0.3); }
.bsv { font-size: 28px; font-weight: 900; color: #fff; }
.bsc.y .bsv { color: #f5a623; } .bsc.g .bsv { color: #22c55e; } .bsc.r .bsv { color: #ef4444; }
.bsl { font-size: 10px; color: #888; font-weight: 600; text-transform: uppercase; margin-top: 2px; }
.bsa { font-size: 10px; color: #aaa; margin-top: 4px; }
.bets-list { display: flex; flex-direction: column; }
.tkt-card { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-bottom: 1px solid #1a1e35; }
.tkt-card:last-child { border-bottom: none; }
.tkt-left { flex: 1; min-width: 0; }
.tkt-top { display: flex; align-items: center; gap: 10px; margin-bottom: 3px; }
.tkt-id { font-family: monospace; font-size: 10px; color: #a78bfa; font-weight: 700; }
.tkt-type { font-size: 10px; color: #666; }
.tkt-match { font-size: 12px; color: #e2e8f0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tkt-sel { font-size: 11px; color: #888; margin-top: 1px; }
.odds-v { color: #f5a623; font-weight: 700; }
.tkt-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.tkt-stake { font-size: 11px; font-weight: 700; color: #fff; }
.tkt-win { font-size: 10px; color: #22c55e; }
.is { background: #1e2240; border: 1px solid #252840; color: #e2e8f0; padding: 3px 6px; border-radius: 5px; font-size: 10px; cursor: pointer; outline: none; }
.settled { font-size: 10px; color: #555; }
.dt { width: 100%; border-collapse: collapse; font-size: 11px; }
.dt th { padding: 6px 10px; text-align: left; color: #555; font-size: 10px; font-weight: 600; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; }
.dt td { padding: 7px 10px; color: #bbb; border-bottom: 1px solid #1a1e35; white-space: nowrap; }
.dt tr:last-child td { border-bottom: none; }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 10px !important; }
.muted { color: #555 !important; font-size: 10px !important; }
.green { color: #22c55e !important; } .red { color: #ef4444 !important; }
.tp { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 8px; text-transform: uppercase; }
.tp.deposit { background: rgba(34,197,94,0.15); color: #22c55e; }
.tp.withdrawal { background: rgba(239,68,68,0.15); color: #ef4444; }
.divider { height: 1px; background: #1e2240; margin: 4px 0; }
.dzone-label { font-size: 11px; font-weight: 700; }
.dzone-label.r { color: #ef4444; }
.danger-btns { display: flex; flex-direction: column; gap: 6px; }
.dbtn { padding: 7px 10px; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; }
.dbtn.y { background: rgba(245,166,35,0.1); color: #f5a623; border: 1px solid rgba(245,166,35,0.25); }
.dbtn.r { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
.dbtn.o { background: rgba(245,166,35,0.1); color: #f5a623; border: 1px solid rgba(245,166,35,0.25); }
.empty { text-align: center; color: #555; padding: 20px; font-size: 11px; }
.not-found { text-align: center; color: #888; padding: 80px; }
.not-found a { color: #a78bfa; }
</style>
