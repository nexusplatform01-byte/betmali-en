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

        <!-- Section title -->
        <div class="section-title">
          <div class="play-now-label">PLAY NOW</div>
          <div class="popular-label">Popular Leagues</div>
        </div>

        <!-- Match league cards row -->
        <div class="league-match-scroll-wrap">
          <div class="league-match-scroll">
            <div
              v-for="(lm, idx) in leagueMatchCards"
              :key="idx"
              class="lm-card"
            >
              <!-- Card top: flag + league name -->
              <div class="lm-card-top">
                <span class="lm-flag">{{ lm.flag }}</span>
                <span class="lm-league-name">{{ lm.leagueName }}</span>
              </div>

              <!-- Card middle: team logos + time -->
              <div class="lm-teams-row">
                <div class="lm-team">
                  <div class="lm-team-logo" :style="{ background: lm.team1Color }">
                    <span class="lm-team-abbr">{{ lm.team1Abbr }}</span>
                  </div>
                  <div class="lm-team-name">{{ lm.team1 }}</div>
                </div>

                <div class="lm-center">
                  <div class="lm-when">Tomorrow</div>
                  <div class="lm-time">{{ lm.time }}</div>
                </div>

                <div class="lm-team">
                  <div class="lm-team-logo" :style="{ background: lm.team2Color }">
                    <span class="lm-team-abbr">{{ lm.team2Abbr }}</span>
                  </div>
                  <div class="lm-team-name">{{ lm.team2 }}</div>
                </div>
              </div>

              <!-- Card bottom: odds row -->
              <div class="lm-odds-strip">
                <div
                  class="lm-odds-pair"
                  :class="{ 'odds-pair-active': lm.activeOdd === 1 }"
                  @click="lm.activeOdd = lm.activeOdd === 1 ? 0 : 1"
                >
                  <span class="lm-odds-lbl">1</span>
                  <span class="lm-odds-num">{{ lm.odds[0] }}</span>
                </div>
                <div class="lm-pair-divider"></div>
                <div
                  class="lm-odds-pair"
                  :class="{ 'odds-pair-active': lm.activeOdd === 2 }"
                  @click="lm.activeOdd = lm.activeOdd === 2 ? 0 : 2"
                >
                  <span class="lm-odds-lbl">X</span>
                  <span class="lm-odds-num">{{ lm.odds[1] }}</span>
                </div>
                <div class="lm-pair-divider"></div>
                <div
                  class="lm-odds-pair"
                  :class="{ 'odds-pair-active': lm.activeOdd === 3 }"
                  @click="lm.activeOdd = lm.activeOdd === 3 ? 0 : 3"
                >
                  <span class="lm-odds-lbl">2</span>
                  <span class="lm-odds-num">{{ lm.odds[2] }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Scroll arrow -->
          <button class="scroll-right-btn">›</button>
        </div>

        <!-- League image cards -->
        <div class="league-img-cards-row">
          <div
            v-for="card in leagueImageCards"
            :key="card.id"
            class="lig-card"
            :style="{ background: card.gradient }"
          >
            <!-- Logo top-left -->
            <div class="lig-logo-wrap">
              <div class="lig-logo" :style="{ background: card.logoBackground }">
                <span class="lig-logo-icon">{{ card.logoIcon }}</span>
              </div>
              <div class="lig-logo-text">{{ card.logoText }}</div>
            </div>

            <!-- Player silhouette area (CSS art) -->
            <div class="lig-player" :style="{ '--pc': card.playerColor, '--pc2': card.playerColor2 }">
              <div class="player-body"></div>
              <div class="player-head"></div>
              <div class="player-arm-l"></div>
              <div class="player-arm-r"></div>
            </div>
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
import { ref, reactive } from 'vue'
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

const leagueMatchCards = reactive([
  {
    flag: '🇫🇷', leagueName: 'Liga France 1',
    team1: 'Marsel', team1Abbr: 'OM', team1Color: 'linear-gradient(135deg,#0080cc,#00aaff)',
    team2: 'PSG', team2Abbr: 'PSG', team2Color: 'linear-gradient(135deg,#003087,#0047ba)',
    time: '01:30', odds: ['21.00', '8.20', '1.13'], activeOdd: 0,
  },
  {
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', leagueName: 'Premier League',
    team1: 'Marsel', team1Abbr: 'ARS', team1Color: 'linear-gradient(135deg,#EF0107,#9C1721)',
    team2: 'PSG', team2Abbr: 'CHE', team2Color: 'linear-gradient(135deg,#034694,#0057a8)',
    time: '01:30', odds: ['21.00', '8.20', '1.13'], activeOdd: 0,
  },
  {
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', leagueName: 'Premier League',
    team1: 'Marsel', team1Abbr: 'MUN', team1Color: 'linear-gradient(135deg,#DA291C,#a61a10)',
    team2: 'PSG', team2Abbr: 'LIV', team2Color: 'linear-gradient(135deg,#C8102E,#8b001f)',
    time: '01:30', odds: ['21.00', '8.20', '1.13'], activeOdd: 1,
  },
  {
    flag: '🇫🇷', leagueName: 'Liga France 1',
    team1: 'Marsel', team1Abbr: 'OM', team1Color: 'linear-gradient(135deg,#0080cc,#00aaff)',
    team2: 'PSG', team2Abbr: 'PSG', team2Color: 'linear-gradient(135deg,#003087,#0047ba)',
    time: '01:30', odds: ['21.00', '8.20', '1.13'], activeOdd: 0,
  },
  {
    flag: '🇪🇸', leagueName: 'LaLiga',
    team1: 'Marsel', team1Abbr: 'RMA', team1Color: 'linear-gradient(135deg,#FEBE10,#c99a00)',
    team2: 'PSG', team2Abbr: 'FCB', team2Color: 'linear-gradient(135deg,#004D98,#a50044)',
    time: '01:30', odds: ['21.00', '8.20', '1.13'], activeOdd: 0,
  },
])

const leagueImageCards = [
  {
    id: 'bundesliga',
    gradient: 'linear-gradient(135deg, #e8a000 0%, #d32f2f 60%, #b71c1c 100%)',
    logoBackground: '#fff',
    logoIcon: '⚽',
    logoText: 'BUNDESLIGA',
    playerColor: '#dc143c',
    playerColor2: '#fff',
  },
  {
    id: 'premier',
    gradient: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #023e8a 100%)',
    logoBackground: '#fff',
    logoIcon: '🦁',
    logoText: 'Premier\nLeague',
    playerColor: '#6de7ff',
    playerColor2: '#fff',
  },
  {
    id: 'seriea',
    gradient: 'linear-gradient(135deg, #ff6b35 0%, #d32f2f 50%, #880000 100%)',
    logoBackground: '#fff',
    logoIcon: '⭐',
    logoText: 'SERIE A',
    playerColor: '#ff5252',
    playerColor2: '#000',
  },
  {
    id: 'ligue1',
    gradient: 'linear-gradient(135deg, #1a1a4e 0%, #2d2d8f 50%, #4040c0 100%)',
    logoBackground: '#fff',
    logoIcon: '🏅',
    logoText: 'LIGUE 1',
    playerColor: '#5c6bc0',
    playerColor2: '#fff',
  },
  {
    id: 'laliga',
    gradient: 'linear-gradient(135deg, #ff8f00 0%, #e65100 60%, #bf360c 100%)',
    logoBackground: '#fff',
    logoIcon: '🔶',
    logoText: 'LaLiga',
    playerColor: '#ffcc02',
    playerColor2: '#a50044',
  },
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
.hero-text { position: relative; z-index: 2; }
.hero-sport {
  font-size: 13px; font-weight: 700; color: #fff;
  letter-spacing: 3px; text-transform: uppercase; opacity: 0.9;
}
.hero-betting {
  font-size: 36px; font-weight: 900; color: #fff;
  letter-spacing: 2px; text-transform: uppercase;
  font-style: italic; line-height: 1;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.4);
}
.hero-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 70%);
}

/* Sport categories */
.sport-categories {
  display: flex; align-items: center;
  background: #1a1d2e; border-bottom: 1px solid #252840;
  overflow-x: auto; flex-shrink: 0;
  scrollbar-width: none; padding: 0 4px;
}
.sport-categories::-webkit-scrollbar { display: none; }
.sport-cat {
  display: flex; flex-direction: column; align-items: center;
  padding: 6px 10px; cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s; min-width: 60px; gap: 1px;
}
.sport-cat:hover { border-bottom-color: #3a3f5c; }
.sport-cat.active { border-bottom-color: #e84c6b; }
.cat-icon { font-size: 16px; }
.cat-name { font-size: 10px; font-weight: 600; color: #c8cfe0; white-space: nowrap; }
.sport-cat.active .cat-name { color: #fff; }
.cat-count { font-size: 9px; color: #5a6080; }
.cat-more {
  background: none; border: none; color: #9ba3b8;
  font-size: 18px; cursor: pointer; padding: 0 8px; flex-shrink: 0;
}

/* Content scroll */
.content-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; }

/* ─── Popular Leagues ─────────────────────────────── */
.popular-leagues-section {
  padding: 14px 0 4px;
  background: #12141f;
}

.section-title { padding: 0 12px 10px; }
.play-now-label {
  font-size: 10px; font-weight: 700; color: #7a8299;
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.popular-label {
  font-size: 16px; font-weight: 800; color: #fff;
}

/* League match cards */
.league-match-scroll-wrap {
  display: flex; align-items: center;
  gap: 0; padding: 0 12px;
  position: relative;
}

.league-match-scroll {
  display: flex; gap: 8px;
  overflow-x: auto; scrollbar-width: none;
  flex: 1;
  padding-bottom: 2px;
}
.league-match-scroll::-webkit-scrollbar { display: none; }

.lm-card {
  min-width: 200px;
  max-width: 220px;
  flex-shrink: 0;
  background: #0e1628;
  border: 1px solid #1e2a42;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.lm-card:hover { border-color: #2e3f64; }

/* Card top */
.lm-card-top {
  display: flex; align-items: center; gap: 5px;
  padding: 8px 10px 6px;
  border-bottom: 1px solid #1e2a42;
}
.lm-flag { font-size: 14px; }
.lm-league-name {
  font-size: 11px; font-weight: 700; color: #c8cfe0;
}

/* Card middle – teams + time */
.lm-teams-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 10px 8px;
  gap: 4px;
}

.lm-team {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  flex: 1;
}
.lm-team-logo {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}
.lm-team-abbr {
  font-size: 9px; font-weight: 800; color: #fff;
  text-transform: uppercase; letter-spacing: -0.5px;
}
.lm-team-name {
  font-size: 10px; font-weight: 600; color: #9ba3b8; text-align: center;
}

.lm-center {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  flex: 0 0 auto;
}
.lm-when {
  font-size: 9px; color: #9ba3b8; font-weight: 500;
}
.lm-time {
  font-size: 18px; font-weight: 800; color: #fff;
  letter-spacing: -0.5px; line-height: 1;
}

/* Odds strip */
.lm-odds-strip {
  display: flex;
  align-items: stretch;
  border-top: 1px solid #1e2a42;
}

/* Each pair = label + value side by side */
.lm-odds-pair {
  flex: 1;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.12s;
  min-width: 0;
}
.lm-odds-pair:hover:not(.odds-pair-active) {
  background: #172035;
}

.lm-pair-divider {
  width: 1px;
  background: #1e2a42;
  align-self: stretch;
  flex-shrink: 0;
}

/* Label cell (1 / X / 2) */
.lm-odds-lbl {
  flex: 0 0 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 2px;
  font-size: 10px;
  font-weight: 700;
  color: #5a6a88;
  border-right: 1px solid #1e2a42;
  transition: color 0.12s;
}

/* Value cell (21.00 / 8.20 / 1.13) */
.lm-odds-num {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 2px;
  font-size: 11px;
  font-weight: 800;
  color: #dde4f0;
  transition: color 0.12s;
}

/* Active pair — both label and value highlight together */
.lm-odds-pair.odds-pair-active {
  background: #e84c6b;
}
.lm-odds-pair.odds-pair-active .lm-odds-lbl {
  color: #fff;
  border-right-color: rgba(255,255,255,0.25);
}
.lm-odds-pair.odds-pair-active .lm-odds-num {
  color: #fff;
}

/* Scroll right button */
.scroll-right-btn {
  background: #7c3aed;
  border: none;
  color: #fff;
  width: 32px; height: 32px;
  border-radius: 50%;
  font-size: 18px; font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-left: 8px;
  transition: background 0.15s;
  box-shadow: 0 2px 8px rgba(124,58,237,0.4);
}
.scroll-right-btn:hover { background: #6d28d9; }

/* ─── League Image Cards ──────────────────────────── */
.league-img-cards-row {
  display: flex; gap: 6px;
  padding: 12px 12px 0;
  overflow-x: auto; scrollbar-width: none;
}
.league-img-cards-row::-webkit-scrollbar { display: none; }

.lig-card {
  min-width: 140px;
  height: 148px;
  border-radius: 8px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex; align-items: flex-start;
}
.lig-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

/* League logo top-left */
.lig-logo-wrap {
  position: absolute;
  top: 10px; left: 10px;
  display: flex; flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  z-index: 2;
}
.lig-logo {
  width: 36px; height: 36px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.lig-logo-icon { font-size: 18px; }
.lig-logo-text {
  font-size: 9px; font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
  white-space: pre;
}

/* CSS player silhouette */
.lig-player {
  position: absolute;
  bottom: 0;
  right: -8px;
  width: 85px;
  height: 135px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.player-body {
  position: absolute;
  bottom: 0;
  width: 34px;
  height: 72px;
  background: var(--pc);
  border-radius: 14px 14px 6px 6px;
  left: 50%;
  transform: translateX(-50%);
}
.player-head {
  position: absolute;
  bottom: 68px;
  width: 22px;
  height: 26px;
  background: #c8a882;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
}
.player-arm-l {
  position: absolute;
  bottom: 28px;
  left: 4px;
  width: 14px;
  height: 44px;
  background: var(--pc);
  border-radius: 8px;
  transform: rotate(16deg);
  transform-origin: top center;
}
.player-arm-r {
  position: absolute;
  bottom: 28px;
  right: 4px;
  width: 14px;
  height: 44px;
  background: var(--pc2);
  border-radius: 8px;
  transform: rotate(-16deg);
  transform-origin: top center;
}

/* ─── Bottom promo ────────────────────────────────── */
.bottom-promo {
  margin: 12px;
  background: linear-gradient(135deg, #7b1fa2 0%, #5c35c9 50%, #1565c0 100%);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.bp-sport {
  font-size: 10px; color: rgba(255,255,255,0.8);
  letter-spacing: 3px; font-weight: 700;
}
.bp-betting {
  font-size: 22px; font-weight: 900; color: #fff;
  font-style: italic; letter-spacing: 1px;
}
.bp-center { flex: 1; }
.bp-title {
  font-size: 12px; font-weight: 800; color: #ffd700;
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
}
.bp-code {
  display: flex; align-items: center; gap: 6px;
  background: rgba(0,0,0,0.3);
  border-radius: 4px; padding: 4px 8px; margin-bottom: 6px;
}
.code-text { font-size: 11px; color: #fff; font-weight: 600; letter-spacing: 1px; }
.lock-icon { font-size: 12px; }
.copy-btn {
  background: #ffd700; border: none; color: #1a1d2e;
  padding: 4px 12px; border-radius: 4px;
  font-size: 10px; font-weight: 800; cursor: pointer;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.copy-btn:hover { background: #ffcc00; }
</style>
