<template>
  <aside class="left-sidebar">
    <!-- Sport / Live tabs -->
    <div class="sidebar-tabs">
      <button class="stab active">
        <span class="stab-dot sports"></span> SPORTS <span class="stab-count">24/7</span>
      </button>
      <button class="stab">
        <span class="stab-dot live"></span> LIVE <span class="stab-count live-c">51</span>
      </button>
    </div>

    <!-- Time filter + search -->
    <div class="sidebar-tools">
      <div class="time-filter">
        <button class="time-btn active">24 hours</button>
      </div>
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="search" placeholder="Search" class="search-input" />
      </div>
    </div>

    <!-- Outrights -->
    <div class="section-header collapsible" @click="outrightsOpen = !outrightsOpen">
      <span>Outrights</span>
      <span class="chevron" :class="{ open: outrightsOpen }">›</span>
    </div>

    <!-- Top Championships -->
    <div class="section-header collapsible" @click="champOpen = !champOpen">
      <span>Top Championships</span>
      <span class="chevron" :class="{ open: champOpen }">›</span>
    </div>

    <!-- Popular Sports -->
    <div class="section-header collapsible" @click="popularOpen = !popularOpen">
      <span>Popular Sports</span>
      <span class="chevron" :class="{ open: popularOpen }">›</span>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const outrightsOpen = ref(true)
const champOpen = ref(true)
const popularOpen = ref(true)
</script>

<style scoped>
.left-sidebar {
  width: 175px;
  min-width: 175px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  font-size: 11px;
}
.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}
.stab {
  flex: 1;
  background: #f8fafc;
  border: none;
  color: #64748b;
  padding: 8px 4px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-transform: uppercase;
  transition: background 0.15s;
}
.stab.active {
  background: #fff;
  color: #1a2d4e;
  border-bottom: 2px solid #e84c6b;
}
.stab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.stab-dot.sports { background: #22c55e; }
.stab-dot.live { background: #e84c6b; }
.stab-count {
  background: #e2e8f0;
  color: #4a5568;
  border-radius: 8px;
  padding: 0 5px;
  font-size: 9px;
}
.stab-count.live-c { background: #e84c6b; color: #fff; }

.sidebar-tools {
  padding: 6px 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.time-filter { display: flex; }
.time-btn {
  background: #e84c6b;
  border: none;
  color: #fff;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}
.search-box {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 3px 6px;
  gap: 4px;
}
.search-icon { font-size: 10px; color: #94a3b8; }
.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #1a202c;
  font-size: 11px;
  width: 100%;
}
.search-input::placeholder { color: #94a3b8; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  cursor: pointer;
  border-top: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.section-header:hover { color: #1a2d4e; background: #f1f5f9; }
.chevron {
  font-size: 14px;
  transition: transform 0.2s;
  display: inline-block;
}
.chevron.open { transform: rotate(90deg); }

</style>
