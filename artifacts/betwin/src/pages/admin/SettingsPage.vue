<template>
  <div class="settings-page">
    <div class="settings-grid">
      <div class="ss">
        <div class="sh">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Admin Account
        </div>
        <div class="sb">
          <div class="field"><label>Username</label><input v-model="la.username" /></div>
          <div class="field"><label>Current Password</label><input v-model="la.currentPass" type="password" placeholder="Current password" /></div>
          <div class="field"><label>New Password</label><input v-model="la.newPass" type="password" placeholder="New password" /></div>
          <div class="field"><label>Confirm Password</label><input v-model="la.confirmPass" type="password" placeholder="Confirm password" /></div>
          <button class="sbtn" @click="savePassword" :disabled="passLoading">{{ passLoading ? 'Saving...' : 'Update Password' }}</button>
          <div v-if="passMsg" :class="['msg', passOk?'g':'r']">{{ passMsg }}</div>
        </div>
      </div>

      <div class="ss">
        <div class="sh">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Site Information
        </div>
        <div class="sb">
          <div class="field"><label>Site Name</label><input v-model="siteSettings.siteName" /></div>
          <div class="field"><label>Site URL</label><input v-model="siteSettings.siteUrl" /></div>
          <div class="field"><label>Admin Email</label><input v-model="siteSettings.adminEmail" type="email" /></div>
          <div class="field">
            <label>Currency</label>
            <select v-model="siteSettings.currency">
              <option value="UGX">UGX — Ugandan Shilling</option>
              <option value="KES">KES — Kenyan Shilling</option>
              <option value="TZS">TZS — Tanzanian Shilling</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>
          <button class="sbtn" @click="saveSite" :disabled="siteLoading">{{ siteLoading ? 'Saving...' : 'Save Site Info' }}</button>
          <div v-if="siteMsg" class="msg g">{{ siteMsg }}</div>
        </div>
      </div>

      <div class="ss">
        <div class="sh">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Deposit &amp; Withdrawal Limits
        </div>
        <div class="sb">
          <div class="two-f">
            <div class="field"><label>Min Deposit</label><input v-model.number="siteSettings.minDeposit" type="number" /></div>
            <div class="field"><label>Max Deposit</label><input v-model.number="siteSettings.maxDeposit" type="number" /></div>
          </div>
          <div class="two-f">
            <div class="field"><label>Min Withdrawal</label><input v-model.number="siteSettings.minWithdrawal" type="number" /></div>
            <div class="field"><label>Max Withdrawal</label><input v-model.number="siteSettings.maxWithdrawal" type="number" /></div>
          </div>
          <button class="sbtn" @click="saveLimits" :disabled="limitsLoading">{{ limitsLoading ? 'Saving...' : 'Save Limits' }}</button>
          <div v-if="limitsMsg" class="msg g">{{ limitsMsg }}</div>
        </div>
      </div>

      <div class="ss">
        <div class="sh">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Betting Limits
        </div>
        <div class="sb">
          <div class="two-f">
            <div class="field"><label>Min Bet</label><input v-model.number="siteSettings.minBet" type="number" /></div>
            <div class="field"><label>Max Bet</label><input v-model.number="siteSettings.maxBet" type="number" /></div>
          </div>
          <div class="field"><label>Max Allowed Odds</label><input v-model.number="siteSettings.maxOdds" type="number" /></div>
          <button class="sbtn" @click="saveBets" :disabled="betsLoading">{{ betsLoading ? 'Saving...' : 'Save Betting Limits' }}</button>
          <div v-if="betsMsg" class="msg g">{{ betsMsg }}</div>
        </div>
      </div>

      <div class="ss">
        <div class="sh">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Feature Toggles
        </div>
        <div class="sb toggles">
          <div class="trow" v-for="t in toggles" :key="t.key">
            <div class="ti"><div class="tl">{{ t.label }}</div><div class="td">{{ t.desc }}</div></div>
            <div class="tswitch" :class="{on: (siteSettings as any)[t.key]}" @click="toggleFeature(t.key)">
              <div class="tk"></div>
            </div>
          </div>
          <div class="sbanner" :class="siteSettings.maintenanceMode?'rbanner':'gbanner'">
            <svg v-if="siteSettings.maintenanceMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
            {{ siteSettings.maintenanceMode ? 'Site is in MAINTENANCE MODE' : 'Site is LIVE and operational' }}
          </div>
        </div>
      </div>

      <div class="ss danger">
        <div class="sh red">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" width="13" height="13"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Danger Zone
        </div>
        <div class="sb">
          <div class="ditem" v-for="d in dangerItems" :key="d.label">
            <div><div class="dl">{{ d.label }}</div><div class="dd">{{ d.desc }}</div></div>
            <button class="dbtn" @click="d.action">{{ d.btnLabel }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { siteSettings, activities, users, saveSiteSettings } from '../../stores/adminData'

const la = reactive({ username: 'admin', currentPass: '', newPass: '', confirmPass: '' })
const passMsg = ref(''); const passOk = ref(false); const passLoading = ref(false)
const siteMsg = ref(''); const siteLoading = ref(false)
const limitsMsg = ref(''); const limitsLoading = ref(false)
const betsMsg = ref(''); const betsLoading = ref(false)

async function savePassword() {
  passMsg.value = ''
  if (!la.currentPass) { passMsg.value = 'Enter current password'; passOk.value = false; return }
  if (la.currentPass !== siteSettings.adminPassword) { passMsg.value = 'Current password is incorrect'; passOk.value = false; return }
  if (la.newPass.length < 6) { passMsg.value = 'Min 6 characters'; passOk.value = false; return }
  if (la.newPass !== la.confirmPass) { passMsg.value = 'Passwords do not match'; passOk.value = false; return }
  passLoading.value = true
  try {
    await saveSiteSettings({ adminPassword: la.newPass })
    la.currentPass = ''; la.newPass = ''; la.confirmPass = ''
    passMsg.value = 'Password updated!'; passOk.value = true
    setTimeout(() => { passMsg.value = '' }, 3000)
  } finally { passLoading.value = false }
}

async function saveSite() {
  siteLoading.value = true
  try {
    await saveSiteSettings({ siteName: siteSettings.siteName, siteUrl: siteSettings.siteUrl, adminEmail: siteSettings.adminEmail, currency: siteSettings.currency })
    siteMsg.value = 'Saved!'; setTimeout(() => { siteMsg.value = '' }, 2500)
  } finally { siteLoading.value = false }
}

async function saveLimits() {
  limitsLoading.value = true
  try {
    await saveSiteSettings({ minDeposit: siteSettings.minDeposit, maxDeposit: siteSettings.maxDeposit, minWithdrawal: siteSettings.minWithdrawal, maxWithdrawal: siteSettings.maxWithdrawal })
    limitsMsg.value = 'Saved!'; setTimeout(() => { limitsMsg.value = '' }, 2500)
  } finally { limitsLoading.value = false }
}

async function saveBets() {
  betsLoading.value = true
  try {
    await saveSiteSettings({ minBet: siteSettings.minBet, maxBet: siteSettings.maxBet, maxOdds: siteSettings.maxOdds })
    betsMsg.value = 'Saved!'; setTimeout(() => { betsMsg.value = '' }, 2500)
  } finally { betsLoading.value = false }
}

async function toggleFeature(key: string) {
  ;(siteSettings as any)[key] = !(siteSettings as any)[key]
  await saveSiteSettings({ [key]: (siteSettings as any)[key] }).catch(() => {})
}

const toggles = [
  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable site access for all users' },
  { key: 'registrationEnabled', label: 'User Registration', desc: 'Allow new users to register' },
  { key: 'depositEnabled', label: 'Deposits Enabled', desc: 'Allow users to deposit funds' },
  { key: 'withdrawalEnabled', label: 'Withdrawals Enabled', desc: 'Allow users to withdraw funds' },
  { key: 'bettingEnabled', label: 'Betting Enabled', desc: 'Allow users to place bets' },
]

const dangerItems = [
  { label: 'Clear All Activities', desc: 'Delete all user activity logs permanently', btnLabel: 'Clear', action: () => activities.splice(0) },
  { label: 'Reset Site Balance', desc: 'Set site balance to zero (irreversible)', btnLabel: 'Reset', action: () => saveSiteSettings({ siteBalance: 0 }).then(() => { siteSettings.siteBalance = 0 }) },
  { label: 'Suspend All Users', desc: 'Suspend every active user account', btnLabel: 'Suspend All', action: () => users.forEach(u => { if (u.status === 'active') u.status = 'suspended' }) },
]
</script>

<style scoped>
.settings-page { height: 100%; overflow-y: auto; }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ss { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; overflow: hidden; }
.ss.danger { border-color: rgba(239,68,68,0.3); }
.sh { padding: 10px 14px; font-size: 12px; font-weight: 700; color: #e2e8f0; border-bottom: 1px solid #1e2240; background: rgba(255,255,255,0.02); display: flex; align-items: center; gap: 7px; }
.sh.red { color: #ef4444; }
.sb { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label { font-size: 10px; color: #888; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.field input, .field select { background: #0d0f1e; border: 1px solid #252840; border-radius: 6px; color: #fff; padding: 7px 10px; font-size: 12px; outline: none; }
.field input:focus { border-color: #7c3aed; }
.two-f { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sbtn { background: linear-gradient(135deg,#7c3aed,#5c35c9); color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 12px; font-weight: 700; cursor: pointer; }
.sbtn:disabled { opacity: 0.6; cursor: not-allowed; }
.sbtn:not(:disabled):hover { opacity: 0.9; }
.msg { font-size: 11px; font-weight: 600; padding: 6px 10px; border-radius: 5px; }
.msg.g { background: rgba(34,197,94,0.1); color: #22c55e; }
.msg.r { background: rgba(239,68,68,0.1); color: #ef4444; }
.toggles { gap: 0; padding: 0; }
.trow { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #1e2240; }
.trow:last-of-type { border-bottom: none; }
.tl { font-size: 12px; color: #e2e8f0; font-weight: 600; }
.td { font-size: 10px; color: #666; margin-top: 1px; }
.tswitch { width: 36px; height: 20px; background: #1e2240; border-radius: 10px; position: relative; cursor: pointer; flex-shrink: 0; transition: background 0.2s; }
.tswitch.on { background: #7c3aed; }
.tk { position: absolute; width: 14px; height: 14px; background: #fff; border-radius: 50%; top: 3px; left: 3px; transition: left 0.2s; }
.tswitch.on .tk { left: 19px; }
.sbanner { padding: 8px 14px; font-size: 11px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 6px; }
.gbanner { background: rgba(34,197,94,0.1); color: #22c55e; }
.rbanner { background: rgba(239,68,68,0.1); color: #ef4444; }
.ditem { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid #1e2240; }
.ditem:last-child { border-bottom: none; padding-bottom: 0; }
.dl { font-size: 12px; color: #e2e8f0; font-weight: 600; }
.dd { font-size: 10px; color: #666; margin-top: 1px; }
.dbtn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #ef4444; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; flex-shrink: 0; }
.dbtn:hover { background: rgba(239,68,68,0.2); }
</style>
