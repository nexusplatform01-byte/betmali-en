<template>
  <div class="bets-page">
    <!-- Totals -->
    <div class="totals-grid">
      <div class="tc all"><div class="tv">{{ bets.length }}</div><div class="tl">Total Bets</div><div class="ta">UGX {{ totalStake.toLocaleString() }}</div></div>
      <div class="tc pending"><div class="tv">{{ pendingBets.length }}</div><div class="tl">Pending</div><div class="ta">UGX {{ pendingStake.toLocaleString() }}</div></div>
      <div class="tc won"><div class="tv">{{ wonBets.length }}</div><div class="tl">Won</div><div class="ta">UGX {{ wonPayout.toLocaleString() }}</div></div>
      <div class="tc lost"><div class="tv">{{ lostBets.length }}</div><div class="tl">Lost</div><div class="ta">UGX {{ lostStake.toLocaleString() }}</div></div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" style="color:#555;flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" placeholder="Search ticket, match, user..." />
      </div>
      <div class="ftabs">
        <button v-for="f in ['All','Pending','Won','Lost']" :key="f" :class="['ftab', {active: sf===f}]" @click="sf=f">{{ f }}</button>
      </div>
    </div>

    <!-- Ticket cards list -->
    <div class="tickets-list">
      <div v-for="b in filtered" :key="b.id" class="tkt-card" @click="openTicket(b)">
        <div class="tkt-left">
          <div class="tkt-top">
            <span class="tkt-id">{{ b.ticketId }}</span>
            <span class="tkt-type">{{ b.sport.toUpperCase() }} · 1 match</span>
          </div>
          <div class="tkt-match">{{ b.match }}</div>
          <div class="tkt-sel">{{ b.selection }} · <span class="odds-val">{{ b.odds }}x</span></div>
        </div>
        <div class="tkt-right">
          <span :class="['sp', b.status]">{{ b.status }}</span>
          <div class="tkt-stake">UGX {{ b.stake.toLocaleString() }}</div>
          <div class="tkt-win">&#8594; UGX {{ b.potentialWin.toLocaleString() }}</div>
          <div class="tkt-user">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ getUserName(b.userId) }}
          </div>
        </div>
      </div>
      <div v-if="!filtered.length" class="empty">No bets found</div>
    </div>

    <!-- Ticket Detail Modal -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="selectedBet" class="backdrop" @click.self="selectedBet=null">
          <div class="tm-modal">
            <div class="tm-hdr">
              <div class="tm-hdr-l">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><polyline points="16 8 12 12 8 8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
                {{ selectedBet.ticketId }} · 1 EVENT
              </div>
              <button class="tm-x" @click="selectedBet=null">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="tm-body">
              <div class="tm-left">
                <div class="tmm-row">
                  <div class="tmm-meta">{{ selectedBet.sport }} · {{ formatFullDate(selectedBet.placedAt) }}</div>
                  <div class="tmm-teams">{{ selectedBet.match }}</div>
                  <div class="tmm-pick-row">
                    <span class="tmm-pick">Selection: <strong>{{ selectedBet.selection }}</strong></span>
                    <span class="tmm-odds">{{ selectedBet.odds }}</span>
                  </div>
                  <div :class="['tmm-st', selectedBet.status]">{{ selectedBet.status.toUpperCase() }}</div>
                </div>
              </div>
              <div class="tm-right">
                <div class="tm-user-info">
                  <div class="tm-av">{{ getUserName(selectedBet.userId).charAt(0) }}</div>
                  <div>
                    <div class="tm-uname">{{ getUserName(selectedBet.userId) }}</div>
                    <div class="tm-uid muted">{{ selectedBet.userId }}</div>
                  </div>
                </div>
                <div class="tm-info">
                  <div class="tmf"><span>TICKET ID</span><span class="tmf-v mono">{{ selectedBet.ticketId }}</span></div>
                  <div class="tmf"><span>TOTAL ODDS</span><span class="tmf-v odds">{{ selectedBet.odds }}</span></div>
                  <div class="tmf"><span>STAKE</span><span class="tmf-v">UGX {{ selectedBet.stake.toLocaleString() }}</span></div>
                  <div class="tmf total"><span>POSSIBLE WIN</span><span class="tmf-v green">UGX {{ selectedBet.potentialWin.toLocaleString() }}</span></div>
                  <div class="tmf"><span>PLACED</span><span class="tmf-v muted">{{ formatFullDate(selectedBet.placedAt) }}</span></div>
                  <div v-if="selectedBet.settledAt" class="tmf"><span>SETTLED</span><span class="tmf-v muted">{{ formatFullDate(selectedBet.settledAt) }}</span></div>
                </div>
                <div class="tm-status-row">
                  <span class="tm-st-lbl">STATUS</span>
                  <span :class="['tm-st-val', selectedBet.status]">{{ selectedBet.status.toUpperCase() }}</span>
                </div>
                <div class="tm-manage" v-if="selectedBet.status==='pending'">
                  <div class="manage-label">Manage Ticket</div>
                  <div v-if="settling" class="settling-msg">Processing...</div>
                  <div v-else class="manage-btns">
                    <button class="mb won" @click="markBet('won')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
                      Mark Won
                    </button>
                    <button class="mb lost" @click="markBet('lost')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Mark Lost
                    </button>
                  </div>
                </div>
                <button class="view-user-btn" @click="$router.push('/admin/users/'+selectedBet!.userId); selectedBet=null">View User Profile</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { bets, users, settleBet, formatFullDate, type Bet } from '../../stores/adminData'

const search = ref(''); const sf = ref('All')
const selectedBet = ref<Bet|null>(null)
const settling = ref(false)

const pendingBets = computed(() => bets.filter(b=>b.status==='pending'))
const wonBets = computed(() => bets.filter(b=>b.status==='won'))
const lostBets = computed(() => bets.filter(b=>b.status==='lost'))
const totalStake = computed(() => bets.reduce((s,b)=>s+b.stake,0))
const pendingStake = computed(() => pendingBets.value.reduce((s,b)=>s+b.stake,0))
const wonPayout = computed(() => wonBets.value.reduce((s,b)=>s+b.potentialWin,0))
const lostStake = computed(() => lostBets.value.reduce((s,b)=>s+b.stake,0))

const filtered = computed(() => bets.filter(b => {
  const q = search.value.toLowerCase()
  const ms = !q || b.ticketId.toLowerCase().includes(q) || b.match.toLowerCase().includes(q) || getUserName(b.userId).toLowerCase().includes(q)
  const ss = sf.value==='All' || b.status===sf.value.toLowerCase()
  return ms && ss
}).sort((a,b)=>new Date(b.placedAt).getTime()-new Date(a.placedAt).getTime()))

function getUserName(id: string) { return users.find(u=>u.id===id)?.name||id }
function openTicket(b: Bet) { selectedBet.value = { ...b } }

async function markBet(status: 'won' | 'lost') {
  if (!selectedBet.value || settling.value) return
  settling.value = true
  try {
    await settleBet(selectedBet.value.id, status)
    selectedBet.value = null
  } finally {
    settling.value = false
  }
}
</script>

<style scoped>
.bets-page { display: flex; flex-direction: column; gap: 10px; height: 100%; }
.totals-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
.tc { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 12px 14px; }
.tc.pending { border-color: rgba(245,166,35,0.3); }
.tc.won { border-color: rgba(34,197,94,0.3); }
.tc.lost { border-color: rgba(239,68,68,0.3); }
.tv { font-size: 26px; font-weight: 900; color: #fff; }
.tc.pending .tv { color: #f5a623; } .tc.won .tv { color: #22c55e; } .tc.lost .tv { color: #ef4444; }
.tl { font-size: 10px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
.ta { font-size: 10px; color: #555; margin-top: 3px; }
.filters-row { display: flex; align-items: center; gap: 8px; }
.search-bar { display: flex; align-items: center; gap: 8px; background: #13172b; border: 1px solid #1e2240; border-radius: 6px; padding: 6px 10px; flex: 1; }
.search-bar input { background: transparent; border: none; outline: none; color: #e2e8f0; font-size: 12px; width: 100%; }
.ftabs { display: flex; gap: 2px; background: #13172b; border: 1px solid #1e2240; border-radius: 6px; padding: 3px; }
.ftab { background: transparent; border: none; color: #888; padding: 5px 12px; border-radius: 5px; font-size: 11px; font-weight: 600; cursor: pointer; }
.ftab.active { background: rgba(124,58,237,0.2); color: #a78bfa; }
.ftab:hover:not(.active) { color: #ccc; }
.tickets-list { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; flex: 1; }
.tkt-card { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
.tkt-card:hover { border-color: #7c3aed; background: rgba(124,58,237,0.04); }
.tkt-left { flex: 1; min-width: 0; }
.tkt-top { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.tkt-id { font-family: monospace; font-size: 11px; color: #a78bfa; font-weight: 700; }
.tkt-type { font-size: 10px; color: #666; }
.tkt-match { font-size: 12px; color: #e2e8f0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tkt-sel { font-size: 11px; color: #888; margin-top: 2px; }
.odds-val { color: #f5a623; font-weight: 700; }
.tkt-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.sp { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 8px; text-transform: uppercase; }
.sp.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.sp.won { background: rgba(34,197,94,0.15); color: #22c55e; }
.sp.lost { background: rgba(239,68,68,0.15); color: #ef4444; }
.tkt-stake { font-size: 12px; font-weight: 700; color: #fff; }
.tkt-win { font-size: 10px; color: #22c55e; }
.tkt-user { font-size: 10px; color: #666; display: flex; align-items: center; gap: 3px; }
.empty { text-align: center; color: #444; padding: 40px; }
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.tm-modal { background: #13172b; border: 1px solid #1e2240; border-radius: 12px; width: 680px; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
.tm-hdr { padding: 12px 16px; border-bottom: 1px solid #1e2240; display: flex; justify-content: space-between; align-items: center; background: #1a1f38; border-radius: 12px 12px 0 0; }
.tm-hdr-l { font-size: 12px; font-weight: 700; color: #a78bfa; display: flex; align-items: center; gap: 6px; }
.tm-x { background: transparent; border: none; color: #888; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; }
.tm-x:hover { color: #fff; background: #252840; }
.tm-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.tm-left { padding: 14px; border-right: 1px solid #1e2240; }
.tmm-row { display: flex; flex-direction: column; gap: 6px; }
.tmm-meta { font-size: 10px; color: #666; }
.tmm-teams { font-size: 14px; font-weight: 700; color: #fff; }
.tmm-pick-row { display: flex; justify-content: space-between; align-items: center; }
.tmm-pick { font-size: 11px; color: #aaa; }
.tmm-odds { font-size: 13px; font-weight: 800; color: #f5a623; }
.tmm-st { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 8px; text-transform: uppercase; display: inline-block; margin-top: 4px; }
.tmm-st.pending { background: rgba(245,166,35,0.15); color: #f5a623; }
.tmm-st.won { background: rgba(34,197,94,0.15); color: #22c55e; }
.tmm-st.lost { background: rgba(239,68,68,0.15); color: #ef4444; }
.tm-right { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.tm-user-info { display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid #1e2240; }
.tm-av { width: 34px; height: 34px; background: linear-gradient(135deg,#7c3aed,#5c35c9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
.tm-uname { font-size: 13px; font-weight: 700; color: #e2e8f0; }
.tm-uid { font-size: 10px; }
.tm-info { display: flex; flex-direction: column; gap: 6px; }
.tmf { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #888; padding: 4px 0; border-bottom: 1px solid #1e2240; }
.tmf:last-child { border-bottom: none; }
.tmf.total { background: rgba(34,197,94,0.06); padding: 6px 8px; border-radius: 6px; margin-top: 2px; }
.tmf-v { color: #e2e8f0; font-weight: 700; font-size: 12px; }
.tmf-v.odds { color: #f5a623; }
.tmf-v.green { color: #22c55e; }
.tmf-v.mono { font-family: monospace; color: #a78bfa; }
.tmf-v.muted { color: #666; font-weight: 400; }
.tm-status-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #0d0f1e; border-radius: 6px; }
.tm-st-lbl { font-size: 10px; color: #888; font-weight: 600; letter-spacing: 1px; }
.tm-st-val { font-size: 12px; font-weight: 800; }
.tm-st-val.pending { color: #f5a623; } .tm-st-val.won { color: #22c55e; } .tm-st-val.lost { color: #ef4444; }
.tm-manage { background: rgba(255,255,255,0.02); border: 1px solid #1e2240; border-radius: 8px; padding: 10px; }
.manage-label { font-size: 10px; color: #888; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
.settling-msg { font-size: 12px; color: #888; text-align: center; padding: 8px; }
.manage-btns { display: flex; gap: 8px; }
.mb { flex: 1; padding: 8px; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; }
.mb.won { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.mb.won:hover { background: rgba(34,197,94,0.25); }
.mb.lost { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
.mb.lost:hover { background: rgba(239,68,68,0.25); }
.view-user-btn { background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.25); color: #a78bfa; padding: 8px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; width: 100%; }
.view-user-btn:hover { background: rgba(124,58,237,0.22); }
.muted { color: #666; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
