<template>
  <div class="match-section">
    <!-- League header row -->
    <div class="league-header">
      <div class="league-left">
        <span class="league-flag">{{ league.flag }}</span>
        <span class="league-sport">{{ league.sport }}</span>
        <span class="league-sep">›</span>
        <span class="league-name">{{ league.name }}</span>
      </div>
      <div class="odds-headers">
        <span class="oh">1</span>
        <span class="oh">X</span>
        <span class="oh">2</span>
        <span class="oh">1X</span>
        <span class="oh">X2</span>
        <span class="oh">12</span>
      </div>
    </div>

    <!-- Match rows -->
    <div v-for="match in matches" :key="match.id" class="match-row">
      <div class="match-info">
        <div class="match-date">{{ match.date }}</div>
        <div class="match-time">{{ match.time }}</div>
        <div class="match-actions">
          <button class="action-btn">☆</button>
          <button class="action-btn">📊</button>
          <button class="action-btn">📺</button>
        </div>
        <div class="match-teams">
          <div class="team">{{ match.team1 }}</div>
          <div class="team">{{ match.team2 }}</div>
        </div>
        <div class="market-count">
          <span class="mc-value">660 ›</span>
        </div>
      </div>
      <div class="match-odds">
        <OddsButton :value="match.odds1" :active="match.highlighted === 'odds1'" />
        <OddsButton :value="match.oddsX" :active="match.highlighted === 'oddsX'" />
        <OddsButton :value="match.odds2" :active="match.highlighted === 'odds2'" />
        <OddsButton :value="match.odds1x" :active="match.highlighted === 'odds1x'" />
        <OddsButton :value="match.oddsX2" :active="match.highlighted === 'oddsX2'" />
        <OddsButton :value="match.odds12" :active="match.highlighted === 'odds12'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OddsButton from './OddsButton.vue'

interface Match {
  id: number
  date: string
  time: string
  team1: string
  team2: string
  odds1: string
  oddsX: string
  odds2: string
  odds1x: string
  oddsX2: string
  odds12: string
  highlighted: string
}

interface League {
  flag: string
  sport: string
  name: string
}

defineProps<{
  league: League
  matches: Match[]
}>()
</script>

<style scoped>
.match-section {
  background: #1a1d2e;
  margin-bottom: 4px;
}

.league-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: #141624;
  border-bottom: 1px solid #252840;
  border-top: 1px solid #252840;
}
.league-left {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}
.league-flag { font-size: 12px; }
.league-sport {
  color: #9ba3b8;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
}
.league-sep { color: #5a6080; }
.league-name { color: #fff; font-weight: 600; }

.odds-headers {
  display: flex;
  gap: 2px;
}
.oh {
  width: 38px;
  text-align: center;
  font-size: 10px;
  color: #9ba3b8;
  font-weight: 600;
}

.match-row {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-bottom: 1px solid #1f2236;
  transition: background 0.12s;
}
.match-row:hover { background: #1f2236; }

.match-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.match-date {
  font-size: 9px;
  color: #5a6080;
  min-width: 38px;
}
.match-time {
  font-size: 9px;
  color: #9ba3b8;
  min-width: 36px;
}
.match-actions {
  display: flex;
  gap: 2px;
}
.action-btn {
  background: none;
  border: none;
  color: #5a6080;
  cursor: pointer;
  font-size: 10px;
  padding: 1px;
  transition: color 0.12s;
}
.action-btn:hover { color: #9ba3b8; }

.match-teams {
  flex: 1;
  min-width: 0;
}
.team {
  font-size: 11px;
  color: #c8cfe0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}
.team:hover { color: #fff; cursor: pointer; }

.market-count {
  margin-left: 4px;
  flex-shrink: 0;
}
.mc-value {
  font-size: 10px;
  color: #5a6080;
  background: #252840;
  border-radius: 3px;
  padding: 1px 4px;
  cursor: pointer;
}
.mc-value:hover { color: #9ba3b8; }

.match-odds {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}
</style>
