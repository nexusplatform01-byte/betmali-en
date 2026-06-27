<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modalType" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-card">

          <!-- Phone collection step (after Google login) -->
          <template v-if="needsPhone">
            <div class="modal-header">
              <div class="modal-logo">
                <span class="logo-bet">BET</span><span class="logo-win">WIN</span><span class="logo-dot">.</span>
              </div>
              <button class="close-btn" @click="closeModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-title">One more step</div>
            <div class="modal-sub">Add your phone number to complete setup</div>
            <div class="bonus-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
              UGX 1,000 Welcome Bonus Added!
            </div>
            <div v-if="phoneError" class="form-error">{{ phoneError }}</div>
            <input
              v-model="phoneInput"
              type="tel"
              class="form-input"
              placeholder="+256 7XX XXX XXX"
              @keydown.enter="submitPhone"
            />
            <button class="submit-btn" @click="submitPhone" :disabled="authLoading">
              <span v-if="authLoading" class="spinner"></span>
              <span v-else>Save &amp; Continue</span>
            </button>
            <button class="skip-link" @click="skipPhone">Skip for now</button>
          </template>

          <!-- Login / Register -->
          <template v-else>
            <div class="modal-header">
              <div class="modal-logo">
                <span class="logo-bet">BET</span><span class="logo-win">WIN</span><span class="logo-dot">.</span>
              </div>
              <button class="close-btn" @click="closeModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Tabs -->
            <div class="modal-tabs">
              <button class="tab-btn" :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'; formError = ''">Login</button>
              <button class="tab-btn" :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'; formError = ''">Register</button>
            </div>

            <!-- Login form -->
            <div v-if="activeTab === 'login'" class="form-body">
              <div class="modal-title">Welcome Back</div>
              <div class="modal-sub">Sign in to your account</div>
              <div v-if="formError" class="form-error">{{ formError }}</div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="loginEmail" type="email" class="form-input" placeholder="you@example.com" autocomplete="email" @keydown.enter="handleLogin" />
              </div>
              <div class="form-group">
                <label>Password</label>
                <div class="input-row">
                  <input v-model="loginPassword" :type="showLoginPass ? 'text' : 'password'" class="form-input" placeholder="Your password" autocomplete="current-password" @keydown.enter="handleLogin" />
                  <button type="button" class="eye-toggle" @click="showLoginPass = !showLoginPass">
                    <svg v-if="showLoginPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
              <button class="submit-btn" @click="handleLogin" :disabled="authLoading">
                <span v-if="authLoading" class="spinner"></span>
                <span v-else>Sign In</span>
              </button>
              <div class="divider"><span>or</span></div>
              <button class="google-btn" @click="handleGoogle" :disabled="authLoading">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
            </div>

            <!-- Register form -->
            <div v-if="activeTab === 'register'" class="form-body">
              <div class="modal-title">Create Account</div>
              <div class="modal-sub">Join BetWin and get UGX 1,000 free bonus</div>
              <div class="bonus-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                UGX 1,000 Welcome Bonus on Registration!
              </div>
              <div v-if="formError" class="form-error">{{ formError }}</div>
              <div class="form-row">
                <div class="form-group">
                  <label>Full Name</label>
                  <input v-model="regName" type="text" class="form-input" placeholder="John Doe" autocomplete="name" />
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input v-model="regPhone" type="tel" class="form-input" placeholder="+256 7XX XXX XXX" autocomplete="tel" />
                </div>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="regEmail" type="email" class="form-input" placeholder="you@example.com" autocomplete="email" />
              </div>
              <div class="form-group">
                <label>Password</label>
                <div class="input-row">
                  <input v-model="regPassword" :type="showRegPass ? 'text' : 'password'" class="form-input" placeholder="At least 6 characters" autocomplete="new-password" />
                  <button type="button" class="eye-toggle" @click="showRegPass = !showRegPass">
                    <svg v-if="showRegPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
              <button class="submit-btn" @click="handleRegister" :disabled="authLoading">
                <span v-if="authLoading" class="spinner"></span>
                <span v-else>Create Account</span>
              </button>
              <div class="divider"><span>or</span></div>
              <button class="google-btn" @click="handleGoogle" :disabled="authLoading">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign up with Google
              </button>
              <div class="terms-note">By registering, you confirm you are 18+ and agree to our Terms &amp; Conditions.</div>
            </div>
          </template>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthModal } from '@/composables/useAuthModal'

const {
  modalType, needsPhone, authLoading,
  closeModal, loginWithEmail, registerWithEmail, loginWithGoogle, savePhone,
} = useAuthModal()

const activeTab = ref<'login' | 'register'>('login')
const formError = ref('')

const loginEmail = ref('')
const loginPassword = ref('')
const showLoginPass = ref(false)

const regName = ref('')
const regPhone = ref('')
const regEmail = ref('')
const regPassword = ref('')
const showRegPass = ref(false)

const phoneInput = ref('')
const phoneError = ref('')

async function handleLogin() {
  formError.value = ''
  if (!loginEmail.value || !loginPassword.value) {
    formError.value = 'Please fill in all fields'
    return
  }
  const err = await loginWithEmail(loginEmail.value.trim(), loginPassword.value)
  if (err) formError.value = err
}

async function handleRegister() {
  formError.value = ''
  if (!regName.value || !regPhone.value || !regEmail.value || !regPassword.value) {
    formError.value = 'Please fill in all fields'
    return
  }
  const err = await registerWithEmail(regName.value.trim(), regPhone.value.trim(), regEmail.value.trim(), regPassword.value)
  if (err) formError.value = err
}

async function handleGoogle() {
  formError.value = ''
  const err = await loginWithGoogle()
  if (err) formError.value = err
}

async function submitPhone() {
  phoneError.value = ''
  if (!phoneInput.value.trim()) {
    phoneError.value = 'Please enter your phone number'
    return
  }
  await savePhone(phoneInput.value.trim())
}

function skipPhone() {
  closeModal()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(15,23,42,0.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.modal-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: none;
  box-shadow: 0 20px 60px rgba(15,23,42,0.15), 0 4px 16px rgba(15,23,42,0.08);
}
.modal-card::-webkit-scrollbar { display: none; }
.modal-header { display: flex; align-items: center; justify-content: space-between; }
.modal-logo { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
.logo-bet { color: #1a2d4e; } .logo-win { color: #e84c6b; } .logo-dot { color: #1a2d4e; }
.close-btn {
  background: none; border: none; color: #94a3b8; cursor: pointer;
  padding: 4px; border-radius: 6px; transition: color 0.15s, background 0.15s; display: flex;
}
.close-btn:hover { color: #374151; background: #f1f5f9; }
.modal-tabs { display: flex; border-bottom: 1px solid #e2e8f0; }
.tab-btn {
  flex: 1; background: none; border: none; border-bottom: 2px solid transparent;
  color: #94a3b8; font-size: 13px; font-weight: 700; padding: 7px;
  cursor: pointer; transition: color 0.15s, border-color 0.15s; margin-bottom: -1px;
}
.tab-btn.active { color: #1a2d4e; border-bottom-color: #e84c6b; }
.modal-title { font-size: 16px; font-weight: 800; color: #1a2d4e; }
.modal-sub { font-size: 11px; color: #64748b; margin-top: -6px; }
.bonus-badge {
  display: flex; align-items: center; gap: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px; padding: 7px 10px;
  font-size: 11px; font-weight: 700; color: #16a34a;
}
.form-body { display: flex; flex-direction: column; gap: 10px; }
.form-row { display: flex; gap: 8px; }
.form-row .form-group { flex: 1; min-width: 0; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 10px; color: #64748b; font-weight: 600; letter-spacing: 0.2px; }
.input-row { position: relative; display: flex; }
.input-row .form-input { padding-right: 36px; }
.eye-toggle {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0; display: flex;
}
.eye-toggle:hover { color: #374151; }
.form-input {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  color: #1a202c;
  padding: 9px 11px;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.form-input:focus { border-color: #e84c6b; box-shadow: 0 0 0 2px rgba(232,76,107,0.1); }
.form-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626; border-radius: 7px;
  padding: 8px 10px; font-size: 11px;
}
.submit-btn {
  background: linear-gradient(135deg, #e84c6b, #c93559);
  color: #fff; border: none; border-radius: 8px;
  padding: 11px; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: opacity 0.2s;
  display: flex; align-items: center; justify-content: center;
  min-height: 42px;
  box-shadow: 0 2px 10px rgba(232,76,107,0.3);
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.submit-btn:not(:disabled):hover { opacity: 0.9; }
.divider {
  display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 11px;
}
.divider::before, .divider::after { content: ''; flex: 1; border-top: 1px solid #e2e8f0; }
.google-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  background: #fff; color: #374151; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 9px 14px; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: background 0.15s, border-color 0.15s;
}
.google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.google-btn:not(:disabled):hover { background: #f8fafc; border-color: #cbd5e1; }
.terms-note { font-size: 10px; color: #94a3b8; text-align: center; line-height: 1.5; }
.skip-link {
  background: none; border: none; color: #94a3b8; font-size: 11px;
  cursor: pointer; text-decoration: underline; padding: 0; text-align: center;
}
.skip-link:hover { color: #374151; }
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff; border-radius: 50%;
  animation: spin 0.7s linear infinite; display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
