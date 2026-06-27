<template>
  <aside class="right-sidebar">
    <!-- Bet Slip header -->
    <div class="betslip-header">
      <div class="betslip-title-row">
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/bet-3d-icon-png-download-14793184.png" class="betslip-icon" alt="bet slip" />
        <span class="betslip-title">BET SLIP</span>
      </div>
      <div class="betslip-tabs">
        <button
          v-for="tab in slipTabs"
          :key="tab"
          class="slip-tab"
          :class="{ active: activeSlipTab === tab }"
          @click="handleTabClick(tab)"
        >{{ tab }}</button>
      </div>
    </div>

    <!-- Selections count row -->
    <div class="selections-row">
      <span class="selections-label">SELECTIONS ({{ slipItems.length }})</span>
      <button class="clear-all-btn" v-if="slipItems.length" @click="clearAll()">✕ Clear</button>
    </div>

    <!-- ── EMPTY STATE ── -->
    <div v-if="slipItems.length === 0" class="slip-empty">
      <img src="https://cdn3d.iconscout.com/3d/premium/thumb/bet-3d-icon-png-download-14793184.png" class="slip-empty-img" alt="bet slip" loading="eager" fetchpriority="high" />
      <div class="slip-empty-text">No selections yet.<br>Click odds to add them here.</div>
    </div>

    <!-- ── SINGLE TAB ── 1 selection shown -->
    <template v-else-if="activeSlipTab === 'SINGLE'">
      <div v-if="slipItems.length > 1" class="single-warning">
        ⚠ Single bets play 1 match at a time. Showing last selection.
      </div>
      <div class="selections-list">
        <div class="selection-item">
          <div class="sel-header">
            <span class="sel-name">{{ singleItem.label }}</span>
            <div class="sel-right">
              <span class="sel-odds">{{ singleItem.odds }}</span>
              <button class="sel-close" @click="removeBet(singleItem.key)">✕</button>
            </div>
          </div>
          <div class="sel-match">{{ singleItem.market }}</div>
          <div class="sel-meta">{{ singleItem.matchName }}</div>
          <div class="sel-row">
            <span class="sel-status">Match Odds</span>
            <div class="sel-returns">
              <span class="ret-label">Potential</span>
              <span class="ret-value">{{ singlePotential }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Recommendation: encourage multi -->
      <div v-if="slipItems.length >= 1" class="bonus-tip single-tip">
        🎯 Add {{ 2 - slipItems.length > 0 ? 2 - slipItems.length + ' more selection' : '1 more selection' }} to unlock <strong>3% Multi Bonus!</strong>
      </div>
      <div class="stake-section">
        <div class="stake-row">
          <span class="stake-label">STAKE (UGX)</span>
          <input type="number" class="stake-input" v-model.number="stake" placeholder="0" min="0" />
        </div>
        <div class="quick-stakes">
          <button v-for="(q, i) in QUICK_STAKES" :key="q" class="qs-btn" :style="{ '--qs-color': QUICK_STAKE_COLORS[i] }" @click="stake = q">{{ q >= 1000 ? (q/1000) + 'K' : q }}</button>
        </div>
        <div class="stake-totals">
          <div class="total-row"><span>Total stake</span><span>{{ fmtMoney(stake) }}</span></div>
          <div class="total-row potential"><span>Potential Returns:</span><span class="potential-val">{{ singlePotential }}</span></div>
        </div>
        <button v-if="!currentUser" class="login-bet-btn" @click="openLogin">LOGIN TO BET</button>
        <button v-else class="place-bet-btn" @click="placeBet">PLACE BET</button>
      </div>
    </template>

    <!-- ── MULTI TAB ── accumulator of all selections -->
    <template v-else-if="activeSlipTab === 'MULTI'">
      <div v-if="slipItems.length < 2" class="single-warning">
        ⚠ Add at least 2 selections for a Multi (accumulator) bet.
      </div>
      <div class="selections-list">
        <div v-for="sel in slipItems" :key="sel.key" class="selection-item">
          <div class="sel-header">
            <span class="sel-name">{{ sel.label }}</span>
            <div class="sel-right">
              <span class="sel-odds">{{ sel.odds }}</span>
              <button class="sel-close" @click="removeBet(sel.key)">✕</button>
            </div>
          </div>
          <div class="sel-match">{{ sel.market }}</div>
          <div class="sel-meta">{{ sel.matchName }}</div>
        </div>
      </div>

      <!-- Bonus badge -->
      <div v-if="slipItems.length >= 2" class="bonus-badge">
        <span class="bonus-icon">🎁</span>
        <div class="bonus-info">
          <span class="bonus-label">ACCUMULATOR BONUS</span>
          <span class="bonus-pct">+{{ currentBonus }}%</span>
        </div>
        <div class="bonus-bar-wrap">
          <div class="bonus-bar" :style="{ width: bonusBarPct + '%' }"></div>
        </div>
      </div>

      <!-- Recommendation tip -->
      <div v-if="nextBonusTip" class="bonus-tip">
        {{ nextBonusTip.icon }} Add <strong>{{ nextBonusTip.add }} more</strong> selection{{ nextBonusTip.add > 1 ? 's' : '' }} to boost bonus <strong>{{ currentBonus }}% → {{ nextBonusTip.nextPct }}%</strong>
      </div>
      <div v-else-if="slipItems.length >= 2" class="bonus-tip bonus-max">
        🏆 Max 500% bonus unlocked!
      </div>

      <div v-if="slipItems.length >= 2" class="total-odds-row">
        <span class="to-label">Combined Odds</span>
        <span class="to-val">{{ totalOdds }}</span>
      </div>
      <div class="stake-section">
        <div class="stake-row">
          <span class="stake-label">STAKE (UGX)</span>
          <input type="number" class="stake-input" v-model.number="stake" placeholder="0" min="0" />
        </div>
        <div class="quick-stakes">
          <button v-for="(q, i) in QUICK_STAKES" :key="q" class="qs-btn" :style="{ '--qs-color': QUICK_STAKE_COLORS[i] }" @click="stake = q">{{ q >= 1000 ? (q/1000) + 'K' : q }}</button>
        </div>
        <div class="stake-totals">
          <div class="total-row"><span>Total stake</span><span>{{ fmtMoney(stake) }}</span></div>
          <div v-if="slipItems.length >= 2 && currentBonus > 0" class="total-row">
            <span>Base Returns</span><span>{{ multiBaseReturn }}</span>
          </div>
          <div v-if="slipItems.length >= 2 && currentBonus > 0" class="total-row bonus-row">
            <span>Bonus (+{{ currentBonus }}%)</span><span class="bonus-amount">+{{ multiBonusAmount }}</span>
          </div>
          <div class="total-row potential"><span>Potential Returns:</span><span class="potential-val">{{ multiPotential }}</span></div>
        </div>
        <button v-if="!currentUser" class="login-bet-btn" @click="openLogin">LOGIN TO BET</button>
        <button v-else class="place-bet-btn" @click="placeBet">PLACE BET</button>
      </div>
    </template>

    <!-- ── SYSTEM TAB ── system/combination bets -->
    <template v-else-if="activeSlipTab === 'SYSTEM'">
      <div v-if="slipItems.length < 3" class="single-warning">
        ⚠ System bets need at least 3 selections. Add more matches.
      </div>
      <div class="selections-list">
        <div v-for="sel in slipItems" :key="sel.key" class="selection-item">
          <div class="sel-header">
            <span class="sel-name">{{ sel.label }}</span>
            <div class="sel-right">
              <span class="sel-odds">{{ sel.odds }}</span>
              <button class="sel-close" @click="removeBet(sel.key)">✕</button>
            </div>
          </div>
          <div class="sel-match">{{ sel.market }}</div>
          <div class="sel-meta">{{ sel.matchName }}</div>
        </div>
      </div>
      <div v-if="slipItems.length >= 3" class="system-options">
        <div class="system-title">SELECT SYSTEM TYPE</div>
        <label v-for="opt in systemOptions" :key="opt.label" class="system-option">
          <input type="radio" v-model="selectedSystem" :value="opt.label" />
          <div class="sopt-body">
            <span class="sopt-label">{{ opt.label }}</span>
            <span class="sopt-desc">{{ opt.desc }}</span>
            <span class="sopt-bets">{{ opt.bets }} bets</span>
          </div>
        </label>
      </div>
      <div class="stake-section">
        <div class="stake-row">
          <span class="stake-label">STAKE PER BET (UGX)</span>
          <input type="number" class="stake-input" v-model.number="stake" placeholder="0" min="0" />
        </div>
        <div class="quick-stakes">
          <button v-for="(q, i) in QUICK_STAKES" :key="q" class="qs-btn" :style="{ '--qs-color': QUICK_STAKE_COLORS[i] }" @click="stake = q">{{ q >= 1000 ? (q/1000) + 'K' : q }}</button>
        </div>
        <div class="stake-totals">
          <div class="total-row"><span>Total stake</span><span>{{ fmtMoney(systemTotalStake) }}</span></div>
          <div class="total-row potential"><span>Min Returns:</span><span class="potential-val">{{ systemMinReturn }}</span></div>
          <div class="total-row potential"><span>Max Returns:</span><span class="potential-val">{{ systemMaxReturn }}</span></div>
        </div>
        <button v-if="!currentUser" class="login-bet-btn" @click="openLogin">LOGIN TO BET</button>
        <button v-else class="place-bet-btn" @click="placeBet">PLACE BET</button>
      </div>
    </template>

    <!-- ── BET SUCCESS TOAST ── -->
    <transition name="toast-slide">
      <div v-if="betSuccess" class="bet-success-toast">
        <div class="bst-icon">✅</div>
        <div class="bst-body">
          <div class="bst-title">Bet Placed!</div>
          <div class="bst-id">Bet ID: <strong>#{{ betId }}</strong></div>
        </div>
        <button class="bst-close" @click="betSuccess = false">✕</button>
      </div>
    </transition>

    <!-- Promo banner -->
    <div class="promo-banner">
      <div class="promo-bg">
        <div class="promo-text">
          <span class="promo-on">ON</span><span class="promo-win">WIN</span>
        </div>
        <div class="promo-sub">FIRST BET<br><strong>BONUS</strong></div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBetSlip } from '@/composables/useBetSlip'
import { useAuthModal } from '@/composables/useAuthModal'



const slipTabs = ['SINGLE', 'MULTI', 'SYSTEM']
const activeSlipTab = ref('SINGLE')
const stake = ref<number | null>(1000)
const QUICK_STAKES = [5000, 10000, 20000, 50000]
const selectedSystem = ref('2/3')

const { slipItems, removeBet, clearAll, totalOdds } = useBetSlip()
const { openLogin, currentUser, addToBalance } = useAuthModal()

const QUICK_STAKE_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#e84c6b']

const betSuccess = ref(false)
const betId = ref('')
let betTimer: ReturnType<typeof setTimeout> | null = null

function placeBet() {
  if (!currentUser.value || !stake.value || stake.value <= 0) return
  if (stake.value > currentUser.value.balance) {
    // Not enough balance — could show error, for now just ignore
    return
  }
  addToBalance(-stake.value)
  betId.value = String(Math.floor(100000 + Math.random() * 900000))
  betSuccess.value = true
  clearAll()
  if (betTimer) clearTimeout(betTimer)
  betTimer = setTimeout(() => { betSuccess.value = false }, 4000)
}

// Auto-switch tab based on selection count
watch(() => slipItems.value.length, (n) => {
  if (activeSlipTab.value === 'SYSTEM') return
  if (n <= 1) activeSlipTab.value = 'SINGLE'
  else activeSlipTab.value = 'MULTI'
})

function handleTabClick(tab: string) {
  activeSlipTab.value = tab
}

// SINGLE: use the last added selection
const singleItem = computed(() => slipItems.value[slipItems.value.length - 1] ?? { key: '', label: '', odds: '0', matchName: '', market: '' })

function fmtMoney(v: number | null) {
  if (!v || v <= 0) return 'UGX 0'
  return `UGX ${Math.round(v).toLocaleString()}`
}

// ── BONUS TABLE ──
// Bonus percentage per number of selections (Multi/accumulator only)
const BONUS_TABLE: { min: number; pct: number }[] = [
  { min: 2,  pct: 3   },
  { min: 3,  pct: 5   },
  { min: 4,  pct: 8   },
  { min: 5,  pct: 12  },
  { min: 6,  pct: 17  },
  { min: 7,  pct: 25  },
  { min: 8,  pct: 35  },
  { min: 9,  pct: 50  },
  { min: 10, pct: 75  },
  { min: 11, pct: 100 },
  { min: 12, pct: 150 },
  { min: 13, pct: 200 },
  { min: 14, pct: 300 },
  { min: 15, pct: 400 },
  { min: 16, pct: 500 },
]

function getBonusForCount(n: number): number {
  let bonus = 0
  for (const tier of BONUS_TABLE) {
    if (n >= tier.min) bonus = tier.pct
  }
  return bonus
}

const currentBonus = computed(() => getBonusForCount(slipItems.value.length))

// Progress bar: how far we are toward max 500%
const bonusBarPct = computed(() => Math.min((currentBonus.value / 500) * 100, 100))

// ── RECOMMENDATION ──
// Find the next bonus milestone and how many more picks to add
const nextBonusTip = computed(() => {
  const n = slipItems.value.length
  if (n < 2) return null
  // Find the next tier above current
  const nextTier = BONUS_TABLE.find(t => t.min > n)
  if (!nextTier) return null // already at max
  return {
    add: nextTier.min - n,
    nextPct: nextTier.pct,
    icon: nextTier.pct >= 100 ? '🚀' : nextTier.pct >= 50 ? '⚡' : '💡',
  }
})

// ── POTENTIALS ──
const singlePotential = computed(() => {
  if (!stake.value || stake.value <= 0 || !singleItem.value.odds) return 'UGX 0'
  return fmtMoney(stake.value * parseFloat(singleItem.value.odds))
})

const multiBaseReturn = computed(() => {
  if (!stake.value || stake.value <= 0) return 'UGX 0'
  return fmtMoney(stake.value * parseFloat(totalOdds.value))
})

const multiBonusAmount = computed(() => {
  if (!stake.value || stake.value <= 0) return 'UGX 0'
  const base = stake.value * parseFloat(totalOdds.value)
  return fmtMoney(base * (currentBonus.value / 100))
})

const multiPotential = computed(() => {
  if (!stake.value || stake.value <= 0) return 'UGX 0'
  const base = stake.value * parseFloat(totalOdds.value)
  const withBonus = base + base * (currentBonus.value / 100)
  return fmtMoney(withBonus)
})

// SYSTEM options based on number of selections
const systemOptions = computed(() => {
  const n = slipItems.value.length
  const opts = []
  for (let k = 2; k < n; k++) {
    const bets = combinations(n, k)
    opts.push({ label: `${k}/${n}`, desc: `Any ${k} from ${n}`, bets })
  }
  opts.push({ label: `${n}/${n}`, desc: `All ${n} selections (accumulator)`, bets: 1 })
  return opts
})

function combinations(n: number, k: number): number {
  if (k === 0 || k === n) return 1
  return combinations(n - 1, k - 1) + combinations(n - 1, k)
}

const currentSystemOpt = computed(() => systemOptions.value.find(o => o.label === selectedSystem.value) ?? systemOptions.value[0])

const systemTotalStake = computed(() => {
  if (!stake.value || stake.value <= 0) return 0
  return stake.value * (currentSystemOpt.value?.bets ?? 1)
})

const systemMinReturn = computed(() => {
  if (!stake.value || stake.value <= 0) return 'UGX 0'
  const minOdds = slipItems.value.map(s => parseFloat(s.odds)).sort((a, b) => a - b)
  const k = parseInt(selectedSystem.value.split('/')[0]) || 2
  const lowestK = minOdds.slice(0, k).reduce((a, b) => a * b, 1)
  return fmtMoney(stake.value * lowestK)
})

const systemMaxReturn = computed(() => {
  if (!stake.value || stake.value <= 0) return 'UGX 0'
  const allOdds = slipItems.value.map(s => parseFloat(s.odds)).sort((a, b) => b - a)
  const k = parseInt(selectedSystem.value.split('/')[0]) || 2
  const highestK = allOdds.slice(0, k).reduce((a, b) => a * b, 1)
  const bets = currentSystemOpt.value?.bets ?? 1
  return fmtMoney(stake.value * highestK * bets)
})
</script>

<style scoped>
.right-sidebar {
  width: 220px;
  min-width: 220px;
  background: #1a1d2e;
  border-left: 1px solid #252840;
  overflow-y: auto;
  flex-shrink: 0;
  font-size: 11px;
  display: flex;
  flex-direction: column;
}
.betslip-header {
  background: #141624;
  padding: 8px 8px 0;
  border-bottom: 1px solid #252840;
}
.betslip-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.betslip-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
  flex-shrink: 0;
}
.betslip-title {
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}
.betslip-tabs {
  display: flex;
  gap: 2px;
}
.slip-tab {
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #7a84a0;
  font-size: 9px;
  font-weight: 700;
  padding: 5px 2px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  letter-spacing: 0.3px;
}
.slip-tab.active { color: #fff; border-bottom-color: #e84c6b; }
.slip-tab:hover:not(.active) { color: #c8cfe0; }

.selections-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: #12141f;
  border-bottom: 1px solid #1e2235;
}
.selections-label { color: #7a84a0; font-size: 9px; font-weight: 700; letter-spacing: 0.3px; }
.clear-all-btn {
  background: none; border: none; color: #e84c6b;
  font-size: 9px; cursor: pointer; font-weight: 600;
  padding: 2px 4px; border-radius: 3px;
  transition: background 0.12s;
}
.clear-all-btn:hover { background: rgba(232,76,107,0.12); }

/* Empty state */
.slip-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  gap: 8px;
}
.slip-empty-img { width: 52px; height: 52px; object-fit: contain; }
.slip-empty-text { font-size: 10px; color: #5a6080; text-align: center; line-height: 1.5; }

/* Warning */
.single-warning {
  font-size: 9px;
  color: #e8a84c;
  background: rgba(232, 168, 76, 0.08);
  border-left: 2px solid #e8a84c;
  padding: 5px 8px;
  margin: 4px 6px;
  border-radius: 0 4px 4px 0;
  line-height: 1.4;
}

/* Selection items */
.selections-list { display: flex; flex-direction: column; gap: 4px; padding: 6px 6px 0; }
.selection-item {
  background: #12141f;
  border: 1px solid #1e2235;
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.sel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 4px; }
.sel-name { font-size: 11px; font-weight: 700; color: #e2e8f0; flex: 1; line-height: 1.3; }
.sel-right { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.sel-odds { font-size: 13px; font-weight: 900; color: #e84c6b; }
.sel-close {
  background: none; border: none; color: #5a6a88;
  font-size: 11px; cursor: pointer; padding: 0 2px;
  transition: color 0.12s; line-height: 1;
}
.sel-close:hover { color: #e84c6b; }
.sel-match { font-size: 9px; color: #7a84a0; }
.sel-meta { font-size: 9px; color: #5a6080; line-height: 1.3; }
.sel-row { display: flex; justify-content: space-between; align-items: center; margin-top: 2px; }
.sel-status { font-size: 9px; color: #5a6080; }
.sel-returns { display: flex; gap: 4px; align-items: center; }
.ret-label { font-size: 9px; color: #5a6080; }
.ret-value { font-size: 10px; font-weight: 700; color: #e2e8f0; }

/* ── BONUS BADGE ── */
.bonus-badge {
  margin: 6px 6px 0;
  background: linear-gradient(135deg, #1a3a1a 0%, #0d2a1a 100%);
  border: 1px solid #2a5a2a;
  border-radius: 6px;
  padding: 7px 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bonus-icon { font-size: 14px; }
.bonus-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bonus-label {
  font-size: 8px;
  font-weight: 700;
  color: #6dbf6d;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.bonus-pct {
  font-size: 16px;
  font-weight: 900;
  color: #4ade80;
  line-height: 1;
}
.bonus-bar-wrap {
  height: 3px;
  background: #1e3a1e;
  border-radius: 2px;
  overflow: hidden;
}
.bonus-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 2px;
  transition: width 0.4s ease;
}

/* ── RECOMMENDATION TIP ── */
.bonus-tip {
  margin: 5px 6px 0;
  background: rgba(234, 179, 8, 0.08);
  border: 1px solid rgba(234, 179, 8, 0.25);
  border-left: 3px solid #eab308;
  border-radius: 0 5px 5px 0;
  padding: 5px 7px;
  font-size: 9px;
  color: #d4a80a;
  line-height: 1.45;
}
.bonus-tip strong { color: #fbbf24; }
.bonus-tip.single-tip {
  border-left-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.25);
  border-left-color: #3b82f6;
  color: #93c5fd;
}
.bonus-tip.single-tip strong { color: #60a5fa; }
.bonus-tip.bonus-max {
  border-left-color: #a855f7;
  background: rgba(168, 85, 247, 0.08);
  border-color: rgba(168, 85, 247, 0.25);
  color: #c084fc;
}

/* Total odds row */
.total-odds-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 6px 8px; margin: 4px 6px 0;
  background: #12141f; border-radius: 6px; border: 1px solid #1e2235;
}
.to-label { font-size: 9px; color: #7a84a0; font-weight: 600; }
.to-val { font-size: 14px; font-weight: 900; color: #e84c6b; }

/* System options */
.system-options { padding: 6px; display: flex; flex-direction: column; gap: 4px; }
.system-title { font-size: 8px; font-weight: 700; color: #5a6080; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 2px; }
.system-option { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.system-option input[type="radio"] { accent-color: #e84c6b; flex-shrink: 0; }
.sopt-body { display: flex; align-items: center; gap: 6px; background: #12141f; border: 1px solid #1e2235; border-radius: 5px; padding: 5px 7px; flex: 1; }
.system-option:has(input:checked) .sopt-body { border-color: #e84c6b; }
.sopt-label { font-size: 11px; font-weight: 800; color: #e2e8f0; min-width: 28px; }
.sopt-desc { font-size: 9px; color: #7a84a0; flex: 1; }
.sopt-bets { font-size: 9px; color: #5a6080; white-space: nowrap; }

/* Stake section */
.stake-section { padding: 8px 6px; display: flex; flex-direction: column; gap: 6px; border-top: 1px solid #1e2235; margin-top: 6px; }
.stake-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.stake-label { font-size: 9px; font-weight: 700; color: #7a84a0; letter-spacing: 0.3px; white-space: nowrap; }
.stake-input {
  background: linear-gradient(135deg, #181b2c 0%, #1c2036 100%);
  border: 1.5px solid #252a42;
  border-radius: 7px;
  color: #c8cfe0;
  padding: 6px 8px;
  font-size: 11px;
  width: 80px;
  outline: none;
  text-align: right;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.stake-input::placeholder { color: #3a4260; }
.stake-input:focus {
  border-color: #e84c6b;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.15), 0 0 0 2px rgba(232,76,107,0.15);
}
.quick-stakes {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.qs-btn {
  flex: 1;
  min-width: 0;
  background: color-mix(in srgb, var(--qs-color) 15%, #12141f);
  border: 1px solid color-mix(in srgb, var(--qs-color) 40%, transparent);
  border-radius: 5px;
  color: var(--qs-color);
  font-size: 9px;
  font-weight: 800;
  padding: 4px 2px;
  cursor: pointer;
  text-align: center;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;
  letter-spacing: 0.2px;
}
.qs-btn:hover {
  background: color-mix(in srgb, var(--qs-color) 30%, #12141f);
  transform: translateY(-1px);
}
.qs-btn:active { transform: translateY(0); }
.stake-totals { display: flex; flex-direction: column; gap: 3px; }
.total-row {
  display: flex; justify-content: space-between;
  font-size: 10px; color: #7a84a0;
}
.total-row.potential { color: #c8cfe0; font-weight: 600; }
.potential-val { color: #4ade80; font-weight: 800; }
.total-row.bonus-row { color: #4ade80; }
.bonus-amount { font-weight: 700; color: #4ade80; }
.stake-notice { font-size: 9px; color: #5a6080; text-align: center; }
.login-bet-btn {
  background: #e84c6b; border: none; color: #fff;
  font-size: 10px; font-weight: 800; padding: 9px;
  border-radius: 6px; cursor: pointer; letter-spacing: 0.5px;
  transition: background 0.15s; width: 100%;
}
.login-bet-btn:hover { background: #c93559; }
.place-bet-btn {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 9px;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: opacity 0.15s, transform 0.1s;
  width: 100%;
  box-shadow: 0 2px 10px rgba(34,197,94,0.25);
}
.place-bet-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.place-bet-btn:active { transform: translateY(0); }

/* ── BET SUCCESS TOAST ── */
.bet-success-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #14281a 0%, #1a3322 100%);
  border: 1px solid #2a6040;
  border-left: 4px solid #22c55e;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.1);
  min-width: 200px;
  max-width: 260px;
}
.bst-icon { font-size: 20px; flex-shrink: 0; }
.bst-body { flex: 1; }
.bst-title {
  font-size: 12px;
  font-weight: 800;
  color: #4ade80;
  letter-spacing: 0.3px;
}
.bst-id {
  font-size: 10px;
  color: #6dbf90;
  margin-top: 2px;
}
.bst-id strong { color: #a3e8c0; font-weight: 700; }
.bst-close {
  background: none;
  border: none;
  color: #4a7060;
  font-size: 11px;
  cursor: pointer;
  padding: 0 2px;
  flex-shrink: 0;
  transition: color 0.15s;
}
.bst-close:hover { color: #4ade80; }
.toast-slide-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-leave-active { transition: all 0.2s ease-in; }
.toast-slide-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.toast-slide-leave-to { opacity: 0; transform: translateY(8px); }

/* Promo banner */
.promo-banner { margin-top: auto; padding: 8px 6px 6px; }
.promo-bg {
  background: linear-gradient(135deg, #1a4d8f 0%, #0d2d5e 100%);
  border-radius: 8px; padding: 10px 12px;
  display: flex; justify-content: space-between; align-items: center;
}
.promo-text { font-size: 22px; font-weight: 900; letter-spacing: -1px; }
.promo-on { color: #fff; }
.promo-win { color: #e84c6b; }
.promo-sub { font-size: 9px; color: #9ba3b8; text-align: right; line-height: 1.4; }
.promo-sub strong { color: #fff; font-size: 11px; }
</style>
