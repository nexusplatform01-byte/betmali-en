<template>
  <header class="top-bar">
    <!-- Coming soon toast -->
    <transition name="toast-fade">
      <div v-if="showToast" class="coming-soon-toast">
        🔴 Coming Soon
      </div>
    </transition>

    <!-- Upper bar -->
    <div class="upper-bar">
      <div class="logo">
        <span class="logo-bet">BET</span><span class="logo-win">WIN</span><span class="logo-dot">.</span>
      </div>
      <div class="upper-right">
        <div class="upper-links">
          <button class="upper-btn" @click="fireToast">
            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/phone-talk-3d-icon-png-download-3626670.png" class="upper-icon-img" alt="call" loading="eager" fetchpriority="high" />
            <span>LET US<br>CALL YOU</span>
          </button>
          <button class="upper-btn onwin" @click="fireToast">
            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/soccer-ball-3d-icon-png-download-6655789.png" class="upper-icon-img" alt="tv" />
            <span>ONWIN<br>TV LIVE</span>
          </button>
        </div>
        <div class="flag-selector">🇬🇧</div>
        <button class="btn-register" @click="fireToast">
          <img src="https://cdn3d.iconscout.com/3d/premium/thumb/sign-up-3d-icon-png-download-12826539.png" class="btn-icon-img" alt="register" />
          REGISTER
        </button>
        <button class="btn-login" @click="fireToast">
          <img src="https://cdn3d.iconscout.com/3d/premium/thumb/account-login-3d-icon-png-download-11502707.png" class="btn-icon-img" alt="login" />
          LOGIN
        </button>
      </div>
    </div>

    <!-- Lower nav tabs -->
    <nav class="lower-nav">
      <div
        v-for="tab in navTabs"
        :key="tab.label"
        class="nav-tab"
        :class="{ active: activeTab === tab.label }"
        @click="handleTabClick(tab.label)"
      >
        <img :src="tab.imgSrc" :alt="tab.label" class="tab-icon-img" loading="eager" fetchpriority="high" />
        {{ tab.label }}
        <span v-if="tab.live" class="live-dot"></span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('BETTING')
const showToast = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function fireToast() {
  if (toastTimer) clearTimeout(toastTimer)
  showToast.value = true
  toastTimer = setTimeout(() => { showToast.value = false }, 2500)
}

function handleTabClick(label: string) {
  if (label === 'BETTING') {
    activeTab.value = label
    return
  }
  fireToast()
}

const navTabs = [
  { label: 'BETTING',     imgSrc: 'https://cdn3d.iconscout.com/3d/premium/thumb/betting-3d-icon-png-download-9927750.png' },
  { label: 'LIVE',        imgSrc: 'https://cdn3d.iconscout.com/3d/premium/thumb/live-3d-icon-png-download-6925805.png', live: true },
  { label: 'LIVE CASINO', imgSrc: 'https://cdn3d.iconscout.com/3d/premium/thumb/casino-3d-icon-png-download-7308671.png' },
  { label: 'VIRTUAL',     imgSrc: 'https://cdn3d.iconscout.com/3d/premium/thumb/football-player-kicks-the-ball-3d-icon-png-download-5752063.png' },
  { label: 'AVIATOR',     imgSrc: 'https://seaflag.in/wp-content/uploads/2023/05/aviator-spribe-gaming_f3091ddd1.jpg' },
  { label: 'GAMES',       imgSrc: 'https://cdn3d.iconscout.com/3d/premium/thumb/casino-slot-machine-3d-icon-png-download-6925740.png' },
  { label: 'PROMOTIONS',  imgSrc: '/promo-icon.png' },
]
</script>

<style scoped>
.top-bar {
  background: #1a1d2e;
  border-bottom: 1px solid #252840;
  flex-shrink: 0;
  position: relative;
}
.upper-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #141624;
}
.logo {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -1px;
}
.logo-bet { color: #fff; }
.logo-win { color: #e84c6b; }
.logo-dot { color: #fff; }
.upper-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.upper-links {
  display: flex;
  gap: 4px;
}
.upper-btn {
  background: #252840;
  border: none;
  color: #9ba3b8;
  font-size: 9px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  text-align: left;
  line-height: 1.3;
  text-transform: uppercase;
  font-weight: 600;
  transition: background 0.15s;
}
.upper-btn:hover { background: #2f3450; }
.upper-btn.onwin { color: #00c6ff; }
.upper-icon-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
}
.flag-selector {
  font-size: 18px;
  cursor: pointer;
  background: #252840;
  padding: 4px 6px;
  border-radius: 4px;
}
.btn-register {
  background: transparent;
  border: 1px solid #e84c6b;
  color: #e84c6b;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.15s, color 0.15s;
}
.btn-register:hover { background: #e84c6b; color: #fff; }
.btn-login {
  background: #e84c6b;
  border: none;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.15s;
}
.btn-login:hover { background: #c93559; }
.btn-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

/* Nav tabs */
.lower-nav {
  display: flex;
  align-items: center;
  overflow-x: auto;
  background: #1a1d2e;
  scrollbar-width: none;
}
.lower-nav::-webkit-scrollbar { display: none; }
.nav-tab {
  color: #9ba3b8;
  font-size: 10px;
  font-weight: 600;
  padding: 0 10px;
  height: 36px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
  text-transform: uppercase;
  position: relative;
}
.nav-tab:hover { color: #fff; }
.nav-tab.active { color: #fff; border-bottom-color: #e84c6b; }
.tab-icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}
.live-dot {
  position: absolute;
  top: 4px;
  right: 6px;
  width: 6px;
  height: 6px;
  background: #e84c6b;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Coming Soon toast */
.coming-soon-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #141624;
  border: 1px solid #e84c6b;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 8px;
  z-index: 999;
  box-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px #e84c6b44;
  white-space: nowrap;
  pointer-events: none;
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -60%);
}
</style>
