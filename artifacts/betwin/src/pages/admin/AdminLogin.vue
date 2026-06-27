<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="logo">
        <span class="logo-bet">BET</span><span class="logo-win">WIN</span>
        <span class="logo-dot">.</span>
      </div>
      <div class="subtitle">Admin Portal</div>
      <form @submit.prevent="handleLogin" class="form">
        <div class="field">
          <label>Username</label>
          <input v-model="username" type="text" placeholder="Enter username" autocomplete="username" />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter password" autocomplete="current-password" />
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <button type="submit" class="login-btn">Login to Dashboard</button>
      </form>
      <div class="hint">Default: admin / admin123</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin } from '../../stores/adminData'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Please enter username and password'
    return
  }
  const ok = adminLogin(username.value, password.value)
  if (ok) {
    router.push('/admin/dashboard')
  } else {
    error.value = 'Invalid username or password'
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  background: #0d0f1e;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box {
  background: #13172b;
  border: 1px solid #252840;
  border-radius: 16px;
  padding: 48px 40px;
  width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.logo {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 4px;
}
.logo-bet { color: #fff; }
.logo-win { color: #f5a623; }
.logo-dot { color: #7c3aed; }
.subtitle {
  font-size: 13px;
  color: #888;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field label {
  font-size: 12px;
  color: #aaa;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.field input {
  background: #0d0f1e;
  border: 1px solid #252840;
  border-radius: 8px;
  color: #fff;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.field input:focus {
  border-color: #7c3aed;
}
.error-msg {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
}
.login-btn {
  background: linear-gradient(135deg, #7c3aed, #5c35c9);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s;
}
.login-btn:hover { opacity: 0.9; }
.hint {
  font-size: 11px;
  color: #555;
  margin-top: 12px;
}
</style>
