<template>
  <div class="settings-page">
    <div class="settings-grid">
      <!-- Admin Account -->
      <div class="settings-section">
        <div class="section-title">🔐 Admin Account</div>
        <div class="section-body">
          <div class="field">
            <label>Admin Username</label>
            <input v-model="localAdmin.username" />
          </div>
          <div class="field">
            <label>Current Password</label>
            <input v-model="localAdmin.currentPass" type="password" placeholder="Enter current password" />
          </div>
          <div class="field">
            <label>New Password</label>
            <input v-model="localAdmin.newPass" type="password" placeholder="Enter new password" />
          </div>
          <div class="field">
            <label>Confirm New Password</label>
            <input v-model="localAdmin.confirmPass" type="password" placeholder="Confirm new password" />
          </div>
          <button class="save-btn" @click="savePassword">Update Password</button>
          <div v-if="passMsg" :class="['msg', passOk ? 'green' : 'red']">{{ passMsg }}</div>
        </div>
      </div>

      <!-- Site Info -->
      <div class="settings-section">
        <div class="section-title">🌐 Site Information</div>
        <div class="section-body">
          <div class="field">
            <label>Site Name</label>
            <input v-model="siteSettings.siteName" />
          </div>
          <div class="field">
            <label>Site URL</label>
            <input v-model="siteSettings.siteUrl" />
          </div>
          <div class="field">
            <label>Admin Email</label>
            <input v-model="siteSettings.adminEmail" type="email" />
          </div>
          <div class="field">
            <label>Default Currency</label>
            <select v-model="siteSettings.currency">
              <option value="UGX">UGX — Ugandan Shilling</option>
              <option value="KES">KES — Kenyan Shilling</option>
              <option value="TZS">TZS — Tanzanian Shilling</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>
          <button class="save-btn" @click="saveMsg('Site info saved!')">Save Site Info</button>
          <div v-if="siteMsg" class="msg green">{{ siteMsg }}</div>
        </div>
      </div>

      <!-- Deposit & Withdrawal Limits -->
      <div class="settings-section">
        <div class="section-title">💳 Deposit & Withdrawal Limits</div>
        <div class="section-body">
          <div class="two-field">
            <div class="field">
              <label>Min Deposit</label>
              <input v-model.number="siteSettings.minDeposit" type="number" />
            </div>
            <div class="field">
              <label>Max Deposit</label>
              <input v-model.number="siteSettings.maxDeposit" type="number" />
            </div>
          </div>
          <div class="two-field">
            <div class="field">
              <label>Min Withdrawal</label>
              <input v-model.number="siteSettings.minWithdrawal" type="number" />
            </div>
            <div class="field">
              <label>Max Withdrawal</label>
              <input v-model.number="siteSettings.maxWithdrawal" type="number" />
            </div>
          </div>
          <button class="save-btn" @click="saveMsg('Limits saved!')">Save Limits</button>
          <div v-if="limitsMsg" class="msg green">{{ limitsMsg }}</div>
        </div>
      </div>

      <!-- Betting Limits -->
      <div class="settings-section">
        <div class="section-title">🎯 Betting Limits</div>
        <div class="section-body">
          <div class="two-field">
            <div class="field">
              <label>Min Bet Amount</label>
              <input v-model.number="siteSettings.minBet" type="number" />
            </div>
            <div class="field">
              <label>Max Bet Amount</label>
              <input v-model.number="siteSettings.maxBet" type="number" />
            </div>
          </div>
          <div class="field">
            <label>Max Allowed Odds</label>
            <input v-model.number="siteSettings.maxOdds" type="number" />
          </div>
          <button class="save-btn" @click="saveMsg('Betting limits saved!')">Save Betting Limits</button>
          <div v-if="betLimitsMsg" class="msg green">{{ betLimitsMsg }}</div>
        </div>
      </div>

      <!-- Feature Toggles -->
      <div class="settings-section">
        <div class="section-title">⚙️ Feature Toggles</div>
        <div class="section-body toggles">
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label">Maintenance Mode</div>
              <div class="toggle-desc">Put site in maintenance — users cannot access</div>
            </div>
            <div class="toggle-switch" :class="{ on: siteSettings.maintenanceMode }" @click="siteSettings.maintenanceMode = !siteSettings.maintenanceMode">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label">User Registration</div>
              <div class="toggle-desc">Allow new users to register</div>
            </div>
            <div class="toggle-switch" :class="{ on: siteSettings.registrationEnabled }" @click="siteSettings.registrationEnabled = !siteSettings.registrationEnabled">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label">Deposits Enabled</div>
              <div class="toggle-desc">Allow users to deposit funds</div>
            </div>
            <div class="toggle-switch" :class="{ on: siteSettings.depositEnabled }" @click="siteSettings.depositEnabled = !siteSettings.depositEnabled">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label">Withdrawals Enabled</div>
              <div class="toggle-desc">Allow users to withdraw funds</div>
            </div>
            <div class="toggle-switch" :class="{ on: siteSettings.withdrawalEnabled }" @click="siteSettings.withdrawalEnabled = !siteSettings.withdrawalEnabled">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label">Betting Enabled</div>
              <div class="toggle-desc">Allow users to place bets</div>
            </div>
            <div class="toggle-switch" :class="{ on: siteSettings.bettingEnabled }" @click="siteSettings.bettingEnabled = !siteSettings.bettingEnabled">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="status-banner" :class="siteSettings.maintenanceMode ? 'red-banner' : 'green-banner'">
            {{ siteSettings.maintenanceMode ? '⚠️ Site is currently in MAINTENANCE MODE' : '✅ Site is LIVE and operational' }}
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="settings-section danger">
        <div class="section-title red">⚠️ Danger Zone</div>
        <div class="section-body">
          <div class="danger-item">
            <div>
              <div class="danger-label">Clear All User Activities</div>
              <div class="danger-desc">Permanently delete all activity logs for all users</div>
            </div>
            <button class="danger-btn" @click="activities.splice(0)">Clear Activities</button>
          </div>
          <div class="danger-item">
            <div>
              <div class="danger-label">Reset Site Balance</div>
              <div class="danger-desc">Reset the site balance to 0 (irreversible)</div>
            </div>
            <button class="danger-btn" @click="siteSettings.siteBalance = 0">Reset Balance</button>
          </div>
          <div class="danger-item">
            <div>
              <div class="danger-label">Suspend All Users</div>
              <div class="danger-desc">Suspend every user account immediately</div>
            </div>
            <button class="danger-btn" @click="suspendAll">Suspend All</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { siteSettings, activities, users } from '../../stores/adminData'

const localAdmin = reactive({ username: 'admin', currentPass: '', newPass: '', confirmPass: '' })
const passMsg = ref('')
const passOk = ref(false)
const siteMsg = ref('')
const limitsMsg = ref('')
const betLimitsMsg = ref('')

function savePassword() {
  passMsg.value = ''
  if (!localAdmin.currentPass) { passMsg.value = 'Enter current password'; passOk.value = false; return }
  if (localAdmin.currentPass !== siteSettings.adminPassword) { passMsg.value = 'Current password is incorrect'; passOk.value = false; return }
  if (localAdmin.newPass.length < 6) { passMsg.value = 'New password must be at least 6 characters'; passOk.value = false; return }
  if (localAdmin.newPass !== localAdmin.confirmPass) { passMsg.value = 'Passwords do not match'; passOk.value = false; return }
  siteSettings.adminPassword = localAdmin.newPass
  localAdmin.currentPass = ''; localAdmin.newPass = ''; localAdmin.confirmPass = ''
  passMsg.value = '✅ Password updated successfully!'
  passOk.value = true
  setTimeout(() => { passMsg.value = '' }, 3000)
}

function saveMsg(msg: string) {
  if (msg.includes('Site info')) { siteMsg.value = '✅ ' + msg; setTimeout(() => { siteMsg.value = '' }, 2500) }
  else if (msg.includes('Limits')) { limitsMsg.value = '✅ ' + msg; setTimeout(() => { limitsMsg.value = '' }, 2500) }
  else if (msg.includes('Betting')) { betLimitsMsg.value = '✅ ' + msg; setTimeout(() => { betLimitsMsg.value = '' }, 2500) }
}

function suspendAll() {
  users.forEach(u => { if (u.status === 'active') u.status = 'suspended' })
}
</script>

<style scoped>
.settings-page { display: flex; flex-direction: column; gap: 0; }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.settings-section {
  background: #13172b;
  border: 1px solid #1e2240;
  border-radius: 12px;
  overflow: hidden;
}
.settings-section.danger { border-color: rgba(239,68,68,0.3); }
.section-title {
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 700;
  color: #e2e8f0;
  border-bottom: 1px solid #1e2240;
  background: rgba(255,255,255,0.02);
}
.section-title.red { color: #ef4444; }
.section-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 11px; color: #888; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.field input, .field select {
  background: #0d0f1e;
  border: 1px solid #252840;
  border-radius: 8px;
  color: #fff;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.field input:focus { border-color: #7c3aed; }
.two-field { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.save-btn {
  background: linear-gradient(135deg, #7c3aed, #5c35c9);
  color: #fff; border: none; border-radius: 8px;
  padding: 12px; font-size: 14px; font-weight: 700; cursor: pointer;
  margin-top: 4px;
}
.save-btn:hover { opacity: 0.9; }
.msg { font-size: 13px; font-weight: 600; padding: 8px 12px; border-radius: 6px; }
.msg.green { background: rgba(34,197,94,0.1); color: #22c55e; }
.msg.red { background: rgba(239,68,68,0.1); color: #ef4444; }
.toggles { gap: 0; }
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #1e2240;
}
.toggle-row:last-of-type { border-bottom: none; }
.toggle-label { font-size: 14px; color: #e2e8f0; font-weight: 600; }
.toggle-desc { font-size: 12px; color: #666; margin-top: 2px; }
.toggle-switch {
  width: 44px; height: 24px;
  background: #1e2240;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.toggle-switch.on { background: #7c3aed; }
.toggle-knob {
  position: absolute;
  width: 18px; height: 18px;
  background: #fff;
  border-radius: 50%;
  top: 3px; left: 3px;
  transition: left 0.2s;
}
.toggle-switch.on .toggle-knob { left: 23px; }
.status-banner {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  margin-top: 8px;
}
.green-banner { background: rgba(34,197,94,0.1); color: #22c55e; }
.red-banner { background: rgba(239,68,68,0.1); color: #ef4444; }
.danger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #1e2240;
}
.danger-item:last-child { border-bottom: none; padding-bottom: 0; }
.danger-label { font-size: 14px; color: #e2e8f0; font-weight: 600; }
.danger-desc { font-size: 12px; color: #666; margin-top: 2px; }
.danger-btn {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.3);
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}
.danger-btn:hover { background: rgba(239,68,68,0.2); }
</style>
