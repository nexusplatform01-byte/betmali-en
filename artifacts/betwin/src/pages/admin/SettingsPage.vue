<template>
  <div class="settings-page">
    <div class="settings-grid">
      <div class="ss">
        <div class="sh">🔐 Admin Account</div>
        <div class="sb">
          <div class="field"><label>Username</label><input v-model="la.username" /></div>
          <div class="field"><label>Current Password</label><input v-model="la.currentPass" type="password" placeholder="Current password" /></div>
          <div class="field"><label>New Password</label><input v-model="la.newPass" type="password" placeholder="New password" /></div>
          <div class="field"><label>Confirm Password</label><input v-model="la.confirmPass" type="password" placeholder="Confirm password" /></div>
          <button class="sbtn" @click="savePassword">Update Password</button>
          <div v-if="passMsg" :class="['msg', passOk?'g':'r']">{{ passMsg }}</div>
        </div>
      </div>

      <div class="ss">
        <div class="sh">🌐 Site Information</div>
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
          <button class="sbtn" @click="showMsg('site')">Save Site Info</button>
          <div v-if="siteMsg" class="msg g">{{ siteMsg }}</div>
        </div>
      </div>

      <div class="ss">
        <div class="sh">💳 Deposit & Withdrawal Limits</div>
        <div class="sb">
          <div class="two-f">
            <div class="field"><label>Min Deposit</label><input v-model.number="siteSettings.minDeposit" type="number" /></div>
            <div class="field"><label>Max Deposit</label><input v-model.number="siteSettings.maxDeposit" type="number" /></div>
          </div>
          <div class="two-f">
            <div class="field"><label>Min Withdrawal</label><input v-model.number="siteSettings.minWithdrawal" type="number" /></div>
            <div class="field"><label>Max Withdrawal</label><input v-model.number="siteSettings.maxWithdrawal" type="number" /></div>
          </div>
          <button class="sbtn" @click="showMsg('limits')">Save Limits</button>
          <div v-if="limitsMsg" class="msg g">{{ limitsMsg }}</div>
        </div>
      </div>

      <div class="ss">
        <div class="sh">🎯 Betting Limits</div>
        <div class="sb">
          <div class="two-f">
            <div class="field"><label>Min Bet</label><input v-model.number="siteSettings.minBet" type="number" /></div>
            <div class="field"><label>Max Bet</label><input v-model.number="siteSettings.maxBet" type="number" /></div>
          </div>
          <div class="field"><label>Max Allowed Odds</label><input v-model.number="siteSettings.maxOdds" type="number" /></div>
          <button class="sbtn" @click="showMsg('bets')">Save Betting Limits</button>
          <div v-if="betsMsg" class="msg g">{{ betsMsg }}</div>
        </div>
      </div>

      <div class="ss">
        <div class="sh">⚙️ Feature Toggles</div>
        <div class="sb toggles">
          <div class="trow" v-for="t in toggles" :key="t.key">
            <div class="ti"><div class="tl">{{ t.label }}</div><div class="td">{{ t.desc }}</div></div>
            <div class="tswitch" :class="{on: (siteSettings as any)[t.key]}" @click="(siteSettings as any)[t.key] = !(siteSettings as any)[t.key]">
              <div class="tk"></div>
            </div>
          </div>
          <div class="sbanner" :class="siteSettings.maintenanceMode?'rbanner':'gbanner'">
            {{ siteSettings.maintenanceMode ? '⚠️ Site is in MAINTENANCE MODE' : '✅ Site is LIVE and operational' }}
          </div>
        </div>
      </div>

      <div class="ss danger">
        <div class="sh red">⚠️ Danger Zone</div>
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
import { siteSettings, activities, users } from '../../stores/adminData'

const la = reactive({ username: 'admin', currentPass: '', newPass: '', confirmPass: '' })
const passMsg = ref(''); const passOk = ref(false)
const siteMsg = ref(''); const limitsMsg = ref(''); const betsMsg = ref('')

function savePassword() {
  passMsg.value = ''
  if (!la.currentPass) { passMsg.value = 'Enter current password'; passOk.value = false; return }
  if (la.currentPass !== siteSettings.adminPassword) { passMsg.value = 'Current password is incorrect'; passOk.value = false; return }
  if (la.newPass.length < 6) { passMsg.value = 'Min 6 characters'; passOk.value = false; return }
  if (la.newPass !== la.confirmPass) { passMsg.value = 'Passwords do not match'; passOk.value = false; return }
  siteSettings.adminPassword = la.newPass
  la.currentPass = ''; la.newPass = ''; la.confirmPass = ''
  passMsg.value = '✅ Password updated!'; passOk.value = true
  setTimeout(() => { passMsg.value = '' }, 3000)
}

function showMsg(type: string) {
  if (type === 'site') { siteMsg.value = '✅ Saved!'; setTimeout(() => { siteMsg.value = '' }, 2500) }
  else if (type === 'limits') { limitsMsg.value = '✅ Saved!'; setTimeout(() => { limitsMsg.value = '' }, 2500) }
  else if (type === 'bets') { betsMsg.value = '✅ Saved!'; setTimeout(() => { betsMsg.value = '' }, 2500) }
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
  { label: 'Reset Site Balance', desc: 'Set site balance to zero (irreversible)', btnLabel: 'Reset', action: () => { siteSettings.siteBalance = 0 } },
  { label: 'Suspend All Users', desc: 'Suspend every active user account', btnLabel: 'Suspend All', action: () => users.forEach(u => { if (u.status === 'active') u.status = 'suspended' }) },
]
</script>

<style scoped>
.settings-page { height: 100%; overflow-y: auto; }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ss { background: #13172b; border: 1px solid #1e2240; border-radius: 8px; overflow: hidden; }
.ss.danger { border-color: rgba(239,68,68,0.3); }
.sh { padding: 10px 14px; font-size: 12px; font-weight: 700; color: #e2e8f0; border-bottom: 1px solid #1e2240; background: rgba(255,255,255,0.02); }
.sh.red { color: #ef4444; }
.sb { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label { font-size: 10px; color: #888; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.field input, .field select { background: #0d0f1e; border: 1px solid #252840; border-radius: 6px; color: #fff; padding: 7px 10px; font-size: 12px; outline: none; }
.field input:focus { border-color: #7c3aed; }
.two-f { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sbtn { background: linear-gradient(135deg,#7c3aed,#5c35c9); color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 12px; font-weight: 700; cursor: pointer; }
.sbtn:hover { opacity: 0.9; }
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
.sbanner { padding: 8px 14px; font-size: 11px; font-weight: 700; margin: 0; }
.gbanner { background: rgba(34,197,94,0.1); color: #22c55e; }
.rbanner { background: rgba(239,68,68,0.1); color: #ef4444; }
.ditem { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid #1e2240; }
.ditem:last-child { border-bottom: none; padding-bottom: 0; }
.dl { font-size: 12px; color: #e2e8f0; font-weight: 600; }
.dd { font-size: 10px; color: #666; margin-top: 1px; }
.dbtn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #ef4444; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; flex-shrink: 0; }
.dbtn:hover { background: rgba(239,68,68,0.2); }
</style>
