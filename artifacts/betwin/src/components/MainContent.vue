<template>
  <main class="main-content">
    <!-- Hero banner -->
    <div class="hero-banner">
      <div class="hero-text">
        <div class="hero-sport">SPORT</div>
        <div class="hero-betting">BETTING</div>
      </div>
      <div class="hero-overlay"></div>
    </div>

    <!-- Sport category icons -->
    <div class="sport-categories">
      <div
        v-for="cat in sportCategories"
        :key="cat.name"
        class="sport-cat"
        :class="{ active: activeCategory === cat.name }"
        @click="activeCategory = cat.name"
      >
        <div class="cat-icon">{{ cat.icon }}</div>
        <div class="cat-name">{{ cat.name }}</div>
        <div class="cat-count">{{ cat.events }} events</div>
      </div>
      <button class="cat-more">›</button>
    </div>

    <!-- Scrollable content area -->
    <div class="content-scroll">

      <!-- First match section -->
      <MatchSection
        :league="{ flag: '🇹🇷', sport: 'Soccer', name: 'Turkiye Kupasi' }"
        :matches="matchesGroup1"
      />

      <!-- Popular Leagues -->
      <div class="popular-leagues-section">
        <div class="section-title">
          <span class="play-now">PLAY NOW</span>
          <span class="popular">Popular Leagues</span>
        </div>
        <div class="league-cards-scroll">
          <div v-for="league in popularLeagues" :key="league.name" class="league-card-wrap">
            <div
              class="league-card"
              :style="{ background: league.gradient }"
            >
              <div class="league-card-inner">
                <div class="league-logo">{{ league.icon }}</div>
                <div class="league-matches">
                  <div class="lm-row">
                    <span class="lm-time">{{ league.time }}</span>
                    <span class="lm-teams">{{ league.teams }}</span>
                    <div class="lm-odds-row">
                      <button class="lm-odds highlighted">{{ league.odds[0] }}</button>
                      <button class="lm-odds">{{ league.odds[1] }}</button>
                      <button class="lm-odds">{{ league.odds[2] }}</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="league-name-tag">{{ league.league }}</div>
            </div>
          </div>
          <button class="scroll-arrow right-arrow">›</button>
        </div>

        <!-- League image cards -->
        <div class="league-image-cards">
          <div
            v-for="card in leagueImageCards"
            :key="card.name"
            class="league-img-card"
            :style="{ background: card.gradient }"
          >
            <div class="lic-badge">{{ card.badge }}</div>
            <div class="lic-name">{{ card.name }}</div>
          </div>
        </div>
      </div>

      <!-- Second match section -->
      <MatchSection
        :league="{ flag: '🇹🇷', sport: 'Soccer', name: 'Turkiye Kupasi' }"
        :matches="matchesGroup2"
      />

      <!-- Third match section -->
      <MatchSection
        :league="{ flag: '🇹🇷', sport: 'Soccer', name: 'Turkiye Kupasi' }"
        :matches="matchesGroup3"
      />

      <!-- Bottom promo banner -->
      <div class="bottom-promo">
        <div class="bp-left">
          <div class="bp-sport">SPORT</div>
          <div class="bp-betting">BETTING</div>
        </div>
        <div class="bp-center">
          <div class="bp-title">FREE BONUS</div>
          <div class="bp-code">
            <span class="code-text">23A4 23A4 K5/241 F541 FD41</span>
            <span class="lock-icon">🔒</span>
          </div>
          <button class="copy-btn">COPY THE CODE</button>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MatchSection from './MatchSection.vue'

const activeCategory = ref('Soccer')

const sportCategories = [
  { name: 'Soccer', icon: '⚽', events: '1041' },
  { name: 'Basketball', icon: '🏀', events: '104' },
  { name: 'Tennis', icon: '🎾', events: '104' },
  { name: 'Ice Hockey', icon: '🏒', events: '1041' },
  { name: 'Volleyball', icon: '🏐', events: '104' },
  { name: 'Handball', icon: '🤾', events: '104' },
  { name: 'Snooker', icon: '🎱', events: '104' },
  { name: 'Darts', icon: '🎯', events: '104' },
  { name: 'Bandy', icon: '🏑', events: '104' },
  { name: 'Cricket', icon: '🏏', events: '104' },
  { name: 'Floorball', icon: '🏒', events: '104' },
]

const makeMatches = () => [
  { id: 1, date: '10.01.25', time: '4:00 PM', team1: 'Real Madrid', team2: 'Manchester United', odds1: '1.35', oddsX: '3.10', odds2: '2.31', odds1x: '5.30', oddsX2: '1.16', odds12: '1.36', highlighted: '' },
  { id: 2, date: '10.01.25', time: '4:00 PM', team1: 'Real Madrid', team2: 'Manchester United', odds1: '1.35', oddsX: '3.10', odds2: '2.31', odds1x: '5.30', oddsX2: '1.16', odds12: '1.36', highlighted: 'odds2' },
  { id: 3, date: '10.01.25', time: '4:05 PM', team1: 'Real Madrid', team2: 'Manchester United', odds1: '1.35', oddsX: '5.10', odds2: '2.31', odds1x: '5.30', oddsX2: '1.16', odds12: '1.36', highlighted: 'oddsX' },
  { id: 4, date: '10.01.25', time: '4:05 PM', team1: 'Real Madrid', team2: 'Manchester United', odds1: '1.35', oddsX: '3.10', odds2: '2.31', odds1x: '5.30', oddsX2: '1.10', odds12: '1.36', highlighted: '' },
  { id: 5, date: '10.01.25', time: '4:05 PM', team1: 'Real Madrid', team2: 'Manchester United', odds1: '1.35', oddsX: '3.10', odds2: '2.31', odds1x: '5.30', oddsX2: '1.16', odds12: '1.36', highlighted: 'odds1' },
]

const matchesGroup1 = makeMatches()
const matchesGroup2 = makeMatches()
const matchesGroup3 = makeMatches()

const popularLeagues = [
  {
    name: 'Liga France 1',
    icon: '⚽',
    league: 'Liga France 1',
    time: 'Tomorrow',
    teams: 'PSG - OM',
    odds: ['1.50', '8.29', '1.18'],
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)',
  },
  {
    name: 'Premier League',
    icon: '⚽',
    league: 'Premier League',
    time: 'Tomorrow',
    teams: 'Arsenal - Chelsea',
    odds: ['2.10', '3.40', '3.20'],
    gradient: 'linear-gradient(135deg, #6b1e1e 0%, #a83232 100%)',
  },
  {
    name: 'Premier League',
    icon: '⚽',
    league: 'Premier League',
    time: 'Tomorrow',
    teams: 'Man Utd - Liverpool',
    odds: ['3.50', '3.10', '2.00'],
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #c62828 100%)',
  },
  {
    name: 'Liga France 2',
    icon: '⚽',
    league: 'Liga France',
    time: 'Tomorrow',
    teams: 'Lyon - Monaco',
    odds: ['1.90', '3.60', '4.00'],
    gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
  },
]

const leagueImageCards = [
  { name: 'Bundesliga', badge: '🇩🇪 BL', gradient: 'linear-gradient(135deg, #b71c1c 0%, #7f0000 100%)' },
  { name: 'Premier League', badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PL', gradient: 'linear-gradient(135deg, #4a148c 0%, #1565c0 100%)' },
  { name: 'Ligue 1', badge: '🇫🇷 L1', gradient: 'linear-gradient(135deg, #880e4f 0%, #c2185b 100%)' },
  { name: 'Liga', badge: '🇵🇹 LG', gradient: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)' },
  { name: 'LaLiga', badge: '🇪🇸 LL', gradient: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)' },
]
</script>

<style scoped>
.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #12141f;
}

/* Hero Banner */
.hero-banner {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #7b1fa2 0%, #5c35c9 35%, #1565c0 70%, #0288d1 100%);
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  padding: 12px 20px;
}
.hero-text {
  position: relative;
  z-index: 2;
}
.hero-sport {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.9;
}
.hero-betting {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-style: italic;
  line-height: 1;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.4);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 70%);
}

/* Sport categories */
.sport-categories {
  display: flex;
  align-items: center;
  background: #1a1d2e;
  border-bottom: 1px solid #252840;
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: none;
  padding: 0 4px;
}
.sport-categories::-webkit-scrollbar { display: none; }
.sport-cat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s;
  min-width: 60px;
  gap: 1px;
}
.sport-cat:hover { border-bottom-color: #3a3f5c; }
.sport-cat.active { border-bottom-color: #e84c6b; }
.cat-icon { font-size: 16px; }
.cat-name {
  font-size: 10px;
  font-weight: 600;
  color: #c8cfe0;
  white-space: nowrap;
}
.sport-cat.active .cat-name { color: #fff; }
.cat-count { font-size: 9px; color: #5a6080; }
.cat-more {
  background: none;
  border: none;
  color: #9ba3b8;
  font-size: 18px;
  cursor: pointer;
  padding: 0 8px;
  flex-shrink: 0;
}

/* Content scroll */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Popular Leagues */
.popular-leagues-section {
  padding: 10px 0;
  background: #12141f;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px 8px;
}
.play-now {
  font-size: 10px;
  color: #9ba3b8;
  text-transform: uppercase;
  font-weight: 600;
}
.popular {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.league-cards-scroll {
  display: flex;
  gap: 8px;
  padding: 0 10px;
  overflow-x: auto;
  scrollbar-width: none;
  align-items: stretch;
  position: relative;
  padding-bottom: 4px;
}
.league-cards-scroll::-webkit-scrollbar { display: none; }
.league-card-wrap { min-width: 160px; flex-shrink: 0; }
.league-card {
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  padding: 8px;
  display: flex;
  flex-direction: column;
  min-height: 90px;
  position: relative;
  transition: transform 0.15s;
}
.league-card:hover { transform: scale(1.02); }
.league-card-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.league-logo { font-size: 20px; margin-bottom: 4px; }
.league-matches { flex: 1; }
.lm-row { display: flex; flex-direction: column; gap: 2px; }
.lm-time { font-size: 9px; color: rgba(255,255,255,0.7); }
.lm-teams { font-size: 10px; color: #fff; font-weight: 600; }
.lm-odds-row { display: flex; gap: 3px; margin-top: 4px; }
.lm-odds {
  background: rgba(0,0,0,0.3);
  border: none;
  color: #fff;
  border-radius: 3px;
  padding: 2px 5px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}
.lm-odds.highlighted { color: #e84c6b; }
.league-name-tag {
  font-size: 9px;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.scroll-arrow {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: center;
}
.scroll-arrow:hover { background: rgba(255,255,255,0.2); }

/* League image cards */
.league-image-cards {
  display: flex;
  gap: 6px;
  padding: 10px 10px 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.league-image-cards::-webkit-scrollbar { display: none; }
.league-img-card {
  min-width: 100px;
  height: 70px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  transition: transform 0.15s;
}
.league-img-card:hover { transform: scale(1.03); }
.lic-badge {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  background: rgba(0,0,0,0.3);
  border-radius: 3px;
  padding: 1px 4px;
  align-self: flex-start;
}
.lic-name {
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

/* Bottom promo */
.bottom-promo {
  margin: 10px;
  background: linear-gradient(135deg, #7b1fa2 0%, #5c35c9 50%, #1565c0 100%);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.bp-sport {
  font-size: 10px;
  color: rgba(255,255,255,0.8);
  letter-spacing: 3px;
  font-weight: 700;
}
.bp-betting {
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  font-style: italic;
  letter-spacing: 1px;
}
.bp-center { flex: 1; }
.bp-title {
  font-size: 12px;
  font-weight: 800;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.bp-code {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
  padding: 4px 8px;
  margin-bottom: 6px;
}
.code-text { font-size: 11px; color: #fff; font-weight: 600; letter-spacing: 1px; }
.lock-icon { font-size: 12px; }
.copy-btn {
  background: #ffd700;
  border: none;
  color: #1a1d2e;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.copy-btn:hover { background: #ffcc00; }
</style>
