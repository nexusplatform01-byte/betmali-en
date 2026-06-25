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
    <div v-if="outrightsOpen" class="subsection">
      <div class="sidebar-sport-item active">
        <span class="flag">🇹🇷</span>
        <span class="sport-name">Soccer</span>
        <span class="sport-badge">21</span>
      </div>
    </div>

    <!-- Top Championships -->
    <div class="section-header collapsible" @click="champOpen = !champOpen">
      <span>Top Championships</span>
      <span class="chevron" :class="{ open: champOpen }">›</span>
    </div>
    <div v-if="champOpen" class="subsection">
      <div
        v-for="champ in topChampionships"
        :key="champ.name"
        class="sidebar-sport-item"
        :class="{ active: activeChamp === champ.name }"
        @click="activeChamp = champ.name"
      >
        <span class="flag">{{ champ.flag }}</span>
        <span class="sport-name">{{ champ.name }}</span>
        <span class="champ-count">{{ champ.count }}</span>
      </div>
    </div>

    <!-- Popular Sports -->
    <div class="section-header collapsible" @click="popularOpen = !popularOpen">
      <span>Popular Sports</span>
      <span class="chevron" :class="{ open: popularOpen }">›</span>
    </div>
    <div v-if="popularOpen" class="subsection">
      <div
        v-for="sport in popularSports"
        :key="sport.name"
        class="sidebar-sport-item"
        :class="{ active: activeSport === sport.name }"
        @click="activeSport = sport.name"
      >
        <span class="flag">{{ sport.flag }}</span>
        <span class="sport-name">{{ sport.name }}</span>
        <span class="sport-badge">{{ sport.count }}</span>
      </div>
    </div>

    <!-- All Sports list -->
    <div class="sports-list">
      <div
        v-for="sport in allSports"
        :key="sport.name"
        class="sport-list-item"
        :class="{ active: activeSport === sport.name }"
        @click="activeSport = sport.name"
      >
        <div class="sport-left">
          <span class="sport-emoji">{{ sport.icon }}</span>
          <span class="sport-label">{{ sport.name }}</span>
        </div>
        <span class="sport-badge">{{ sport.count }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const outrightsOpen = ref(true)
const champOpen = ref(true)
const popularOpen = ref(true)
const activeChamp = ref('Premier League')
const activeSport = ref('Soccer')

const topChampionships = [
  { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: '' },
  { name: 'Bundesliga', flag: '🇩🇪', count: '' },
  { name: 'Serie A', flag: '🇮🇹', count: '' },
  { name: 'LaLiga', flag: '🇪🇸', count: '' },
  { name: 'Bundesliga', flag: '🇩🇪', count: '' },
  { name: 'Serie A', flag: '🇮🇹', count: '' },
  { name: 'LaLiga', flag: '🇪🇸', count: '' },
  { name: 'Liga 1 France', flag: '🇫🇷', count: '' },
]

const popularSports = [
  { name: 'Soccer', flag: '⚽', count: '1023' },
  { name: 'Internacional', flag: '🌍', count: '' },
  { name: 'Clubes Internacional', flag: '🌐', count: '' },
  { name: 'Internacional Youth', flag: '🌍', count: '' },
  { name: 'Turkey', flag: '🇹🇷', count: '' },
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: '' },
  { name: 'Spain', flag: '🇪🇸', count: '' },
  { name: 'Italy', flag: '🇮🇹', count: '' },
  { name: 'Germany', flag: '🇩🇪', count: '' },
  { name: 'France', flag: '🇫🇷', count: '' },
  { name: 'Turkey', flag: '🇹🇷', count: '' },
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: '' },
  { name: 'Spain', flag: '🇪🇸', count: '' },
  { name: 'Italy', flag: '🇮🇹', count: '' },
  { name: 'France', flag: '🇫🇷', count: '' },
  { name: 'Netherlands', flag: '🇳🇱', count: '' },
]

const allSports = [
  { name: 'Soccer', icon: '⚽', count: '1023' },
  { name: 'Basketball', icon: '🏀', count: '1023' },
  { name: 'Tennis', icon: '🎾', count: '1023' },
  { name: 'Ice Hockey', icon: '🏒', count: '1023' },
  { name: 'Volleyball', icon: '🏐', count: '1023' },
  { name: 'Handball', icon: '🤾', count: '1023' },
  { name: 'Snooker', icon: '🎱', count: '1023' },
  { name: 'Darts', icon: '🎯', count: '1023' },
  { name: 'Bandy', icon: '🏑', count: '1023' },
  { name: 'Cricket', icon: '🏏', count: '1023' },
  { name: 'Floorball', icon: '🏒', count: '1023' },
  { name: 'Badminton', icon: '🏸', count: '1023' },
  { name: 'Futsal', icon: '⚽', count: '1023' },
  { name: 'American Football', icon: '🏈', count: '1023' },
  { name: 'Field Hockey', icon: '🏑', count: '1023' },
  { name: 'Rugby', icon: '🏉', count: '1023' },
  { name: 'Table Tennis', icon: '🏓', count: '1023' },
  { name: 'Water Polo', icon: '🤽', count: '1023' },
]
</script>

<style scoped>
.left-sidebar {
  width: 175px;
  min-width: 175px;
  background: #1a1d2e;
  border-right: 1px solid #252840;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  font-size: 11px;
}
.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #252840;
}
.stab {
  flex: 1;
  background: #141624;
  border: none;
  color: #9ba3b8;
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
  background: #252840;
  color: #fff;
}
.stab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.stab-dot.sports { background: #4caf50; }
.stab-dot.live { background: #e84c6b; }
.stab-count {
  background: #3a3f5c;
  border-radius: 8px;
  padding: 0 5px;
  font-size: 9px;
}
.stab-count.live-c { background: #e84c6b; }

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
  background: #252840;
  border-radius: 3px;
  padding: 3px 6px;
  gap: 4px;
}
.search-icon { font-size: 10px; color: #9ba3b8; }
.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #e2e8f0;
  font-size: 11px;
  width: 100%;
}
.search-input::placeholder { color: #5a6080; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #9ba3b8;
  background: #141624;
  cursor: pointer;
  border-top: 1px solid #252840;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.section-header:hover { color: #fff; }
.chevron {
  font-size: 14px;
  transition: transform 0.2s;
  display: inline-block;
}
.chevron.open { transform: rotate(90deg); }

.subsection { padding: 2px 0; }
.sidebar-sport-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  gap: 5px;
  transition: background 0.15s;
}
.sidebar-sport-item:hover { background: #252840; }
.sidebar-sport-item.active { background: #252840; }
.flag { font-size: 12px; min-width: 16px; }
.sport-name {
  flex: 1;
  color: #c8cfe0;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.champ-count { color: #5a6080; font-size: 10px; }
.sport-badge {
  background: #e84c6b;
  color: #fff;
  border-radius: 8px;
  padding: 0 5px;
  font-size: 9px;
  font-weight: 700;
  min-width: 28px;
  text-align: center;
}

.sports-list { padding: 2px 0; }
.sport-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.sport-list-item:hover { background: #252840; }
.sport-list-item.active { background: #252840; }
.sport-left { display: flex; align-items: center; gap: 6px; }
.sport-emoji { font-size: 12px; }
.sport-label { color: #c8cfe0; font-size: 11px; }
</style>
