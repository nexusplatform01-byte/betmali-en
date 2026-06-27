<template>
  <div class="wallet-page">
    <!-- Balance cards -->
    <div class="balance-grid">
      <div class="bc primary">
        <div class="bc-icon">🏦</div>
        <div class="bc-body">
          <div class="bc-label">Real Site Balance</div>
          <div class="bc-val">UGX {{ siteSettings.siteBalance.toLocaleString() }}</div>
          <div class="bc-sub">Gross account balance</div>
        </div>
        <button class="withdraw-btn" @click="openWithdraw">Withdraw ↑</button>
      </div>
      <div class="bc users">
        <div class="bc-icon">👥</div>
        <div class="bc-body">
          <div class="bc-label">All Users Wallets</div>
          <div class="bc-val">UGX {{ totalUsersWallet.toLocaleString() }}</div>
          <div class="bc-sub">{{ users.length }} user wallets combined</div>
        </div>
      </div>
      <div class="bc pend">
        <div class="bc-icon">🎯</div>
        <div class="bc-body">
          <div class="bc-label">Pending Bets at Risk</div>
          <div class="bc-val">UGX {{ pendingBetsTotal.toLocaleString() }}</div>
          <div class="bc-sub">{{ pendingBetsCount }} active bets · NOT in wallet</div>
        </div>
      </div>
      <div class="bc net">
        <div class="bc-icon">💵</div>
        <div class="bc-body">
          <div class="bc-label">Site (minus users)</div>
          <div class="bc-val" :class="{red: siteMinusUsers<0}">UGX {{ siteMinusUsers.toLocaleString() }}</div>
          <div class="bc-sub">After removing user wallets</div>
        </div>
      </div>
      <div class="bc net2">
        <div class="bc-icon">📊</div>
        <div class="bc-body">
          <div class="bc-label">Site (minus users & pending)</div>
          <div class="bc-val" :class="{red: siteMinusUsersPending<0}">UGX {{ siteMinusUsersPending.toLocaleString() }}</div>
          <div class="bc-sub">True free balance</div>
        </div>
      </div>
    </div>

    <!-- Bar breakdown -->
    <div class="panel">
      <div class="ph">Balance Breakdown</div>
      <div class="bp-body">
        <div class="bp-row" v-for="r in breakdown" :key="r.label">
          <div class="bp-label">{{ r.label }}</div>
          <div class="bp-bar-wrap"><div class="bp-bar" :style="{background: r.color, width: pct(r.val)}"></div></div>
          <div class="bp-val">UGX {{ r.val.toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <div class="two-col">
      <!-- Users list -->
      <div class="panel">
        <div class="ph"><span>User Balances</span><span class="total-b">Total: UGX {{ totalUsersWallet.toLocaleString() }}</span></div>
        <table class="dt">
          <thead><tr><th>User</th><th>Phone</th><th>Balance</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="u in usersSorted" :key="u.id" class="crow" @click="$router.push('/admin/users/'+u.id)">
              <td><div class="uc"><div class="av">{{ u.name.charAt(0) }}</div><span>{{ u.name }}</span></div></td>
              <td class="muted">{{ u.phone }}</td>
              <td class="bold">UGX {{ u.walletBalance.toLocaleString() }}</td>
              <td><span :class="['sp', u.status]">{{ u.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pending bets -->
      <div class="panel">
        <div class="ph"><span>Pending Bets (at risk)</span><span class="total-b yellow">UGX {{ pendingBetsTotal.toLocaleString() }}</span></div>
        <table class="dt">
          <thead><tr><th>Ticket</th><th>User</th><th>Stake</th><th>Potential Win</th></tr></thead>
          <tbody>
            <tr v-for="b in pendingBets" :key="b.id">
              <td class="mono">{{ b.ticketId }}</td>
              <td class="ulink" @click="$router.push('/admin/users/'+b.userId)">{{ getUserName(b.userId) }}</td>
              <td>UGX {{ b.stake.toLocaleString() }}</td>
              <td class="red">UGX {{ b.potentialWin.toLocaleString() }}</td>
            </tr>
            <tr v-if="!pendingBets.length"><td colspan="4" class="empty">No pending bets</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Site balance adjust -->
    <div class="panel">
      <div class="ph">Adjust Site Balance</div>
      <div class="adj-row">
        <input v-model.number="adjAmt" type="number" placeholder="Amount (UGX)" class="adj-inp" />
        <input v-model="adjNote" type="text" placeholder="Reason / Note" class="adj-inp" />
        <button class="adj-btn g" @click="doAdj('add')">+ Add</button>
        <button class="adj-btn r" @click="doAdj('deduct')">- Deduct</button>
        <span v-if="adjMsg" class="adj-msg">{{ adjMsg }}</span>
      </div>
    </div>

    <!-- WITHDRAW MODAL -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="showWithdraw" class="backdrop" @click.self="showWithdraw=false">
          <div class="wm-card">
            <div class="wm-hdr">
              <div class="wm-title">↑ Withdraw from Site Balance</div>
              <button class="wm-x" @click="showWithdraw=false">✕</button>
            </div>
            <div class="wm-body">
              <div class="wm-bal-row">Site Balance: <strong>UGX {{ siteSettings.siteBalance.toLocaleString() }}</strong></div>
              <div class="fg"><label>Amount (UGX)</label><input v-model.number="wdAmt" type="number" placeholder="Enter amount" class="pi" /></div>
              <div class="wm-quick">
                <button v-for="a in [50000,100000,500000,1000000]" :key="a" class="wm-qa" @click="wdAmt=a">{{ a>=1000000?(a/1000000)+'M':(a/1000)+'K' }}</button>
              </div>
              <div class="fg"><label>Method</label>
                <div class="wm-methods">
                  <button v-for="m in methods" :key="m" :class="['wm-mth', {active: wdMethod===m}]" @click="wdMethod=m">{{ m }}</button>
                </div>
              </div>
              <div class="fg"><label>Account / Phone</label><input v-model="wdPhone" class="pi" type="text" placeholder="Account number or phone" /></div>
              <div class="fg"><label>Note (optional)</label><input v-model="wdNote" class="pi" type="text" placeholder="Reason for withdrawal" /></div>
              <button class="wm-submit" @click="doWithdraw" :disabled="!wdAmt||wdAmt<=0||wdAmt>siteSettings.siteBalance">
                Withdraw UGX {{ wdAmt ? wdAmt.toLocaleString() : '0' }}
              </button>
              <div v-if="wdMsg" :class="['pmsg', wdOk?'ok':'err']">{{ wdMsg }}</div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { users, bets, siteSettings, transactions } from '../../stores/adminData'

const pendingBets = computed(() => bets.filter(b=>b.status==='pending'))
const pendingBetsTotal = computed(() => pendingBets.value.reduce((s,b)=>s+b.stake,0))
const pendingBetsCount = computed(() => pendingBets.value.length)
const totalUsersWallet = computed(() => users.reduce((s,u)=>s+u.walletBalance,0))
const siteMinusUsers = computed(() => siteSettings.siteBalance - totalUsersWallet.value)
const siteMinusUsersPending = computed(() => siteSettings.siteBalance - totalUsersWallet.value - pendingBetsTotal.value)
const usersSorted = computed(() => [...users].sort((a,b)=>b.walletBalance-a.walletBalance))

const breakdown = computed(() => [
  { label: 'Real Site Balance', val: siteSettings.siteBalance, color: '#7c3aed' },
  { label: 'Users Wallets Total', val: totalUsersWallet.value, color: '#3b82f6' },
  { label: 'Pending Bets', val: pendingBetsTotal.value, color: '#f5a623' },
  { label: 'Free Balance', val: Math.max(0, siteMinusUsersPending.value), color: '#22c55e' },
])

function pct(val: number) { return Math.min(100, Math.round((val / (siteSettings.siteBalance||1)) * 100)) + '%' }
function getUserName(id: string) { return users.find(u=>u.id===id)?.name||id }

const adjAmt = ref(0); const adjNote = ref(''); const adjMsg = ref('')
function doAdj(type: 'add'|'deduct') {
  if (adjAmt.value<=0) return
  if (type==='add') { siteSettings.siteBalance+=adjAmt.value; adjMsg.value='✅ Added UGX '+adjAmt.value.toLocaleString() }
  else { siteSettings.siteBalance=Math.max(0,siteSettings.siteBalance-adjAmt.value); adjMsg.value='✅ Deducted UGX '+adjAmt.value.toLocaleString() }
  adjAmt.value=0; adjNote.value=''
  setTimeout(()=>{ adjMsg.value='' },3000)
}

// Withdraw modal
const showWithdraw = ref(false)
const wdAmt = ref(0); const wdMethod = ref('Mobile Money'); const wdPhone = ref('')
const wdNote = ref(''); const wdMsg = ref(''); const wdOk = ref(false)
const methods = ['Mobile Money', 'Bank Transfer', 'Cash']

function openWithdraw() { showWithdraw.value=true; wdMsg.value=''; wdAmt.value=0 }

function doWithdraw() {
  if (!wdAmt.value||wdAmt.value<=0) { wdMsg.value='Enter a valid amount'; wdOk.value=false; return }
  if (wdAmt.value>siteSettings.siteBalance) { wdMsg.value='Insufficient site balance'; wdOk.value=false; return }
  siteSettings.siteBalance -= wdAmt.value
  transactions.unshift({
    id: 'tx'+Date.now(), userId: 'admin', type: 'withdrawal', amount: wdAmt.value,
    method: wdMethod.value, status: 'completed', reference: 'SITE-'+Date.now(), createdAt: new Date().toISOString()
  })
  wdMsg.value='✅ Withdrawn UGX '+wdAmt.value.toLocaleString()+' via '+wdMethod.value
  wdOk.value=true
  wdAmt.value=0; wdPhone.value=''; wdNote.value=''
  setTimeout(()=>{ showWithdraw.value=false; wdMsg.value='' },2000)
}
</script>

<style scoped>
.wallet-page { display: flex; flex-direction: column; gap: 10px; height: 100%; }
.balance-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 10px; }
.bc { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 12px; display: flex; align-items: flex-start; gap: 10px; position: relative; }
.bc.primary { border-color: rgba(124,58,237,0.4); }
.bc.users { border-color: rgba(59,130,246,0.4); }
.bc.pend { border-color: rgba(245,166,35,0.4); }
.bc.net { border-color: rgba(34,197,94,0.3); }
.bc.net2 { border-color: rgba(20,184,166,0.3); }
.bc-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.bc-label { font-size: 10px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.bc-val { font-size: 15px; font-weight: 900; color: #fff; margin-top: 4px; }
.bc-val.red { color: #ef4444; }
.bc-sub { font-size: 10px; color: #555; margin-top: 3px; }
.withdraw-btn { position: absolute; bottom: 10px; right: 10px; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; cursor: pointer; }
.withdraw-btn:hover { background: rgba(124,58,237,0.25); }
.panel { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; overflow: hidden; }
.ph { padding: 8px 12px; border-bottom: 1px solid #1e2240; font-size: 12px; font-weight: 700; color: #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.total-b { font-size: 11px; color: #22c55e; font-weight: 700; }
.total-b.yellow { color: #f5a623; }
.bp-body { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
.bp-row { display: flex; align-items: center; gap: 10px; }
.bp-label { width: 180px; font-size: 11px; color: #aaa; flex-shrink: 0; }
.bp-bar-wrap { flex: 1; background: #1e2240; border-radius: 3px; height: 8px; overflow: hidden; }
.bp-bar { height: 100%; border-radius: 3px; transition: width 0.3s; }
.bp-val { width: 160px; font-size: 11px; font-weight: 700; color: #e2e8f0; text-align: right; flex-shrink: 0; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.dt { width: 100%; border-collapse: collapse; font-size: 11px; }
.dt th { padding: 6px 10px; text-align: left; color: #555; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background: #0d0f1e; border-bottom: 1px solid #1e2240; }
.dt td { padding: 7px 10px; color: #bbb; border-bottom: 1px solid #1a1e35; white-space: nowrap; }
.dt tr:last-child td { border-bottom: none; }
.crow { cursor: pointer; } .crow:hover td { background: rgba(124,58,237,0.04); }
.uc { display: flex; align-items: center; gap: 7px; }
.av { width: 24px; height: 24px; background: linear-gradient(135deg,#7c3aed,#5c35c9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; flex-shrink: 0; }
.bold { color: #fff; font-weight: 700; }
.muted { color: #555 !important; font-size: 10px !important; }
.red { color: #ef4444 !important; }
.mono { font-family: monospace; color: #a78bfa !important; font-size: 10px !important; }
.ulink { color: #a78bfa !important; cursor: pointer; font-weight: 600; }
.ulink:hover { text-decoration: underline; }
.sp { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 8px; text-transform: uppercase; }
.sp.active { background: rgba(34,197,94,0.15); color: #22c55e; }
.sp.suspended { background: rgba(245,166,35,0.15); color: #f5a623; }
.sp.banned { background: rgba(239,68,68,0.15); color: #ef4444; }
.empty { text-align: center; color: #444; padding: 24px !important; }
.adj-row { padding: 12px 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.adj-inp { background: #0d0f1e; border: 1px solid #252840; border-radius: 6px; color: #fff; padding: 7px 10px; font-size: 11px; outline: none; }
.adj-inp:focus { border-color: #7c3aed; }
.adj-btn { padding: 7px 14px; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; }
.adj-btn.g { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.adj-btn.r { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
.adj-msg { font-size: 11px; color: #22c55e; font-weight: 600; }

/* Withdraw Modal */
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.wm-card { background: #13172b; border: 1px solid #252840; border-radius: 14px; width: 400px; max-width: 95vw; }
.wm-hdr { padding: 14px 18px; border-bottom: 1px solid #1e2240; display: flex; justify-content: space-between; align-items: center; background: #1a1f38; border-radius: 14px 14px 0 0; }
.wm-title { font-size: 14px; font-weight: 700; color: #e2e8f0; }
.wm-x { background: transparent; border: none; color: #888; cursor: pointer; font-size: 14px; padding: 2px 6px; border-radius: 4px; }
.wm-x:hover { color: #fff; background: #252840; }
.wm-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.wm-bal-row { font-size: 12px; color: #888; background: #0d0f1e; padding: 8px 12px; border-radius: 8px; }
.wm-bal-row strong { color: #22c55e; }
.fg { display: flex; flex-direction: column; gap: 4px; }
.fg label { font-size: 10px; color: #888; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.pi { background: #0d0f1e; border: 1px solid #252840; border-radius: 8px; color: #fff; padding: 9px 12px; font-size: 13px; outline: none; }
.pi:focus { border-color: #7c3aed; }
.wm-quick { display: flex; gap: 6px; }
.wm-qa { background: #1e2240; border: 1px solid #252840; color: #aaa; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.wm-qa:hover { background: rgba(124,58,237,0.15); color: #a78bfa; border-color: rgba(124,58,237,0.3); }
.wm-methods { display: flex; gap: 6px; flex-wrap: wrap; }
.wm-mth { background: #1e2240; border: 1px solid #252840; color: #aaa; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; }
.wm-mth.active { background: rgba(124,58,237,0.15); color: #a78bfa; border-color: rgba(124,58,237,0.4); }
.wm-submit { background: linear-gradient(135deg,#7c3aed,#5c35c9); color: #fff; border: none; border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 4px; }
.wm-submit:disabled { opacity: 0.4; cursor: not-allowed; }
.wm-submit:not(:disabled):hover { opacity: 0.9; }
.pmsg { font-size: 12px; font-weight: 600; padding: 8px 12px; border-radius: 6px; }
.pmsg.ok { background: rgba(34,197,94,0.1); color: #22c55e; }
.pmsg.err { background: rgba(239,68,68,0.1); color: #ef4444; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
