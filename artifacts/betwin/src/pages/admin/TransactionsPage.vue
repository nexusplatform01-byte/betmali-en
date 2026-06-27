<template>
  <div class="tx-page">
    <div class="summary-grid">
      <div class="sc dep"><div class="si">↓</div><div><div class="sv">UGX {{ totalDeposits.toLocaleString() }}</div><div class="sl">Total Deposits</div><div class="ss">{{ transactions.filter(t=>t.type==='deposit').length }} txns</div></div></div>
      <div class="sc wit"><div class="si">↑</div><div><div class="sv">UGX {{ totalWithdrawals.toLocaleString() }}</div><div class="sl">Total Withdrawals</div><div class="ss">{{ transactions.filter(t=>t.type==='withdrawal').length }} txns</div></div></div>
      <div class="sc pend"><div class="si">⏳</div><div><div class="sv">{{ transactions.filter(t=>t.status==='pending').length }}</div><div class="sl">Pending</div><div class="ss">UGX {{ transactions.filter(t=>t.status==='pending').reduce((s,t)=>s+t.amount,0).toLocaleString() }}</div></div></div>
      <div class="sc fail"><div class="si">✗</div><div><div class="sv">{{ transactions.filter(t=>t.status==='failed').length }}</div><div class="sl">Failed</div><div class="ss">UGX {{ transactions.filter(t=>t.status==='failed').reduce((s,t)=>s+t.amount,0).toLocaleString() }}</div></div></div>
    </div>

    <div class="filters-row">
      <div class="search-bar"><span>🔍</span><input v-model="search" placeholder="Search ref, user, method..." /></div>
      <div class="dftabs">
        <button v-for="df in dateFilters" :key="df.key" :class="['dft', {active: adf===df.key}]" @click="setDF(df.key)">{{ df.label }}</button>
      </div>
      <div class="cal">
        <input type="date" v-model="dateFrom" class="di" />
        <span class="ds">→</span>
        <input type="date" v-model="dateTo" class="di" />
        <button class="clr" @click="clearDates">✕</button>
      </div>
      <select v-model="typeF"><option value="">All Types</option><option value="deposit">Deposits</option><option value="withdrawal">Withdrawals</option></select>
      <select v-model="statusF"><option value="">All Status</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option></select>
    </div>

    <div class="panel">
      <div class="ph">
        <span>{{ filtered.length }} transactions</span>
        <span>In: <span class="green">+UGX {{ filteredDep.toLocaleString() }}</span> · Out: <span class="red">-UGX {{ filteredWit.toLocaleString() }}</span></span>
      </div>
      <table class="dt">
        <thead><tr><th>Reference</th><th>User</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>
          <tr v-for="tx in filtered" :key="tx.id">
            <td class="mono">{{ tx.reference }}</td>
            <td class="ulink" @click="$router.push('/admin/users/'+tx.userId)">{{ getUserName(tx.userId) }}</td>
            <td><span :class="['tp', tx.type]">{{ tx.type }}</span></td>
            <td :class="tx.type==='deposit'?'green bold':'red bold'">{{ tx.type==='deposit'?'+':'-' }}UGX {{ tx.amount.toLocaleString() }}</td>
            <td class="muted">{{ tx.method }}</td>
            <td><span :class="['sp', tx.status]">{{ tx.status }}</span></td>
            <td class="muted">{{ formatFullDate(tx.createdAt) }}</td>
            <td>
              <select v-if="tx.status==='pending'" v-model="tx.status" class="is"><option value="pending">Pending</option><option value="completed">Approve</option><option value="failed">Reject</option></select>
              <span v-else class="dash">—</span>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="8" class="empty">No transactions found</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { transactions, users, formatFullDate } from '../../stores/adminData'

const search = ref(''); const typeF = ref(''); const statusF = ref('')
const adf = ref('all'); const dateFrom = ref(''); const dateTo = ref('')

const dateFilters = [
  { key: 'all', label: 'All' }, { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' }, { key: 'week', label: 'This Week' }, { key: 'month', label: 'This Month' },
]

function setDF(key: string) {
  adf.value = key; dateFrom.value = ''; dateTo.value = ''
  const now = new Date()
  if (key==='today') { const d=now.toISOString().slice(0,10); dateFrom.value=d; dateTo.value=d }
  else if (key==='yesterday') { const y=new Date(now); y.setDate(y.getDate()-1); const d=y.toISOString().slice(0,10); dateFrom.value=d; dateTo.value=d }
  else if (key==='week') { const s=new Date(now); s.setDate(s.getDate()-s.getDay()); dateFrom.value=s.toISOString().slice(0,10); dateTo.value=now.toISOString().slice(0,10) }
  else if (key==='month') { dateFrom.value=new Date(now.getFullYear(),now.getMonth(),1).toISOString().slice(0,10); dateTo.value=now.toISOString().slice(0,10) }
}
function clearDates() { dateFrom.value=''; dateTo.value=''; adf.value='all' }

const filtered = computed(() => transactions.filter(tx => {
  const q = search.value.toLowerCase()
  const ms = !q || tx.reference.toLowerCase().includes(q) || getUserName(tx.userId).toLowerCase().includes(q) || tx.method.toLowerCase().includes(q)
  const mt = !typeF.value || tx.type===typeF.value
  const ms2 = !statusF.value || tx.status===statusF.value
  let md = true
  if (dateFrom.value||dateTo.value) {
    const d = new Date(tx.createdAt).toISOString().slice(0,10)
    if (dateFrom.value && d<dateFrom.value) md=false
    if (dateTo.value && d>dateTo.value) md=false
  }
  return ms && mt && ms2 && md
}).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()))

const totalDeposits = computed(() => transactions.filter(t=>t.type==='deposit'&&t.status==='completed').reduce((s,t)=>s+t.amount,0))
const totalWithdrawals = computed(() => transactions.filter(t=>t.type==='withdrawal'&&t.status==='completed').reduce((s,t)=>s+t.amount,0))
const filteredDep = computed(() => filtered.value.filter(t=>t.type==='deposit').reduce((s,t)=>s+t.amount,0))
const filteredWit = computed(() => filtered.value.filter(t=>t.type==='withdrawal').reduce((s,t)=>s+t.amount,0))
function getUserName(id: string) { return users.find(u=>u.id===id)?.name||id }
</script>

<style scoped>
.tx-page { display: flex; flex-direction: column; gap: 10px; height: 100%; }
.summary-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
.sc { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
.si { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; flex-shrink: 0; }
.sc.dep .si { background: rgba(34,197,94,0.15); color: #22c55e; }
.sc.wit .si { background: rgba(239,68,68,0.15); color: #ef4444; }
.sc.pend .si { background: rgba(245,166,35,0.15); color: #f5a623; }
.sc.fail .si { background: rgba(100,100,100,0.15); color: #888; }
.sv { font-size: 13px; font-weight: 800; color: #fff; }
.sl { font-size: 10px; color: #888; margin-top: 1px; }
.ss { font-size: 10px; color: #555; margin-top: 1px; }
.filters-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.search-bar { display: flex; align-items: center; gap: 8px; background: #13172b; border: 1px solid #1e2240; border-radius: 6px; padding: 6px 10px; flex: 1; min-width: 150px; }
.search-bar input { background: transparent; border: none; outline: none; color: #e2e8f0; font-size: 11px; width: 100%; }
.dftabs { display: flex; gap: 2px; background: #13172b; border: 1px solid #1e2240; border-radius: 6px; padding: 3px; }
.dft { background: transparent; border: none; color: #888; padding: 4px 9px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.dft.active { background: rgba(124,58,237,0.2); color: #a78bfa; }
.dft:hover:not(.active) { color: #ccc; }
.cal { display: flex; align-items: center; gap: 4px; }
.di { background: #13172b; border: 1px solid #1e2240; border-radius: 6px; color: #e2e8f0; padding: 5px 7px; font-size: 10px; outline: none; cursor: pointer; width: 110px; }
.ds { color: #555; font-size: 10px; }
.clr { background: #1e2240; border: none; color: #aaa; padding: 5px 8px; border-radius: 5px; font-size: 10px; cursor: pointer; }
select { background: #13172b; border: 1px solid #1e2240; border-radius: 6px; color: #e2e8f0; padding: 5px 8px; font-size: 11px; outline: none; cursor: pointer; }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; overflow: auto; flex: 1; }
.ph { padding: 8px 12px; border-bottom: 1px solid #1e2240; font-size: 11px; color: #666; display: flex; justify-content: space-between; }
.dt { width: 100%; border-collapse: collapse; font-size: 11px; }
.dt th { padding: 6px 10px; text-align: left; color: #555; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; position: sticky; top: 0; }
.dt td { padding: 7px 10px; color: #bbb; border-bottom: 1px solid #1a1e35; white-space: nowrap; }
.dt tr:last-child td { border-bottom: none; }
.dt tr:hover td { background: rgba(255,255,255,0.02); }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 10px !important; }
.muted { color: #555 !important; font-size: 10px !important; }
.bold { font-weight: 700; }
.green { color: #22c55e !important; } .red { color: #ef4444 !important; }
.ulink { color: #a78bfa !important; cursor: pointer; font-weight: 600; }
.ulink:hover { text-decoration: underline; }
.tp { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 8px; text-transform: uppercase; }
.tp.deposit { background: rgba(34,197,94,0.15); color: #22c55e; }
.tp.withdrawal { background: rgba(239,68,68,0.15); color: #ef4444; }
.sp { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 8px; text-transform: uppercase; }
.sp.completed { background: rgba(34,197,94,0.15); color: #22c55e; }
.sp.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.sp.failed { background: rgba(239,68,68,0.15); color: #ef4444; }
.is { background: #1e2240; border: 1px solid #252840; color: #e2e8f0; padding: 3px 6px; border-radius: 5px; font-size: 10px; cursor: pointer; outline: none; }
.dash { color: #333; }
.empty { text-align: center; color: #444; padding: 30px !important; }
</style>
