<template>
  <div class="profile-app">
    <TopNav />
    <div class="profile-layout">

      <!-- ── LEFT NAV ── -->
      <aside class="profile-sidebar">
        <div class="ps-user-card">
          <div class="ps-avatar">{{ avatarLetter }}</div>
          <div class="ps-info">
            <div class="ps-name">{{ currentUser?.name }}</div>
            <div class="ps-balance">
              <span v-if="balVis">UGX {{ currentUser?.balance.toLocaleString() }}</span>
              <span v-else>UGX ••••••</span>
              <button class="ps-eye" @click="balVis = !balVis">
                <svg v-if="balVis" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="eye-svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="eye-svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
        </div>
        <nav class="ps-nav">
          <button v-for="t in tabs" :key="t.id" class="psnav-btn" :class="{ active: activeTab === t.id }" @click="activeTab = t.id">
            <span class="psnav-icon">{{ t.icon }}</span>
            <span>{{ t.label }}</span>
          </button>
        </nav>
        <button class="ps-back-btn" @click="$router.push('/')">← Back to Betting</button>
      </aside>

      <!-- ── MAIN CONTENT ── -->
      <main class="profile-main">

        <!-- ═══ OVERVIEW ═══ -->
        <section v-if="activeTab === 'overview'" class="tab-section">
          <div class="section-title">Overview</div>
          <div class="overview-welcome">
            <div class="ow-avatar">{{ avatarLetter }}</div>
            <div>
              <div class="ow-name">Welcome back, {{ currentUser?.name }}!</div>
              <div class="ow-since">Member since June 2026</div>
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="sc-val">{{ bets.length }}</div>
              <div class="sc-label">Total Bets</div>
            </div>
            <div class="stat-card won">
              <div class="sc-val">{{ bets.filter(b=>b.status==='won').length }}</div>
              <div class="sc-label">Won</div>
            </div>
            <div class="stat-card lost">
              <div class="sc-val">{{ bets.filter(b=>b.status==='lost').length }}</div>
              <div class="sc-label">Lost</div>
            </div>
            <div class="stat-card pending">
              <div class="sc-val">{{ bets.filter(b=>b.status==='pending').length }}</div>
              <div class="sc-label">Pending</div>
            </div>
          </div>
          <div class="ov-winrate" v-if="bets.filter(b=>b.status!=='pending').length">
            <div class="wrl">Win Rate</div>
            <div class="wr-bar-wrap">
              <div class="wr-bar" :style="{ width: winRatePct + '%' }"></div>
            </div>
            <div class="wr-pct">{{ winRatePct }}%</div>
          </div>
          <div class="section-subtitle">Recent Bets</div>
          <div class="recent-bets">
            <div v-for="b in bets.slice(0,3)" :key="b.id" class="rb-card" @click="openTicket(b)">
              <div class="rb-left">
                <div class="rb-id">TICKET #{{ b.id }}</div>
                <div class="rb-meta">{{ b.type.toUpperCase() }} · {{ b.selections.length }} pick{{ b.selections.length > 1 ? 's' : '' }}</div>
              </div>
              <div class="rb-right">
                <span class="status-badge" :class="b.status">{{ b.status.toUpperCase() }}</span>
              </div>
            </div>
          </div>
          <div class="quick-actions">
            <button class="qa-btn deposit" @click="activeTab='wallet'">💰 Deposit</button>
            <button class="qa-btn withdraw" @click="activeTab='wallet'; walletTab='withdraw'">💸 Withdraw</button>
            <button class="qa-btn bets" @click="activeTab='bets'">🎫 My Bets</button>
          </div>
        </section>

        <!-- ═══ WALLET ═══ -->
        <section v-else-if="activeTab === 'wallet'" class="tab-section">
          <div class="section-title">Wallet</div>
          <div class="wallet-balance-card">
            <div class="wbc-label">Available Balance</div>
            <div class="wbc-amount">UGX {{ currentUser?.balance.toLocaleString() }}</div>
            <div class="wbc-actions">
              <button class="wbc-tab-btn" :class="{ active: walletTab==='deposit' }" @click="walletTab='deposit'">Deposit</button>
              <button class="wbc-tab-btn" :class="{ active: walletTab==='withdraw' }" @click="walletTab='withdraw'">Withdraw</button>
            </div>
          </div>

          <!-- Deposit -->
          <div v-if="walletTab === 'deposit'" class="wallet-form-card">
            <div class="wf-title">💰 Deposit Funds</div>
            <div class="form-group">
              <label>Amount (UGX)</label>
              <input v-model.number="depositAmount" type="number" placeholder="e.g. 50,000" class="pf-input" min="1000" />
            </div>
            <div class="quick-amounts">
              <button v-for="a in [5000,10000,20000,50000,100000]" :key="a" class="qa-amount" @click="depositAmount = a">{{ a>=1000 ? (a/1000)+'K' : a }}</button>
            </div>
            <div class="form-group">
              <label>Payment Method</label>
              <div class="payment-methods">
                <button v-for="m in paymentMethods" :key="m.id" class="pm-btn" :class="{ active: selectedPayment === m.id }" @click="selectedPayment = m.id">
                  <span class="pm-icon">{{ m.icon }}</span>
                  <span class="pm-name">{{ m.name }}</span>
                </button>
              </div>
            </div>
            <div class="form-group" v-if="selectedPayment !== 'card'">
              <label>{{ selectedPayment === 'mtn' ? 'MTN' : 'Airtel' }} Phone Number</label>
              <input v-model="depositPhone" type="tel" placeholder="e.g. 0700000000" class="pf-input" />
            </div>
            <div v-if="selectedPayment === 'card'" class="form-group">
              <label>Card Number</label>
              <input v-model="cardNumber" type="text" placeholder="0000 0000 0000 0000" class="pf-input" maxlength="19" />
            </div>
            <button class="pf-submit deposit-btn" @click="handleDeposit" :disabled="!depositAmount || depositAmount < 1000">
              Deposit UGX {{ depositAmount ? depositAmount.toLocaleString() : '0' }}
            </button>
            <div v-if="walletMsg" class="wallet-msg" :class="walletMsgType">{{ walletMsg }}</div>
          </div>

          <!-- Withdraw -->
          <div v-else class="wallet-form-card">
            <div class="wf-title">💸 Withdraw Funds</div>
            <div class="form-group">
              <label>Amount (UGX)</label>
              <input v-model.number="withdrawAmount" type="number" placeholder="e.g. 20,000" class="pf-input" :max="currentUser?.balance" min="1000" />
              <div class="field-hint">Available: UGX {{ currentUser?.balance.toLocaleString() }}</div>
            </div>
            <div class="quick-amounts">
              <button v-for="a in [5000,10000,20000,50000]" :key="a" class="qa-amount" @click="withdrawAmount = a">{{ a>=1000 ? (a/1000)+'K' : a }}</button>
            </div>
            <div class="form-group">
              <label>Withdrawal Method</label>
              <div class="payment-methods">
                <button v-for="m in paymentMethods" :key="m.id" class="pm-btn" :class="{ active: selectedWithdraw === m.id }" @click="selectedWithdraw = m.id">
                  <span class="pm-icon">{{ m.icon }}</span>
                  <span class="pm-name">{{ m.name }}</span>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>Phone / Account Number</label>
              <input v-model="withdrawPhone" type="tel" placeholder="e.g. 0700000000" class="pf-input" />
            </div>
            <button class="pf-submit withdraw-btn" @click="handleWithdraw" :disabled="!withdrawAmount || withdrawAmount < 1000 || withdrawAmount > (currentUser?.balance ?? 0)">
              Withdraw UGX {{ withdrawAmount ? withdrawAmount.toLocaleString() : '0' }}
            </button>
            <div v-if="walletMsg" class="wallet-msg" :class="walletMsgType">{{ walletMsg }}</div>
          </div>
        </section>

        <!-- ═══ MY BETS ═══ -->
        <section v-else-if="activeTab === 'bets'" class="tab-section">
          <div class="section-title">My Bets</div>
          <div class="bet-filters">
            <button v-for="f in betFilters" :key="f" class="bf-btn" :class="{ active: betFilter === f }" @click="betFilter = f">{{ f }}</button>
          </div>
          <div v-if="filteredBets.length === 0" class="empty-state">No {{ betFilter.toLowerCase() }} bets yet.</div>
          <div class="bets-list">
            <div v-for="b in filteredBets" :key="b.id" class="ticket-card" @click="openTicket(b)">
              <div class="tc-top">
                <div class="tc-id">
                  <span class="ticket-icon">🎫</span>
                  TICKET #{{ b.id }}
                </div>
                <span class="status-badge" :class="b.status">{{ b.status.toUpperCase() }}</span>
              </div>
              <div class="tc-picks">{{ b.type.toUpperCase() }} · {{ b.selections.length }} pick{{ b.selections.length > 1 ? 's' : '' }} · Odds {{ b.combinedOdds.toFixed(2) }}</div>
              <div class="tc-matches">
                <span v-for="(s, i) in b.selections.slice(0,2)" :key="s.key" class="tc-match-pill">{{ s.matchName }}</span>
                <span v-if="b.selections.length > 2" class="tc-match-more">+{{ b.selections.length - 2 }} more</span>
              </div>
              <div class="tc-bottom">
                <div class="tc-stake"><span class="tc-lbl">Stake</span><span class="tc-val">UGX {{ b.stake.toLocaleString() }}</span></div>
                <div class="tc-potential"><span class="tc-lbl">Potential Win</span><span class="tc-val green">UGX {{ b.potentialReturn.toLocaleString() }}</span></div>
              </div>
              <div class="tc-arrow">›</div>
            </div>
          </div>
        </section>

        <!-- ═══ TRANSACTIONS ═══ -->
        <section v-else-if="activeTab === 'transactions'" class="tab-section">
          <div class="section-title">Transactions</div>
          <div class="bet-filters">
            <button v-for="f in txFilters" :key="f" class="bf-btn" :class="{ active: txFilter === f }" @click="txFilter = f">{{ f }}</button>
          </div>
          <div class="tx-list">
            <div v-for="tx in filteredTx" :key="tx.id" class="tx-row">
              <div class="tx-icon-wrap" :class="tx.type">{{ tx.icon }}</div>
              <div class="tx-body">
                <div class="tx-name">{{ tx.name }}</div>
                <div class="tx-date">{{ fmtDate(tx.date) }}</div>
              </div>
              <div class="tx-amount" :class="tx.positive ? 'positive' : 'negative'">
                {{ tx.positive ? '+' : '-' }}UGX {{ tx.amount.toLocaleString() }}
              </div>
            </div>
          </div>
        </section>

        <!-- ═══ ACCOUNT ═══ -->
        <section v-else-if="activeTab === 'account'" class="tab-section">
          <div class="section-title">Account</div>
          <div class="account-avatar-row">
            <div class="acc-avatar">{{ avatarLetter }}</div>
            <div>
              <div class="acc-name-big">{{ currentUser?.name }}</div>
              <div class="acc-member">Member since June 2026</div>
            </div>
          </div>
          <div class="form-card">
            <div class="form-card-title">Personal Information</div>
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="accName" type="text" class="pf-input" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="accPhone" type="tel" class="pf-input" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="accEmail" type="email" class="pf-input" placeholder="you@email.com" />
            </div>
            <div class="form-group">
              <label>Date of Birth</label>
              <input v-model="accDob" type="date" class="pf-input" />
            </div>
            <button class="pf-submit" @click="saveAccount">Save Changes</button>
            <div v-if="accMsg" class="wallet-msg success">{{ accMsg }}</div>
          </div>
          <div class="form-card" style="margin-top: 16px;">
            <div class="form-card-title">Change Password</div>
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" class="pf-input" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" class="pf-input" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" class="pf-input" placeholder="••••••••" />
            </div>
            <button class="pf-submit" @click="accMsg = 'Password updated!'">Update Password</button>
          </div>
        </section>

        <!-- ═══ SETTINGS ═══ -->
        <section v-else-if="activeTab === 'settings'" class="tab-section">
          <div class="section-title">Settings</div>
          <div class="form-card">
            <div class="form-card-title">Notifications</div>
            <div v-for="n in notifications" :key="n.id" class="setting-row">
              <div class="sr-label">{{ n.icon }} {{ n.label }}</div>
              <button class="toggle-btn" :class="{ on: n.enabled }" @click="n.enabled = !n.enabled">
                <span class="toggle-knob"></span>
              </button>
            </div>
          </div>
          <div class="form-card" style="margin-top:16px;">
            <div class="form-card-title">Display</div>
            <div class="setting-row">
              <div class="sr-label">📊 Odds Format</div>
              <div class="seg-control">
                <button v-for="o in ['Decimal','Fractional','American']" :key="o" class="seg-btn" :class="{ active: oddsFormat === o }" @click="oddsFormat = o">{{ o }}</button>
              </div>
            </div>
            <div class="setting-row">
              <div class="sr-label">🌙 Theme</div>
              <div class="seg-control">
                <button class="seg-btn active">Dark</button>
                <button class="seg-btn" @click="">Light</button>
              </div>
            </div>
          </div>
          <div class="form-card" style="margin-top:16px;">
            <div class="form-card-title">Responsible Gambling</div>
            <div class="form-group">
              <label>Daily Deposit Limit (UGX)</label>
              <input v-model.number="dailyLimit" type="number" class="pf-input" placeholder="e.g. 100,000" />
            </div>
            <button class="pf-submit" @click="accMsg2='Limit saved!'">Save Limit</button>
            <div v-if="accMsg2" class="wallet-msg success" style="margin-top:8px;">{{ accMsg2 }}</div>
            <div class="rg-warning">
              <span>⚠️</span>
              <div>
                <div class="rg-w-title">Self Exclusion</div>
                <div class="rg-w-sub">Temporarily or permanently restrict your account from betting.</div>
              </div>
            </div>
            <button class="pf-submit" style="background:#e84c6b; margin-top:10px;">Request Self Exclusion</button>
          </div>
        </section>

      </main>
    </div>

    <!-- ═══ BET TICKET DETAIL MODAL ═══ -->
    <transition name="modal-fade">
      <div v-if="selectedTicket" class="ticket-backdrop" @click.self="selectedTicket = null">
        <div class="ticket-modal">
          <div class="tm-header">
            <div>
              <div class="tm-id">🎫 TICKET #{{ selectedTicket.id }}</div>
              <div class="tm-date">{{ fmtDate(selectedTicket.timestamp) }}</div>
            </div>
            <div class="tm-header-right">
              <span class="status-badge lg" :class="selectedTicket.status">{{ selectedTicket.status.toUpperCase() }}</span>
              <button class="tm-close" @click="selectedTicket = null">✕</button>
            </div>
          </div>

          <div class="tm-body">
            <!-- Selections -->
            <div class="tm-section-title">Selections</div>
            <div class="tm-selections">
              <div v-for="(sel, i) in selectedTicket.selections" :key="sel.key" class="tms-row">
                <div class="tms-match">
                  <div class="tms-match-name">{{ sel.matchName }}</div>
                  <div class="tms-market">{{ sel.market }}</div>
                </div>
                <div class="tms-right">
                  <div class="tms-label">{{ sel.label }}</div>
                  <div class="tms-odds">{{ sel.odds }}</div>
                </div>
                <div class="tms-status">
                  <span class="sel-status-dot" :class="selectedTicket.selectionResults[i]?.status ?? 'pending'"></span>
                  <span class="sel-status-txt" :class="selectedTicket.selectionResults[i]?.status ?? 'pending'">
                    {{ (selectedTicket.selectionResults[i]?.status ?? 'pending').toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Financials -->
            <div class="tm-financials">
              <div class="tmf-row"><span>Type</span><span>{{ selectedTicket.type.toUpperCase() }}</span></div>
              <div class="tmf-row"><span>Combined Odds</span><span class="tmf-odds">{{ selectedTicket.combinedOdds.toFixed(2) }}</span></div>
              <div class="tmf-row"><span>Stake</span><span>UGX {{ selectedTicket.stake.toLocaleString() }}</span></div>
              <div v-if="selectedTicket.bonusPct > 0" class="tmf-row bonus"><span>Bonus Applied</span><span class="green">+{{ selectedTicket.bonusPct }}%</span></div>
              <div class="tmf-row total"><span>Potential Win</span><span class="green big">UGX {{ selectedTicket.potentialReturn.toLocaleString() }}</span></div>
            </div>

            <!-- Actions -->
            <div class="tm-actions">
              <button v-if="selectedTicket.status === 'pending'" class="tma-btn cashout" @click="showCashout = !showCashout">
                💵 Cashout
              </button>
              <button class="tma-btn share" @click="shareTicket">
                📤 Share
              </button>
              <button class="tma-btn reuse" @click="reuseBet(selectedTicket)">
                🔁 Reuse Bet
              </button>
            </div>

            <!-- Cashout panel -->
            <transition name="slide-down">
              <div v-if="showCashout && selectedTicket.status === 'pending'" class="cashout-panel">
                <div class="cp-title">Early Cashout</div>
                <div class="cp-amount">UGX {{ Math.round(selectedTicket.stake * 0.85).toLocaleString() }}</div>
                <div class="cp-note">Secure {{ Math.round((selectedTicket.stake * 0.85 / selectedTicket.potentialReturn) * 100) }}% of your potential win now</div>
                <button class="cp-confirm" @click="confirmCashout">Confirm Cashout</button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import TopNav from '@/components/TopNav.vue'
import { useAuthModal } from '@/composables/useAuthModal'
import { useBets, type PlacedBet } from '@/composables/useBets'
import { useBetSlip } from '@/composables/useBetSlip'

const router = useRouter()
const { currentUser, addToBalance, logout } = useAuthModal()
const { bets, addBet } = useBets()
const { addBet: addToBetSlip } = useBetSlip()

if (!currentUser.value) router.push('/')

const activeTab = ref('overview')
const walletTab = ref('deposit')
const balVis = ref(true)
const betFilter = ref('All')
const txFilter = ref('All')
const selectedTicket = ref<PlacedBet | null>(null)
const showCashout = ref(false)

const tabs = [
  { id: 'overview',      icon: '🏠', label: 'Overview' },
  { id: 'wallet',        icon: '💰', label: 'Wallet' },
  { id: 'bets',          icon: '🎫', label: 'My Bets' },
  { id: 'transactions',  icon: '📋', label: 'Transactions' },
  { id: 'account',       icon: '👤', label: 'Account' },
  { id: 'settings',      icon: '⚙️', label: 'Settings' },
]

const avatarLetter = computed(() => currentUser.value?.name.charAt(0).toUpperCase() ?? '?')

const winRatePct = computed(() => {
  const settled = bets.value.filter(b => b.status !== 'pending')
  if (!settled.length) return 0
  return Math.round((bets.value.filter(b => b.status === 'won').length / settled.length) * 100)
})

// ── WALLET ──
const depositAmount = ref<number | null>(null)
const depositPhone = ref('')
const cardNumber = ref('')
const withdrawAmount = ref<number | null>(null)
const withdrawPhone = ref('')
const walletMsg = ref('')
const walletMsgType = ref('success')
const selectedPayment = ref('mtn')
const selectedWithdraw = ref('mtn')

const paymentMethods = [
  { id: 'mtn', name: 'MTN Money', icon: '📱' },
  { id: 'airtel', name: 'Airtel Money', icon: '📲' },
  { id: 'card', name: 'Card', icon: '💳' },
]

function handleDeposit() {
  if (!depositAmount.value || depositAmount.value < 1000) return
  addToBalance(depositAmount.value)
  walletMsg.value = `✅ UGX ${depositAmount.value.toLocaleString()} deposited successfully!`
  walletMsgType.value = 'success'
  transactions.unshift({ id: Date.now(), type: 'deposit', icon: '💰', name: 'Deposit via ' + paymentMethods.find(p=>p.id===selectedPayment.value)?.name, amount: depositAmount.value, positive: true, date: new Date() })
  depositAmount.value = null
  depositPhone.value = ''
  setTimeout(() => { walletMsg.value = '' }, 4000)
}

function handleWithdraw() {
  if (!withdrawAmount.value || withdrawAmount.value < 1000 || withdrawAmount.value > (currentUser.value?.balance ?? 0)) return
  addToBalance(-withdrawAmount.value)
  walletMsg.value = `✅ UGX ${withdrawAmount.value.toLocaleString()} withdrawal requested!`
  walletMsgType.value = 'success'
  transactions.unshift({ id: Date.now(), type: 'withdraw', icon: '💸', name: 'Withdrawal to ' + paymentMethods.find(p=>p.id===selectedWithdraw.value)?.name, amount: withdrawAmount.value, positive: false, date: new Date() })
  withdrawAmount.value = null
  withdrawPhone.value = ''
  setTimeout(() => { walletMsg.value = '' }, 4000)
}

// ── MY BETS ──
const betFilters = ['All', 'Pending', 'Won', 'Lost']

const filteredBets = computed(() => {
  if (betFilter.value === 'All') return bets.value
  return bets.value.filter(b => b.status === betFilter.value.toLowerCase())
})

function openTicket(b: PlacedBet) {
  selectedTicket.value = b
  showCashout.value = false
}

function shareTicket() {
  const text = `BetWin Ticket #${selectedTicket.value?.id} — Stake: UGX ${selectedTicket.value?.stake.toLocaleString()} | Potential Win: UGX ${selectedTicket.value?.potentialReturn.toLocaleString()}`
  if (navigator.share) {
    navigator.share({ title: 'BetWin Ticket', text })
  } else {
    navigator.clipboard?.writeText(text)
    alert('Ticket details copied to clipboard!')
  }
}

function reuseBet(bet: PlacedBet) {
  bet.selections.forEach(s => addToBetSlip(s))
  selectedTicket.value = null
  router.push('/')
}

function confirmCashout() {
  if (!selectedTicket.value) return
  const cashoutAmt = Math.round(selectedTicket.value.stake * 0.85)
  addToBalance(cashoutAmt)
  transactions.unshift({ id: Date.now(), type: 'cashout', icon: '💵', name: `Cashout Ticket #${selectedTicket.value.id}`, amount: cashoutAmt, positive: true, date: new Date() })
  selectedTicket.value.status = 'lost'
  showCashout.value = false
  selectedTicket.value = null
}

// ── TRANSACTIONS ──
interface Tx { id: number; type: string; icon: string; name: string; amount: number; positive: boolean; date: Date }
const transactions = reactive<Tx[]>([
  { id: 1, type: 'deposit', icon: '💰', name: 'Initial Deposit via MTN Money', amount: 250000, positive: true, date: new Date(Date.now() - 3 * 24 * 3600000) },
  { id: 2, type: 'bet', icon: '🎫', name: 'Bet Placed — Ticket #201', amount: 20000, positive: false, date: new Date(Date.now() - 48 * 3600000) },
  { id: 3, type: 'bet', icon: '🎫', name: 'Bet Placed — Ticket #287', amount: 10000, positive: false, date: new Date(Date.now() - 26 * 3600000) },
  { id: 4, type: 'win', icon: '🏆', name: 'Win Payout — Ticket #287', amount: 34500, positive: true, date: new Date(Date.now() - 24 * 3600000) },
  { id: 5, type: 'bet', icon: '🎫', name: 'Bet Placed — Ticket #332', amount: 5000, positive: false, date: new Date(Date.now() - 2 * 3600000) },
])

const txFilters = ['All', 'Deposits', 'Withdrawals', 'Bets']
const filteredTx = computed(() => {
  if (txFilter.value === 'All') return transactions
  if (txFilter.value === 'Deposits') return transactions.filter(t => t.type === 'deposit')
  if (txFilter.value === 'Withdrawals') return transactions.filter(t => t.type === 'withdraw')
  if (txFilter.value === 'Bets') return transactions.filter(t => t.type === 'bet' || t.type === 'win' || t.type === 'cashout')
  return transactions
})

// ── ACCOUNT ──
const accName = ref(currentUser.value?.name ?? '')
const accPhone = ref(currentUser.value?.phone ?? '')
const accEmail = ref('')
const accDob = ref('')
const accMsg = ref('')
const accMsg2 = ref('')

function saveAccount() {
  if (currentUser.value) currentUser.value.name = accName.value
  accMsg.value = '✅ Profile updated successfully!'
  setTimeout(() => { accMsg.value = '' }, 3000)
}

// ── SETTINGS ──
const notifications = reactive([
  { id: 'email', icon: '📧', label: 'Email Notifications', enabled: true },
  { id: 'sms', icon: '📱', label: 'SMS Notifications', enabled: true },
  { id: 'push', icon: '🔔', label: 'Push Notifications', enabled: false },
  { id: 'promo', icon: '🎁', label: 'Promotional Offers', enabled: true },
])
const oddsFormat = ref('Decimal')
const dailyLimit = ref<number | null>(null)

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat('en-UG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
}
</script>

<style scoped>
.profile-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f1120;
  overflow: hidden;
}
.profile-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── SIDEBAR ── */
.profile-sidebar {
  width: 220px;
  min-width: 220px;
  background: #141624;
  border-right: 1px solid #1e2235;
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  gap: 4px;
  overflow-y: auto;
}
.ps-user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  background: #1a1d2e;
  border-radius: 10px;
  margin-bottom: 8px;
}
.ps-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, #e84c6b, #a0284a);
  color: #fff; font-size: 18px; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ps-name { font-size: 12px; font-weight: 700; color: #e2e8f0; }
.ps-balance { font-size: 11px; color: #4ade80; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.ps-eye { background: none; border: none; color: #7a84a0; cursor: pointer; padding: 0; display: flex; }
.eye-svg { width: 12px; height: 12px; }
.ps-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.psnav-btn {
  display: flex; align-items: center; gap: 8px;
  background: none; border: none; border-radius: 8px;
  color: #7a84a0; font-size: 12px; font-weight: 600;
  padding: 9px 12px; cursor: pointer; text-align: left;
  transition: background 0.15s, color 0.15s;
}
.psnav-btn:hover { background: #1a1d2e; color: #c8cfe0; }
.psnav-btn.active { background: linear-gradient(90deg, rgba(232,76,107,0.15), transparent); color: #e84c6b; border-left: 3px solid #e84c6b; }
.psnav-icon { font-size: 14px; }
.ps-back-btn {
  background: none; border: 1px solid #2e3355; border-radius: 7px;
  color: #7a84a0; font-size: 11px; font-weight: 600; padding: 8px;
  cursor: pointer; margin-top: 8px; transition: all 0.15s;
}
.ps-back-btn:hover { border-color: #e84c6b; color: #e84c6b; }

/* ── MAIN CONTENT ── */
.profile-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: #0f1120;
}
.tab-section { max-width: 720px; margin: 0 auto; }
.section-title {
  font-size: 20px; font-weight: 900; color: #fff;
  margin-bottom: 18px; letter-spacing: -0.3px;
}
.section-subtitle {
  font-size: 13px; font-weight: 700; color: #7a84a0;
  margin: 20px 0 10px; letter-spacing: 0.3px; text-transform: uppercase;
}

/* ── OVERVIEW ── */
.overview-welcome {
  display: flex; align-items: center; gap: 14px;
  background: linear-gradient(135deg, #1a2040, #141624);
  border: 1px solid #252840; border-radius: 12px;
  padding: 16px; margin-bottom: 18px;
}
.ow-avatar {
  width: 52px; height: 52px; border-radius: 50%;
  background: linear-gradient(135deg, #e84c6b, #a0284a);
  color: #fff; font-size: 22px; font-weight: 900;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ow-name { font-size: 16px; font-weight: 800; color: #fff; }
.ow-since { font-size: 11px; color: #7a84a0; margin-top: 2px; }
.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px;
}
.stat-card {
  background: #141624; border: 1px solid #1e2235; border-radius: 10px;
  padding: 14px 12px; text-align: center;
}
.stat-card.won { border-color: rgba(74,222,128,0.2); background: linear-gradient(135deg, #0d2218, #141624); }
.stat-card.lost { border-color: rgba(232,76,107,0.2); background: linear-gradient(135deg, #2a0d15, #141624); }
.stat-card.pending { border-color: rgba(251,191,36,0.2); background: linear-gradient(135deg, #2a2010, #141624); }
.sc-val { font-size: 26px; font-weight: 900; color: #fff; }
.stat-card.won .sc-val { color: #4ade80; }
.stat-card.lost .sc-val { color: #e84c6b; }
.stat-card.pending .sc-val { color: #fbbf24; }
.sc-label { font-size: 10px; color: #5a6080; font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.3px; }
.ov-winrate {
  display: flex; align-items: center; gap: 10px;
  background: #141624; border: 1px solid #1e2235; border-radius: 10px;
  padding: 12px 14px; margin-bottom: 18px;
}
.wrl { font-size: 11px; color: #7a84a0; font-weight: 700; white-space: nowrap; }
.wr-bar-wrap { flex: 1; height: 6px; background: #1e2235; border-radius: 3px; overflow: hidden; }
.wr-bar { height: 100%; background: linear-gradient(90deg, #22c55e, #4ade80); border-radius: 3px; transition: width 0.5s ease; }
.wr-pct { font-size: 13px; font-weight: 800; color: #4ade80; white-space: nowrap; }
.recent-bets { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.rb-card {
  display: flex; align-items: center; justify-content: space-between;
  background: #141624; border: 1px solid #1e2235; border-radius: 8px;
  padding: 10px 14px; cursor: pointer; transition: border-color 0.15s;
}
.rb-card:hover { border-color: #e84c6b; }
.rb-id { font-size: 12px; font-weight: 700; color: #e2e8f0; }
.rb-meta { font-size: 10px; color: #5a6080; margin-top: 2px; }
.quick-actions { display: flex; gap: 10px; margin-top: 4px; }
.qa-btn {
  flex: 1; padding: 10px; border: none; border-radius: 8px;
  font-size: 12px; font-weight: 700; cursor: pointer; transition: opacity 0.15s;
}
.qa-btn:hover { opacity: 0.85; }
.qa-btn.deposit { background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; }
.qa-btn.withdraw { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: #fff; }
.qa-btn.bets { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; }

/* ── WALLET ── */
.wallet-balance-card {
  background: linear-gradient(135deg, #1a2d4a, #0d1a2e);
  border: 1px solid #1e3a5e; border-radius: 14px;
  padding: 20px; margin-bottom: 16px; text-align: center;
}
.wbc-label { font-size: 11px; color: #9ba3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.wbc-amount { font-size: 28px; font-weight: 900; color: #4ade80; margin: 8px 0; }
.wbc-actions { display: flex; gap: 8px; justify-content: center; margin-top: 14px; }
.wbc-tab-btn {
  padding: 7px 20px; border-radius: 6px; border: 1px solid #2e3a5e;
  background: none; color: #7a84a0; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.15s;
}
.wbc-tab-btn.active { background: #e84c6b; border-color: #e84c6b; color: #fff; }
.wallet-form-card {
  background: #141624; border: 1px solid #1e2235; border-radius: 12px; padding: 18px;
}
.wf-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 14px; }
.quick-amounts { display: flex; gap: 6px; margin: 8px 0 14px; flex-wrap: wrap; }
.qa-amount {
  padding: 5px 12px; background: #1e2235; border: 1px solid #2e3355;
  border-radius: 5px; color: #c8cfe0; font-size: 11px; font-weight: 700;
  cursor: pointer; transition: all 0.15s;
}
.qa-amount:hover { background: #e84c6b; border-color: #e84c6b; color: #fff; }
.payment-methods { display: flex; gap: 8px; flex-wrap: wrap; }
.pm-btn {
  flex: 1; min-width: 80px; display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 10px 8px; background: #1a1d2e; border: 1.5px solid #252840;
  border-radius: 8px; cursor: pointer; transition: all 0.15s;
}
.pm-btn.active { border-color: #e84c6b; background: rgba(232,76,107,0.08); }
.pm-icon { font-size: 20px; }
.pm-name { font-size: 9px; font-weight: 700; color: #9ba3b8; }
.pm-btn.active .pm-name { color: #e84c6b; }
.deposit-btn { background: linear-gradient(135deg, #16a34a, #22c55e) !important; }
.withdraw-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6) !important; }
.field-hint { font-size: 10px; color: #5a6080; margin-top: 4px; }
.wallet-msg {
  margin-top: 10px; padding: 9px 12px; border-radius: 7px;
  font-size: 12px; font-weight: 600;
}
.wallet-msg.success { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
.wallet-msg.error { background: rgba(232,76,107,0.1); color: #e84c6b; border: 1px solid rgba(232,76,107,0.2); }

/* ── MY BETS ── */
.bet-filters { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
.bf-btn {
  padding: 6px 14px; border-radius: 20px; border: 1px solid #2e3355;
  background: none; color: #7a84a0; font-size: 11px; font-weight: 700;
  cursor: pointer; transition: all 0.15s;
}
.bf-btn.active { background: #e84c6b; border-color: #e84c6b; color: #fff; }
.bets-list { display: flex; flex-direction: column; gap: 10px; }
.ticket-card {
  background: #141624; border: 1px solid #1e2235; border-radius: 12px;
  padding: 14px 16px; cursor: pointer; transition: border-color 0.15s, transform 0.1s;
  position: relative;
}
.ticket-card:hover { border-color: #e84c6b; transform: translateY(-1px); }
.tc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.tc-id { font-size: 13px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 6px; }
.ticket-icon { font-size: 14px; }
.tc-picks { font-size: 10px; color: #5a6080; margin-bottom: 6px; }
.tc-matches { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
.tc-match-pill {
  background: #1a1d2e; border: 1px solid #252840; border-radius: 4px;
  padding: 2px 7px; font-size: 9px; color: #9ba3b8;
}
.tc-match-more { font-size: 9px; color: #5a6080; padding: 2px 4px; }
.tc-bottom { display: flex; justify-content: space-between; }
.tc-stake, .tc-potential { display: flex; flex-direction: column; gap: 1px; }
.tc-lbl { font-size: 9px; color: #5a6080; text-transform: uppercase; letter-spacing: 0.3px; }
.tc-val { font-size: 12px; font-weight: 700; color: #e2e8f0; }
.tc-val.green { color: #4ade80; }
.tc-arrow { position: absolute; right: 16px; bottom: 14px; color: #3a4260; font-size: 20px; }
.empty-state { text-align: center; color: #5a6080; padding: 40px; font-size: 13px; }

/* ── STATUS BADGES ── */
.status-badge {
  padding: 3px 8px; border-radius: 20px; font-size: 9px; font-weight: 800;
  letter-spacing: 0.5px; text-transform: uppercase;
}
.status-badge.pending { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
.status-badge.won { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
.status-badge.lost { background: rgba(232,76,107,0.15); color: #e84c6b; border: 1px solid rgba(232,76,107,0.3); }
.status-badge.lg { font-size: 11px; padding: 4px 12px; }

/* ── TRANSACTIONS ── */
.tx-list { display: flex; flex-direction: column; gap: 2px; }
.tx-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 8px;
  transition: background 0.12s;
}
.tx-row:hover { background: #141624; }
.tx-icon-wrap { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; background: #1a1d2e; }
.tx-body { flex: 1; }
.tx-name { font-size: 12px; font-weight: 600; color: #c8cfe0; }
.tx-date { font-size: 10px; color: #5a6080; margin-top: 2px; }
.tx-amount { font-size: 13px; font-weight: 800; }
.tx-amount.positive { color: #4ade80; }
.tx-amount.negative { color: #e84c6b; }

/* ── ACCOUNT ── */
.account-avatar-row {
  display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
}
.acc-avatar {
  width: 60px; height: 60px; border-radius: 50%;
  background: linear-gradient(135deg, #e84c6b, #a0284a);
  color: #fff; font-size: 26px; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
}
.acc-name-big { font-size: 18px; font-weight: 800; color: #fff; }
.acc-member { font-size: 11px; color: #5a6080; margin-top: 3px; }
.form-card {
  background: #141624; border: 1px solid #1e2235; border-radius: 12px; padding: 18px;
}
.form-card-title { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 14px; }

/* ── SETTINGS ── */
.setting-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; border-bottom: 1px solid #1a1d2e;
}
.setting-row:last-child { border-bottom: none; }
.sr-label { font-size: 12px; color: #c8cfe0; font-weight: 600; }
.toggle-btn {
  width: 38px; height: 20px; border-radius: 10px; border: none;
  background: #252840; cursor: pointer; position: relative; transition: background 0.2s;
}
.toggle-btn.on { background: #22c55e; }
.toggle-knob {
  position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
  background: #fff; border-radius: 50%; transition: transform 0.2s;
}
.toggle-btn.on .toggle-knob { transform: translateX(18px); }
.seg-control { display: flex; gap: 2px; background: #1a1d2e; border-radius: 6px; padding: 2px; }
.seg-btn {
  padding: 4px 10px; border: none; border-radius: 4px; background: none;
  color: #7a84a0; font-size: 10px; font-weight: 700; cursor: pointer; transition: all 0.15s;
}
.seg-btn.active { background: #252840; color: #fff; }
.rg-warning {
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(232,76,107,0.07); border: 1px solid rgba(232,76,107,0.15);
  border-radius: 8px; padding: 12px; margin-top: 12px;
  font-size: 20px;
}
.rg-w-title { font-size: 12px; font-weight: 700; color: #e84c6b; }
.rg-w-sub { font-size: 11px; color: #7a84a0; margin-top: 3px; }

/* ── SHARED FORM ── */
.form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.form-group label { font-size: 10px; font-weight: 600; color: #8a94b0; letter-spacing: 0.3px; }
.pf-input {
  background: linear-gradient(135deg, #181b2c, #1e2238);
  border: 1.5px solid #2a3050; border-radius: 9px; color: #e2e8f0;
  padding: 10px 13px; font-size: 13px; outline: none; width: 100%;
  box-sizing: border-box; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.pf-input:focus {
  border-color: #e84c6b;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.15), 0 0 0 2px rgba(232,76,107,0.12);
}
.pf-submit {
  background: linear-gradient(135deg, #e84c6b, #c93559); border: none; color: #fff;
  font-size: 13px; font-weight: 800; padding: 12px; border-radius: 9px;
  cursor: pointer; letter-spacing: 0.5px; width: 100%; transition: opacity 0.15s;
}
.pf-submit:hover { opacity: 0.9; }
.pf-submit:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── TICKET MODAL ── */
.ticket-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.78);
  z-index: 9000; display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px); padding: 16px;
}
.ticket-modal {
  background: #141624; border: 1px solid #2e3355; border-radius: 16px;
  width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}
.tm-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 18px 18px 14px; border-bottom: 1px solid #1e2235;
}
.tm-id { font-size: 16px; font-weight: 900; color: #fff; }
.tm-date { font-size: 10px; color: #5a6080; margin-top: 3px; }
.tm-header-right { display: flex; align-items: center; gap: 10px; }
.tm-close {
  background: #252840; border: none; color: #9ba3b8;
  width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
  font-size: 12px; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.tm-close:hover { background: #e84c6b; color: #fff; }
.tm-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 16px; }
.tm-section-title { font-size: 10px; font-weight: 700; color: #5a6080; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.tm-selections { display: flex; flex-direction: column; gap: 8px; }
.tms-row {
  display: flex; align-items: center; gap: 10px;
  background: #1a1d2e; border: 1px solid #252840; border-radius: 8px; padding: 10px 12px;
}
.tms-match { flex: 1; }
.tms-match-name { font-size: 12px; font-weight: 700; color: #e2e8f0; }
.tms-market { font-size: 9px; color: #5a6080; margin-top: 2px; }
.tms-right { text-align: right; }
.tms-label { font-size: 10px; color: #9ba3b8; }
.tms-odds { font-size: 14px; font-weight: 900; color: #e84c6b; }
.tms-status { display: flex; flex-direction: column; align-items: center; gap: 3px; flex-shrink: 0; }
.sel-status-dot { width: 8px; height: 8px; border-radius: 50%; }
.sel-status-dot.pending { background: #fbbf24; }
.sel-status-dot.won { background: #4ade80; }
.sel-status-dot.lost { background: #e84c6b; }
.sel-status-txt { font-size: 8px; font-weight: 700; letter-spacing: 0.3px; }
.sel-status-txt.pending { color: #fbbf24; }
.sel-status-txt.won { color: #4ade80; }
.sel-status-txt.lost { color: #e84c6b; }
.tm-financials {
  background: #1a1d2e; border: 1px solid #252840; border-radius: 10px; padding: 12px 14px;
  display: flex; flex-direction: column; gap: 7px;
}
.tmf-row { display: flex; justify-content: space-between; font-size: 12px; color: #7a84a0; }
.tmf-row.bonus { color: #4ade80; }
.tmf-row.total { font-weight: 700; color: #c8cfe0; font-size: 13px; padding-top: 7px; border-top: 1px solid #252840; }
.tmf-odds { font-weight: 800; color: #e84c6b; }
.green { color: #4ade80; }
.big { font-size: 15px; font-weight: 900; }
.tm-actions { display: flex; gap: 8px; }
.tma-btn {
  flex: 1; padding: 10px 6px; border: none; border-radius: 8px;
  font-size: 11px; font-weight: 700; cursor: pointer; transition: opacity 0.15s;
}
.tma-btn.cashout { background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; }
.tma-btn.share { background: #1e2235; color: #9ba3b8; border: 1px solid #2e3355; }
.tma-btn.reuse { background: linear-gradient(135deg, #5b21b6, #7c3aed); color: #fff; }
.tma-btn:hover { opacity: 0.85; }
.cashout-panel {
  background: linear-gradient(135deg, #0d2218, #12291e);
  border: 1px solid #2a5a3a; border-radius: 10px; padding: 14px 16px; text-align: center;
}
.cp-title { font-size: 11px; color: #6dbf90; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.cp-amount { font-size: 24px; font-weight: 900; color: #4ade80; margin: 6px 0; }
.cp-note { font-size: 11px; color: #5a8070; margin-bottom: 12px; }
.cp-confirm {
  background: linear-gradient(135deg, #16a34a, #22c55e); border: none; color: #fff;
  padding: 10px 24px; border-radius: 8px; font-size: 12px; font-weight: 800;
  cursor: pointer; transition: opacity 0.15s;
}
.cp-confirm:hover { opacity: 0.85; }

/* ── TRANSITIONS ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.96); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
