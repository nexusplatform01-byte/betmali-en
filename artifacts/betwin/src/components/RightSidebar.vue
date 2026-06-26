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
          @click="activeSlipTab = tab"
        >{{ tab }}</button>
      </div>
    </div>

    <!-- Selections count -->
    <div class="selections-row">
      <span class="selections-label">SELECTIONS ({{ slipItems.length }})</span>
      <button class="clear-all-btn" v-if="slipItems.length" @click="clearAll()">✕ Clear</button>
    </div>

    <!-- Selection items -->
    <div class="selections-list">
      <div v-if="slipItems.length === 0" class="slip-empty">
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/bet-3d-icon-png-download-14793184.png" class="slip-empty-img" alt="bet slip" loading="eager" fetchpriority="high" />
        <div class="slip-empty-text">No selections yet.<br>Click odds to add them here.</div>
      </div>
      <div v-for="sel in slipItems" :key="sel.key" class="selection-item">
        <div class="sel-header">
          <div class="sel-team">
            <span class="sel-name">{{ sel.label }}</span>
          </div>
          <div class="sel-right">
            <span class="sel-odds">{{ sel.odds }}</span>
            <button class="sel-close" @click="removeBet(sel.key)">✕</button>
          </div>
        </div>
        <div class="sel-match">
          <span class="sel-result">{{ sel.market }}</span>
        </div>
        <div class="sel-meta">{{ sel.matchName }}</div>
        <div class="sel-row">
          <span class="sel-status">Match Odds</span>
          <div class="sel-returns">
            <span class="ret-label">Potential</span>
            <span class="ret-value">$ 0.00</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Total odds row when there are selections -->
    <div v-if="slipItems.length > 0" class="total-odds-row">
      <span class="to-label">Total Odds</span>
      <span class="to-val">{{ totalOdds }}</span>
    </div>

    <!-- Stake per bet -->
    <div class="stake-section">
      <div class="stake-row">
        <span class="stake-label">STAKE PER BET</span>
        <input type="number" class="stake-input" placeholder="0.00" />
      </div>
      <div class="stake-totals">
        <div class="total-row">
          <span>Total stake</span>
          <span>$ 0.00</span>
        </div>
        <div class="total-row potential">
          <span>Potential Returns:</span>
          <span class="potential-val">$ 0.00</span>
        </div>
      </div>
      <div class="stake-notice">Please select some after filling the bet</div>
      <button class="login-bet-btn">LOGIN TO BET</button>
    </div>

    <!-- Promo banner -->
    <div class="promo-banner">
      <div class="promo-bg">
        <div class="promo-text">
          <span class="promo-on">ON</span>
          <span class="promo-win">WIN</span>
        </div>
        <div class="promo-sub">FIRST BET<br><strong>BONUS</strong></div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBetSlip } from '@/composables/useBetSlip'

const activeSlipTab = ref('SINGLE')
const slipTabs = ['SINGLE', 'MULTI', 'SYSTEM']

const { slipItems, removeBet, clearAll, totalOdds } = useBetSlip()
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
  background: #252840;
  border: none;
  color: #9ba3b8;
  padding: 5px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 3px 3px 0 0;
  transition: background 0.15s, color 0.15s;
}
.slip-tab.active {
  background: #e84c6b;
  color: #fff;
}
.selections-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: #1a1d2e;
  border-bottom: 1px solid #252840;
}
.selections-label {
  font-size: 10px;
  font-weight: 700;
  color: #9ba3b8;
  text-transform: uppercase;
}
.clear-all-btn {
  background: none;
  border: none;
  color: #9ba3b8;
  cursor: pointer;
  font-size: 12px;
}
.selections-list {
  flex: 1;
  overflow-y: auto;
}
.slip-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  gap: 8px;
}
.slip-empty-img { width: 52px; height: 52px; object-fit: contain; }
.slip-empty-text {
  font-size: 10px;
  color: #5a6080;
  text-align: center;
  line-height: 1.6;
}
.total-odds-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: #141624;
  border-top: 1px solid #252840;
  border-bottom: 1px solid #252840;
}
.to-label { font-size: 10px; color: #9ba3b8; font-weight: 700; }
.to-val { font-size: 14px; font-weight: 900; color: #e84c6b; }
.selection-item {
  background: #141624;
  border-bottom: 1px solid #252840;
  padding: 6px 8px;
}
.sel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3px;
}
.sel-team {
  display: flex;
  align-items: center;
  gap: 4px;
}
.sel-flag { font-size: 12px; }
.sel-name {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}
.sel-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sel-odds {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
}
.sel-close {
  background: none;
  border: none;
  color: #9ba3b8;
  cursor: pointer;
  font-size: 11px;
}
.sel-match {
  font-size: 10px;
  color: #9ba3b8;
  margin-bottom: 2px;
}
.sel-meta {
  font-size: 10px;
  color: #5a6080;
  margin-bottom: 4px;
}
.sel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sel-status { font-size: 9px; color: #5a6080; }
.sel-returns { text-align: right; }
.ret-label { font-size: 9px; color: #5a6080; display: block; }
.ret-value { font-size: 11px; font-weight: 700; color: #fff; }
.sel-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #252840;
}
.pot-return {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #9ba3b8;
  font-size: 11px;
}
.bet-icon {
  background: #252840;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #e84c6b;
  cursor: pointer;
}
.pot-amount { text-align: right; }

.stake-section {
  padding: 8px;
  background: #1a1d2e;
  border-top: 1px solid #252840;
}
.stake-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.stake-label {
  font-size: 10px;
  font-weight: 700;
  color: #9ba3b8;
  text-transform: uppercase;
}
.stake-input {
  background: #141624;
  border: 1px solid #3a3f5c;
  border-radius: 3px;
  color: #fff;
  padding: 3px 6px;
  font-size: 11px;
  width: 70px;
  outline: none;
  text-align: right;
}
.stake-input:focus { border-color: #e84c6b; }
.stake-totals { margin-bottom: 6px; }
.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ba3b8;
  margin-bottom: 2px;
}
.total-row.potential { font-weight: 700; }
.potential-val { color: #fff; }
.stake-notice {
  font-size: 9px;
  color: #5a6080;
  text-align: center;
  margin-bottom: 8px;
}
.login-bet-btn {
  width: 100%;
  background: #9333ea;
  border: none;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.login-bet-btn:hover { background: #7c22cc; }

.promo-banner {
  margin: 8px;
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a9fff 0%, #0a4fcc 100%);
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  padding: 8px;
}
.promo-bg {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.promo-text {
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
}
.promo-on { color: #fff; }
.promo-win { color: #ffd700; }
.promo-sub {
  font-size: 11px;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.4;
}
.promo-sub strong { color: #ffd700; font-size: 14px; }
</style>
