<template>
  <main class="main-content">
    <!-- Hero banner (hidden in detail view) -->
    <div class="hero-banner" v-if="!selectedMatch">
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
        <img :src="cat.icon" :alt="cat.name" class="cat-icon-img" loading="eager" fetchpriority="high" />
        <div class="cat-name">{{ cat.name }}</div>
      </div>
    </div>

    <!-- MATCH DETAIL VIEW -->
    <MatchDetail
      v-if="selectedMatch"
      :match="selectedMatch"
      :league="selectedLeague!"
      :initial-tab="selectedInitialTab"
      @close="selectedMatch = null"
    />

    <!-- NORMAL CONTENT (hidden when detail is open) -->
    <div v-else class="content-scroll">

      <!-- TOP MATCHES — live from API -->
      <TopMatchesSection @match-click="openMatchDetail" />

      <!-- Popular Leagues -->
      <div class="popular-leagues-section">

        <!-- Section title -->
        <div class="section-title">
          <div class="play-now-label">PLAY NOW</div>
          <div class="popular-label-row">
            <div class="popular-label">Popular Leagues</div>
            <div class="ai-badge">
              <span class="ai-spark">✦</span> AI Picks
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="leagueLoading" class="lm-loading">
          <div class="lm-spinner"></div>
          <span>AI is picking the best matches…</span>
        </div>

        <!-- Error state -->
        <div v-else-if="leagueError" class="lm-error-row">
          <span>⚠ {{ leagueError }}</span>
          <button class="lm-retry-btn" @click="leagueRefresh">Retry</button>
        </div>

        <!-- Match league cards row -->
        <div v-else class="league-match-scroll-wrap">
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
                  :class="{ 'odds-pair-active': lmOddActive(lm, 0) }"
                  @click="toggleLmOdd(lm, 0)"
                >
                  <span class="lm-odds-lbl">1</span>
                  <span class="lm-odds-num">{{ lm.odds[0] }}</span>
                </div>
                <div class="lm-pair-divider"></div>
                <div
                  class="lm-odds-pair"
                  :class="{ 'odds-pair-active': lmOddActive(lm, 1) }"
                  @click="toggleLmOdd(lm, 1)"
                >
                  <span class="lm-odds-lbl">X</span>
                  <span class="lm-odds-num">{{ lm.odds[1] }}</span>
                </div>
                <div class="lm-pair-divider"></div>
                <div
                  class="lm-odds-pair"
                  :class="{ 'odds-pair-active': lmOddActive(lm, 2) }"
                  @click="toggleLmOdd(lm, 2)"
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
            <div class="lig-logo-img-wrap">
              <img
                :src="card.logoUrl"
                :alt="card.logoText"
                class="lig-real-logo"
                @error="($event.target as HTMLImageElement).style.opacity = '0'"
              />
            </div>
            <div class="lig-card-name">{{ card.logoText }}</div>
          </div>
        </div>

      </div>

      <!-- Second match section -->
      <MatchSection
        :league="{ flag: '🇹🇷', sport: 'Soccer', name: 'Turkiye Kupasi' }"
        :matches="matchesGroup2"
        @match-click="openMatchDetail"
      />

      <!-- Third match section -->
      <MatchSection
        :league="{ flag: '🇹🇷', sport: 'Soccer', name: 'Turkiye Kupasi' }"
        :matches="matchesGroup3"
        @match-click="openMatchDetail"
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

    </div><!-- end v-else content-scroll -->
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MatchSection from './MatchSection.vue'
import TopMatchesSection from './TopMatchesSection.vue'
import MatchDetail from './MatchDetail.vue'
import { usePopularLeagueMatches } from '@/composables/usePopularLeagueMatches'
import { useBetSlip } from '@/composables/useBetSlip'

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
interface League { flag: string; sport: string; name: string }

const selectedMatch = ref<Match | null>(null)
const selectedLeague = ref<League | null>(null)
const selectedInitialTab = ref<string | undefined>(undefined)

function openMatchDetail({ match, league, initialTab }: { match: Match; league: League; initialTab?: string }) {
  selectedMatch.value = match
  selectedLeague.value = league
  selectedInitialTab.value = initialTab
}

const activeCategory = ref('Soccer')

const sportCategories = [
  { name: 'Soccer', icon: 'https://cdn3d.iconscout.com/3d/premium/thumb/soccer-ball-3d-icon-png-download-6655789.png', events: '1041' },
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

const { cards: leagueMatchCards, loading: leagueLoading, error: leagueError, refresh: leagueRefresh } = usePopularLeagueMatches()
const { toggleBet, hasBet } = useBetSlip()

function toggleLmOdd(lm: typeof leagueMatchCards.value[0], outcomeIdx: number) {
  const key = `lm-${lm.leagueName}-${lm.team1}-${lm.team2}-${outcomeIdx}`
  const label = outcomeIdx === 0 ? `Home Win (1)` : outcomeIdx === 1 ? 'Draw (X)' : 'Away Win (2)'
  const odds = lm.odds[outcomeIdx]
  if (odds === '-') return
  toggleBet({ key, label, odds, matchName: `${lm.team1} vs ${lm.team2}`, market: 'Match Result' })
}

function lmOddActive(lm: typeof leagueMatchCards.value[0], outcomeIdx: number) {
  return hasBet(`lm-${lm.leagueName}-${lm.team1}-${lm.team2}-${outcomeIdx}`)
}

const leagueImageCards = [
  {
    id: 'bundesliga',
    gradient: 'linear-gradient(135deg, #e8a000 0%, #d32f2f 60%, #b71c1c 100%)',
    logoUrl: '/sofascore-api/unique-tournament/35/image',
    logoText: 'BUNDESLIGA',
  },
  {
    id: 'premier',
    gradient: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #023e8a 100%)',
    logoUrl: '/sofascore-api/unique-tournament/17/image',
    logoText: 'Premier League',
  },
  {
    id: 'seriea',
    gradient: 'linear-gradient(135deg, #ff6b35 0%, #d32f2f 50%, #880000 100%)',
    logoUrl: '/sofascore-api/unique-tournament/23/image',
    logoText: 'SERIE A',
  },
  {
    id: 'ligue1',
    gradient: 'linear-gradient(135deg, #1a1a4e 0%, #2d2d8f 50%, #4040c0 100%)',
    logoUrl: '/sofascore-api/unique-tournament/34/image',
    logoText: 'LIGUE 1',
  },
  {
    id: 'laliga',
    gradient: 'linear-gradient(135deg, #ff8f00 0%, #e65100 60%, #bf360c 100%)',
    logoUrl: '/sofascore-api/unique-tournament/8/image',
    logoText: 'LaLiga',
  },
  {
    id: 'champions',
    gradient: 'linear-gradient(135deg, #0a0a2e 0%, #1a4a8f 50%, #2060c0 100%)',
    logoUrl: '/sofascore-api/unique-tournament/7/image',
    logoText: 'Champions League',
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
  scrollbar-width: none; padding: 4px 8px;
  border-radius: 0 0 10px 10px;
  gap: 2px;
}
.sport-categories::-webkit-scrollbar { display: none; }
.sport-cat {
  display: flex; flex-direction: row; align-items: center;
  padding: 5px 10px; cursor: pointer;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: background 0.15s, border-color 0.15s; gap: 6px;
  white-space: nowrap;
}
.sport-cat:hover { background: #252840; }
.sport-cat.active { background: #252840; border-color: #e84c6b; }
.cat-icon-img { width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; }
.cat-name { font-size: 10px; font-weight: 600; color: #c8cfe0; }
.sport-cat.active .cat-name { color: #fff; }

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
.popular-label-row {
  display: flex; align-items: center; gap: 10px;
}
.popular-label {
  font-size: 16px; font-weight: 800; color: #fff;
}
.ai-badge {
  display: flex; align-items: center; gap: 4px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
  font-size: 10px; font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 1px 6px rgba(124,58,237,0.5);
}
.ai-spark {
  font-size: 9px;
  color: #ffd700;
}

.lm-loading {
  display: flex; align-items: center; justify-content: center;
  gap: 10px;
  padding: 28px 12px;
  font-size: 12px; color: #9ba3b8;
}
.lm-spinner {
  width: 14px; height: 14px;
  border: 2px solid #7c3aed44;
  border-top-color: #a855f7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.lm-error-row {
  display: flex; align-items: center; justify-content: center;
  gap: 10px;
  padding: 20px 12px;
  font-size: 12px; color: #e84c6b;
}
.lm-retry-btn {
  background: #7c3aed; border: none; color: #fff;
  padding: 3px 10px; border-radius: 4px;
  font-size: 11px; cursor: pointer;
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
  min-width: 120px;
  height: 130px;
  border-radius: 10px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 8px;
}
.lig-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.6);
}

.lig-logo-img-wrap {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  overflow: hidden;
  flex-shrink: 0;
}

.lig-real-logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
  transition: opacity 0.3s;
}

.lig-card-name {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.7);
  line-height: 1.3;
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
