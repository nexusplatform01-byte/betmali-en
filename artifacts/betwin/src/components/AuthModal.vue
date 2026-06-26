<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modalType" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-logo">
              <span class="logo-bet">BET</span><span class="logo-win">WIN</span><span class="logo-dot">.</span>
            </div>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>

          <!-- Tabs -->
          <div class="modal-tabs">
            <button class="mtab" :class="{ active: modalType === 'login' }" @click="modalType = 'login'">LOGIN</button>
            <button class="mtab" :class="{ active: modalType === 'register' }" @click="modalType = 'register'">REGISTER</button>
          </div>

          <!-- LOGIN FORM -->
          <form v-if="modalType === 'login'" class="modal-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="loginPhone" type="tel" placeholder="e.g. 0700000000" autocomplete="tel" required />
            </div>
            <div class="form-group">
              <label>Password</label>
              <div class="input-pw">
                <input v-model="loginPassword" :type="showLoginPw ? 'text' : 'password'" placeholder="Enter password" minlength="4" required />
                <button type="button" class="pw-toggle" @click="showLoginPw = !showLoginPw">{{ showLoginPw ? '🙈' : '👁' }}</button>
              </div>
            </div>
            <div v-if="loginError" class="form-error">{{ loginError }}</div>
            <button type="submit" class="modal-submit">LOGIN</button>
            <p class="modal-switch">Don't have an account? <button type="button" class="switch-link" @click="modalType = 'register'">Register</button></p>
          </form>

          <!-- REGISTER FORM -->
          <form v-else class="modal-form" @submit.prevent="handleRegister">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="regName" type="text" placeholder="Your full name" autocomplete="name" required />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="regPhone" type="tel" placeholder="e.g. 0700000000" autocomplete="tel" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="regEmail" type="email" placeholder="you@email.com" autocomplete="email" required />
            </div>
            <div class="form-group">
              <label>Password <span class="pw-hint">(min 4 characters)</span></label>
              <div class="input-pw">
                <input v-model="regPassword" :type="showRegPw ? 'text' : 'password'" placeholder="Create password" minlength="4" required />
                <button type="button" class="pw-toggle" @click="showRegPw = !showRegPw">{{ showRegPw ? '🙈' : '👁' }}</button>
              </div>
            </div>
            <div v-if="regError" class="form-error">{{ regError }}</div>
            <button type="submit" class="modal-submit">CREATE ACCOUNT</button>
            <p class="modal-switch">Already have an account? <button type="button" class="switch-link" @click="modalType = 'login'">Login</button></p>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthModal } from '@/composables/useAuthModal'

const { modalType, closeModal } = useAuthModal()

const loginPhone = ref('')
const loginPassword = ref('')
const showLoginPw = ref(false)
const loginError = ref('')

const regName = ref('')
const regPhone = ref('')
const regEmail = ref('')
const regPassword = ref('')
const showRegPw = ref(false)
const regError = ref('')

function handleLogin() {
  loginError.value = ''
  if (loginPhone.value.trim().length < 7) { loginError.value = 'Enter a valid phone number.'; return }
  if (loginPassword.value.length < 4) { loginError.value = 'Password must be at least 4 characters.'; return }
  alert(`Login successful for ${loginPhone.value}`)
  closeModal()
}

function handleRegister() {
  regError.value = ''
  if (regName.value.trim().length < 2) { regError.value = 'Enter your full name.'; return }
  if (regPhone.value.trim().length < 7) { regError.value = 'Enter a valid phone number.'; return }
  if (!regEmail.value.includes('@')) { regError.value = 'Enter a valid email address.'; return }
  if (regPassword.value.length < 4) { regError.value = 'Password must be at least 4 characters.'; return }
  alert(`Account created for ${regName.value}!`)
  closeModal()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
}
.modal-box {
  background: #1a1d2e;
  border: 1px solid #2e3355;
  border-radius: 14px;
  width: 340px;
  max-width: calc(100vw - 32px);
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 10px;
  border-bottom: 1px solid #252840;
}
.modal-logo { font-size: 22px; font-weight: 900; letter-spacing: -1px; }
.logo-bet { color: #fff; }
.logo-win { color: #e84c6b; }
.logo-dot { color: #fff; }
.modal-close {
  background: #252840;
  border: none;
  color: #9ba3b8;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.modal-close:hover { background: #e84c6b; color: #fff; }

.modal-tabs {
  display: flex;
  border-bottom: 1px solid #252840;
}
.mtab {
  flex: 1;
  background: none;
  border: none;
  color: #7a84a0;
  font-size: 11px;
  font-weight: 700;
  padding: 10px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
  letter-spacing: 0.5px;
}
.mtab.active { color: #fff; border-bottom-color: #e84c6b; }
.mtab:hover:not(.active) { color: #c8cfe0; }

.modal-form {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-group label {
  font-size: 10px;
  font-weight: 700;
  color: #7a84a0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.pw-hint { color: #5a6a88; font-weight: 400; text-transform: none; }
.form-group input {
  background: #12141f;
  border: 1px solid #2e3355;
  border-radius: 7px;
  color: #e2e8f0;
  padding: 9px 11px;
  font-size: 12px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.form-group input:focus { border-color: #e84c6b; }
.input-pw { position: relative; }
.input-pw input { padding-right: 36px; }
.pw-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: #7a84a0;
}
.form-error {
  background: rgba(232, 76, 107, 0.12);
  border: 1px solid rgba(232, 76, 107, 0.3);
  border-radius: 6px;
  color: #e84c6b;
  font-size: 11px;
  padding: 7px 10px;
}
.modal-submit {
  background: #e84c6b;
  border: none;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  padding: 11px;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.15s;
  margin-top: 2px;
}
.modal-submit:hover { background: #c93559; }
.modal-switch {
  font-size: 11px;
  color: #7a84a0;
  text-align: center;
  margin: 0;
}
.switch-link {
  background: none;
  border: none;
  color: #e84c6b;
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
}
.switch-link:hover { text-decoration: underline; }

/* Transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95); }
</style>
