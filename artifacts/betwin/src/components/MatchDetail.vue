<template>
  <div class="match-detail">

    <!-- Top bar: back + breadcrumb -->
    <div class="detail-topbar">
      <button class="back-btn" @click="emit('close')">
        <span class="back-arrow">‹</span> Back
      </button>
      <div class="breadcrumb">
        <span class="bc-flag">{{ league.flag }}</span>
        <span class="bc-sport">{{ league.sport }}</span>
        <span class="bc-sep">›</span>
        <span class="bc-name">{{ league.name }}</span>
        <span class="bc-sep">›</span>
        <span class="bc-match">{{ match.team1 }} vs {{ match.team2 }}</span>
      </div>
      <div class="detail-tabs">
        <button
          v-for="tab in detailTabs"
          :key="tab"
          class="dtab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >{{ tab }}</button>
      </div>
    </div>

    <!-- Main layout -->
    <div class="detail-body">

      <!-- Left/main column -->
      <div class="detail-main">

        <!-- HEAD TO HEAD card -->
        <div class="h2h-card">
          <div class="h2h-title">
            <span class="h2h-icon">⚔</span>
            HEAD TO HEAD
          </div>

          <div class="h2h-content">
            <!-- Team 1 -->
            <div class="h2h-team">
              <div class="h2h-logo t1-bg">
                <span class="h2h-abbr">{{ team1Abbr }}</span>
              </div>
              <div class="h2h-club">FC {{ match.team1.split(' ')[0] }} M.</div>
              <div class="h2h-name">{{ match.team1 }}</div>
              <div class="h2h-badge win">Win</div>
              <div class="h2h-stats">
                <div class="hstat">
                  <span class="hstat-label">Avg. goals/match</span>
                  <span class="hstat-val">147</span>
                </div>
                <div class="hstat">
                  <span class="hstat-label">Best score</span>
                  <span class="hstat-val">5 : 0</span>
                </div>
              </div>
            </div>

            <!-- Chart middle -->
            <div class="h2h-chart-area">
              <div class="h2h-vs-badge">
                <span class="vs-t1">{{ team1Abbr }}</span>
                <span class="vs-mid">VS</span>
                <span class="vs-t2">{{ team2Abbr }}</span>
              </div>
              <svg class="h2h-chart" viewBox="0 0 240 80" preserveAspectRatio="none">
                <!-- Grid lines -->
                <line x1="0" y1="40" x2="240" y2="40" stroke="#252840" stroke-width="1"/>
                <!-- Team 1 line (red/pink) -->
                <polyline
                  points="0,60 30,45 60,30 90,50 120,25 150,40 180,20 210,35 240,15"
                  fill="none" stroke="#e84c6b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                />
                <path
                  d="M0,60 30,45 60,30 90,50 120,25 150,40 180,20 210,35 240,15 L240,80 L0,80 Z"
                  fill="url(#grad1)" opacity="0.25"
                />
                <!-- Team 2 line (blue) -->
                <polyline
                  points="0,20 30,35 60,55 90,30 120,55 150,38 180,60 210,45 240,50"
                  fill="none" stroke="#4a90e2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                />
                <path
                  d="M0,20 30,35 60,55 90,30 120,55 150,38 180,60 210,45 240,50 L240,80 L0,80 Z"
                  fill="url(#grad2)" opacity="0.2"
                />
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#e84c6b" />
                    <stop offset="100%" stop-color="#e84c6b" stop-opacity="0" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#4a90e2" />
                    <stop offset="100%" stop-color="#4a90e2" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="chart-legend">
                <span class="leg-item t1">● {{ match.team1 }}</span>
                <span class="leg-item t2">● {{ match.team2 }}</span>
              </div>
            </div>

            <!-- Team 2 -->
            <div class="h2h-team right">
              <div class="h2h-logo t2-bg">
                <span class="h2h-abbr">{{ team2Abbr }}</span>
              </div>
              <div class="h2h-club">FC {{ match.team2.split(' ')[0] }}</div>
              <div class="h2h-name">{{ match.team2 }}</div>
              <div class="h2h-badge win-t2">Win</div>
              <div class="h2h-stats">
                <div class="hstat">
                  <span class="hstat-label">Avg. goals/match</span>
                  <span class="hstat-val">147</span>
                </div>
                <div class="hstat">
                  <span class="hstat-label">Best score</span>
                  <span class="hstat-val">1 : 0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live match card -->
        <div class="live-card">
          <!-- Card header -->
          <div class="live-card-header">
            <div class="live-league-info">
              <span class="live-flag">{{ league.flag }}</span>
              <span class="live-league-name">{{ league.name }}</span>
              <span class="live-date">{{ match.date }}</span>
            </div>
            <div class="live-badge-wrap">
              <span class="live-badge">● LIVE</span>
            </div>
          </div>

          <!-- Teams + score -->
          <div class="live-teams-area">
            <!-- Team 1 side -->
            <div class="live-team-side">
              <div class="live-player-avatar t1-avatar">
                <span class="lpa-text">{{ team1Abbr }}</span>
              </div>
              <div class="live-team-info">
                <div class="lti-club">Paris Saint Germain</div>
                <div class="lti-name">{{ match.team1 }}</div>
              </div>
            </div>

            <!-- Score -->
            <div class="live-score-block">
              <div class="score-boxes">
                <div class="score-box">
                  <span class="score-num">{{ liveScore[0] }}</span>
                  <span class="score-lbl">HOME</span>
                </div>
                <div class="score-divider">
                  <div class="timer-display">{{ liveTimer }}</div>
                </div>
                <div class="score-box">
                  <span class="score-num">{{ liveScore[1] }}</span>
                  <span class="score-lbl">AWAY</span>
                </div>
              </div>
            </div>

            <!-- Team 2 side -->
            <div class="live-team-side right-side">
              <div class="live-player-avatar t2-avatar">
                <span class="lpa-text">{{ team2Abbr }}</span>
              </div>
              <div class="live-team-info right">
                <div class="lti-club">Arsenal London</div>
                <div class="lti-name">{{ match.team2 }}</div>
              </div>
            </div>
          </div>

          <!-- Stats bars -->
          <div class="live-stats-bars">
            <div class="stat-bar-group">
              <span class="sb-pct t1-pct">51%</span>
              <div class="sb-track">
                <div class="sb-fill t1-fill" style="width: 51%"></div>
              </div>
              <span class="sb-label">Possession</span>
              <div class="sb-track right">
                <div class="sb-fill t2-fill" style="width: 49%"></div>
              </div>
              <span class="sb-pct t2-pct">49%</span>
            </div>
            <div class="stat-bar-group">
              <span class="sb-pct t1-pct">12%</span>
              <div class="sb-track">
                <div class="sb-fill t1-fill" style="width: 12%"></div>
              </div>
              <span class="sb-label">Shots on target</span>
              <div class="sb-track right">
                <div class="sb-fill t2-fill" style="width: 22%"></div>
              </div>
              <span class="sb-pct t2-pct">22%</span>
            </div>
            <div class="stat-bar-group">
              <span class="sb-pct t1-pct">58%</span>
              <div class="sb-track">
                <div class="sb-fill t1-fill" style="width: 58%"></div>
              </div>
              <span class="sb-label">Passes</span>
              <div class="sb-track right">
                <div class="sb-fill t2-fill" style="width: 42%"></div>
              </div>
              <span class="sb-pct t2-pct">42%</span>
            </div>
          </div>

          <!-- Odds row at bottom -->
          <div class="live-odds-row">
            <div class="lo-pair active-pair">
              <span class="lo-lbl">1</span>
              <span class="lo-val">{{ match.odds1 }}</span>
            </div>
            <div class="lo-div"></div>
            <div class="lo-pair">
              <span class="lo-lbl">X</span>
              <span class="lo-val">{{ match.oddsX }}</span>
            </div>
            <div class="lo-div"></div>
            <div class="lo-pair">
              <span class="lo-lbl">2</span>
              <span class="lo-val">{{ match.odds2 }}</span>
            </div>
            <div class="lo-div"></div>
            <button class="lo-basket">🛒</button>
          </div>
        </div>

        <!-- Betting statistics radar section -->
        <div class="stats-card">
          <div class="stats-title">BETTING STATISTICS</div>
          <div class="stats-body">
            <div class="radar-wrap">
              <svg viewBox="0 0 120 120" class="radar-svg">
                <!-- Hexagon grid -->
                <polygon points="60,10 104,35 104,85 60,110 16,85 16,35" fill="none" stroke="#252840" stroke-width="1"/>
                <polygon points="60,25 91,43 91,77 60,95 29,77 29,43" fill="none" stroke="#252840" stroke-width="1"/>
                <polygon points="60,40 78,51 78,69 60,80 42,69 42,51" fill="none" stroke="#252840" stroke-width="1"/>
                <!-- Data shape team 1 -->
                <polygon points="60,20 95,50 85,88 35,88 25,50" fill="#e84c6b" fill-opacity="0.3" stroke="#e84c6b" stroke-width="1.5"/>
                <!-- Data shape team 2 -->
                <polygon points="60,32 88,55 78,82 42,82 32,55" fill="#4a90e2" fill-opacity="0.25" stroke="#4a90e2" stroke-width="1.5"/>
                <!-- Center -->
                <circle cx="60" cy="60" r="3" fill="#e84c6b"/>
              </svg>
            </div>
            <div class="stat-details">
              <div class="sd-row">
                <div class="sd-team">
                  <div class="sd-avatar t1-bg-sm">{{ team1Abbr[0] }}</div>
                  <div class="sd-name">{{ match.team1 }}</div>
                </div>
                <div class="sd-values">
                  <div class="sd-item"><span class="sd-lbl">Avg. goals/match</span><span class="sd-val">147</span></div>
                  <div class="sd-item"><span class="sd-lbl">Teams United</span><span class="sd-val">{{ match.team1 }}</span></div>
                  <div class="sd-item"><span class="sd-lbl">Avg. goals/match</span><span class="sd-val">147</span></div>
                  <div class="sd-item"><span class="sd-lbl">Best score 5:0</span><span class="sd-val"></span></div>
                </div>
                <div class="sd-team right-team">
                  <div class="sd-avatar t2-bg-sm">{{ team2Abbr[0] }}</div>
                  <div class="sd-name">{{ match.team2 }}</div>
                </div>
                <div class="sd-values">
                  <div class="sd-item"><span class="sd-lbl">Avg. goals/match</span><span class="sd-val">147</span></div>
                  <div class="sd-item"><span class="sd-lbl">Teams United</span><span class="sd-val">{{ match.team2 }}</span></div>
                  <div class="sd-item"><span class="sd-lbl">Avg. goals/match</span><span class="sd-val">147</span></div>
                  <div class="sd-item"><span class="sd-lbl">Best score 1:0</span><span class="sd-val"></span></div>
                </div>
              </div>
              <div class="show-more-btn-wrap">
                <button class="show-more-btn">SHOW MORE ›</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right column -->
      <div class="detail-right">

        <!-- Related matches -->
        <div class="related-card">
          <div class="related-title">Related Matches</div>
          <div
            v-for="rm in relatedMatches"
            :key="rm.id"
            class="rm-row"
          >
            <div class="rm-team-block">
              <div class="rm-logo" :style="{ background: rm.t1color }">{{ rm.t1abbr }}</div>
              <div class="rm-name">{{ rm.team1 }}</div>
            </div>
            <div class="rm-vs">
              <span class="rm-vs-icon">›‹</span>
            </div>
            <div class="rm-team-block right-block">
              <div class="rm-logo" :style="{ background: rm.t2color }">{{ rm.t2abbr }}</div>
              <div class="rm-name">{{ rm.team2 }}</div>
            </div>
          </div>
        </div>

        <!-- Win probability -->
        <div class="prob-card">
          <div class="prob-title">Win Probability</div>
          <div class="prob-bars">
            <div class="prob-item">
              <span class="prob-lbl">{{ match.team1 }}</span>
              <div class="prob-track">
                <div class="prob-fill t1-fill" style="width:64%"></div>
              </div>
              <span class="prob-pct">64%</span>
            </div>
            <div class="prob-item">
              <span class="prob-lbl">Draw</span>
              <div class="prob-track">
                <div class="prob-fill draw-fill" style="width:18%"></div>
              </div>
              <span class="prob-pct">18%</span>
            </div>
            <div class="prob-item">
              <span class="prob-lbl">{{ match.team2 }}</span>
              <div class="prob-track">
                <div class="prob-fill t2-fill" style="width:18%"></div>
              </div>
              <span class="prob-pct">18%</span>
            </div>
          </div>

          <!-- Percentage circles row -->
          <div class="pct-circles-row">
            <div class="pct-circle" v-for="p in [89,54,54,54,54,11]" :key="p">
              <svg viewBox="0 0 36 36" class="pct-svg">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#252840" stroke-width="3"/>
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="#e84c6b" stroke-width="3"
                  stroke-dasharray="94.25"
                  :stroke-dashoffset="94.25 - (94.25 * p / 100)"
                  stroke-linecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <span class="pct-num">{{ p }}%</span>
            </div>
          </div>
        </div>

        <!-- Mini promo -->
        <div class="mini-promo">
          <div class="mp-logos">
            <div class="mp-logo t1-bg">{{ team1Abbr }}</div>
            <div class="mp-logo t2-bg">{{ team2Abbr }}</div>
          </div>
          <div class="mp-text">
            <div class="mp-sport">SPORT</div>
            <div class="mp-betting">BETTING</div>
          </div>
          <div class="mp-bonus">
            <div class="mp-bonus-title">FREE BONUS</div>
            <div class="mp-code">23A4 23A4 K5/241 FD41 🔒</div>
            <button class="mp-copy">COPY THE CODE</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

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

const props = defineProps<{
  match: Match
  league: League
}>()

const emit = defineEmits<{ close: [] }>()

const activeTab = ref('ALL MATCHES')
const detailTabs = ['ALL MATCHES', 'LIVE', 'ODDS', 'FINISHED', 'SCHEDULE']

const team1Abbr = computed(() => props.match.team1.slice(0, 3).toUpperCase())
const team2Abbr = computed(() => props.match.team2.slice(0, 3).toUpperCase())

// Live score simulation
const liveScore = ref([1, 2])
const timerSeconds = ref(1341)

const liveTimer = computed(() => {
  const m = Math.floor(timerSeconds.value / 60).toString().padStart(2, '0')
  const s = (timerSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

let timerInterval: ReturnType<typeof setInterval>
onMounted(() => {
  timerInterval = setInterval(() => {
    timerSeconds.value++
  }, 1000)
})
onUnmounted(() => clearInterval(timerInterval))

const relatedMatches = [
  { id: 1, team1: 'Manchester United', t1abbr: 'MUN', t1color: '#DA291C', team2: 'FC Barcelona', t2abbr: 'FCB', t2color: '#004D98' },
  { id: 2, team1: 'Real Madrid', t1abbr: 'RMA', t1color: '#FEBE10', team2: 'Arsenal London', t2abbr: 'ARS', t2color: '#EF0107' },
  { id: 3, team1: 'Atletico Madrid', t1abbr: 'ATM', t1color: '#CB3524', team2: 'FC Valencia', t2abbr: 'VCF', t2color: '#F7D000' },
]
</script>

<style scoped>
.match-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0e1120;
  overflow: hidden;
}

/* Top bar */
.detail-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #141624;
  border-bottom: 1px solid #252840;
  flex-shrink: 0;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #252840;
  border: none;
  color: #e2e8f0;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.back-btn:hover { background: #2e3660; }
.back-arrow { font-size: 14px; font-weight: 900; }

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.bc-flag { font-size: 12px; }
.bc-sport { color: #9ba3b8; font-weight: 600; text-transform: uppercase; font-size: 10px; }
.bc-sep { color: #3a4060; }
.bc-name { color: #c8cfe0; font-weight: 600; }
.bc-match { color: #fff; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.detail-tabs {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}
.dtab {
  background: #1a1d2e;
  border: none;
  color: #7a8299;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.15s, color 0.15s;
}
.dtab:hover { color: #fff; }
.dtab.active { background: #e84c6b; color: #fff; }

/* Body layout */
.detail-body {
  flex: 1;
  display: flex;
  gap: 8px;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ── Main column ─────────────────────────── */
.detail-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

/* HEAD TO HEAD card */
.h2h-card {
  background: #141a2e;
  border: 1px solid #1e2a42;
  border-radius: 10px;
  overflow: hidden;
}
.h2h-title {
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: #0e1628;
  border-bottom: 1px solid #1e2a42;
  display: flex;
  align-items: center;
  gap: 6px;
}
.h2h-icon { font-size: 14px; }

.h2h-content {
  display: flex;
  align-items: flex-start;
  padding: 14px;
  gap: 12px;
}

.h2h-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100px;
  flex-shrink: 0;
}
.h2h-team.right { align-items: center; }
.h2h-logo {
  width: 52px; height: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  font-size: 12px; font-weight: 800; color: #fff;
}
.t1-bg { background: linear-gradient(135deg, #FEBE10, #c99a00); }
.t2-bg { background: linear-gradient(135deg, #DA291C, #8b001f); }
.h2h-club { font-size: 9px; color: #7a8299; font-weight: 600; text-align: center; }
.h2h-name { font-size: 11px; font-weight: 800; color: #fff; text-align: center; }
.h2h-badge {
  font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 10px; text-transform: uppercase;
}
.win { background: rgba(76,175,80,0.2); color: #4caf50; }
.win-t2 { background: rgba(232,76,107,0.2); color: #e84c6b; }
.h2h-stats { width: 100%; display: flex; flex-direction: column; gap: 3px; margin-top: 4px; }
.hstat { display: flex; justify-content: space-between; width: 100%; }
.hstat-label { font-size: 9px; color: #5a6a88; }
.hstat-val { font-size: 9px; font-weight: 800; color: #e2e8f0; }

/* Chart area */
.h2h-chart-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.h2h-vs-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0e1628;
  border-radius: 20px;
  padding: 3px 10px;
  border: 1px solid #252840;
}
.vs-t1 { font-size: 9px; font-weight: 800; color: #FEBE10; }
.vs-mid { font-size: 10px; font-weight: 900; color: #fff; }
.vs-t2 { font-size: 9px; font-weight: 800; color: #DA291C; }
.h2h-chart {
  width: 100%;
  height: 80px;
  display: block;
}
.chart-legend {
  display: flex;
  gap: 12px;
  font-size: 9px;
}
.leg-item.t1 { color: #e84c6b; }
.leg-item.t2 { color: #4a90e2; }

/* Live match card */
.live-card {
  background: #141a2e;
  border: 1px solid #1e2a42;
  border-radius: 10px;
  overflow: hidden;
}
.live-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: #0e1628;
  border-bottom: 1px solid #1e2a42;
}
.live-league-info { display: flex; align-items: center; gap: 6px; }
.live-flag { font-size: 14px; }
.live-league-name { font-size: 11px; font-weight: 700; color: #c8cfe0; }
.live-date { font-size: 10px; color: #5a6a88; margin-left: 4px; }
.live-badge {
  font-size: 10px; font-weight: 800; color: #e84c6b;
  background: rgba(232,76,107,0.15);
  border: 1px solid rgba(232,76,107,0.3);
  border-radius: 10px; padding: 2px 8px;
  animation: pulse-badge 1.5s infinite;
}
@keyframes pulse-badge {
  0%,100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.live-teams-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px 10px;
  gap: 8px;
  background: linear-gradient(135deg, rgba(232,76,107,0.08) 0%, transparent 50%, rgba(74,144,226,0.08) 100%);
}

.live-team-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}
.live-team-side.right-side { align-items: center; }
.live-player-avatar {
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 900; color: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}
.t1-avatar { background: linear-gradient(135deg, #003087, #0047ba); }
.t2-avatar { background: linear-gradient(135deg, #EF0107, #a61a10); }
.lpa-text { font-size: 11px; font-weight: 900; color: #fff; }
.live-team-info { text-align: center; }
.live-team-info.right { text-align: center; }
.lti-club { font-size: 9px; color: #5a6a88; }
.lti-name { font-size: 11px; font-weight: 800; color: #fff; }

/* Score */
.live-score-block { flex: 0 0 auto; text-align: center; }
.score-boxes {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0e1628;
  border-radius: 8px;
  border: 1px solid #252840;
  overflow: hidden;
}
.score-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 14px;
  gap: 2px;
}
.score-num {
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}
.score-lbl {
  font-size: 8px;
  color: #5a6a88;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.score-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 6px;
  border-left: 1px solid #252840;
  border-right: 1px solid #252840;
}
.timer-display {
  font-size: 11px;
  font-weight: 800;
  color: #e84c6b;
  font-variant-numeric: tabular-nums;
}

/* Stats bars */
.live-stats-bars {
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid #1e2a42;
}
.stat-bar-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sb-pct {
  font-size: 10px;
  font-weight: 800;
  min-width: 28px;
  text-align: right;
}
.t1-pct { color: #e84c6b; }
.t2-pct { color: #4a90e2; }
.sb-track {
  flex: 1;
  height: 4px;
  background: #1e2a42;
  border-radius: 2px;
  overflow: hidden;
}
.sb-track.right { transform: scaleX(-1); }
.sb-fill {
  height: 100%;
  border-radius: 2px;
}
.t1-fill { background: #e84c6b; }
.t2-fill { background: #4a90e2; }
.sb-label {
  font-size: 9px;
  color: #5a6a88;
  text-align: center;
  min-width: 80px;
  font-weight: 600;
}

/* Live odds strip */
.live-odds-row {
  display: flex;
  align-items: stretch;
  border-top: 1px solid #1e2a42;
}
.lo-pair {
  flex: 1;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.12s;
}
.lo-pair:hover { background: #1e2a42; }
.lo-pair.active-pair { background: #e84c6b; }
.lo-div { width: 1px; background: #1e2a42; align-self: stretch; }
.lo-lbl {
  flex: 0 0 30%;
  text-align: center;
  padding: 8px 2px;
  font-size: 10px;
  font-weight: 700;
  color: #5a6a88;
  border-right: 1px solid #1e2a42;
}
.lo-pair.active-pair .lo-lbl { color: rgba(255,255,255,0.85); border-right-color: rgba(255,255,255,0.2); }
.lo-val {
  flex: 1;
  text-align: center;
  padding: 8px 2px;
  font-size: 11px;
  font-weight: 800;
  color: #e2e8f0;
}
.lo-pair.active-pair .lo-val { color: #fff; }
.lo-basket {
  background: #252840;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border-left: 1px solid #1e2a42;
  transition: background 0.12s;
}
.lo-basket:hover { background: #2e3a56; }

/* Stats / Radar card */
.stats-card {
  background: #141a2e;
  border: 1px solid #1e2a42;
  border-radius: 10px;
  overflow: hidden;
}
.stats-title {
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: #0e1628;
  border-bottom: 1px solid #1e2a42;
}
.stats-body {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
}
.radar-wrap { flex-shrink: 0; width: 120px; }
.radar-svg { width: 100%; height: auto; }

.stat-details { flex: 1; min-width: 0; }
.sd-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.sd-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  width: 40px;
}
.sd-team.right-team { order: 3; }
.sd-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 800; color: #fff;
}
.t1-bg-sm { background: linear-gradient(135deg, #FEBE10, #c99a00); }
.t2-bg-sm { background: linear-gradient(135deg, #DA291C, #8b001f); }
.sd-name { font-size: 9px; color: #5a6a88; text-align: center; word-break: break-word; }
.sd-values { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.sd-item { display: flex; justify-content: space-between; align-items: center; }
.sd-lbl { font-size: 9px; color: #5a6a88; }
.sd-val { font-size: 9px; font-weight: 700; color: #e2e8f0; }
.show-more-btn-wrap { margin-top: 8px; }
.show-more-btn {
  background: #252840; border: none; color: #9ba3b8;
  padding: 5px 12px; border-radius: 4px; font-size: 10px;
  font-weight: 700; cursor: pointer; width: 100%;
  transition: background 0.15s;
}
.show-more-btn:hover { background: #2e3660; color: #fff; }

/* ── Right column ──────────────────────── */
.detail-right {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Related matches */
.related-card {
  background: #141a2e;
  border: 1px solid #1e2a42;
  border-radius: 10px;
  overflow: hidden;
}
.related-title {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #0e1628;
  border-bottom: 1px solid #1e2a42;
}
.rm-row {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid #1e2a42;
  cursor: pointer;
  transition: background 0.12s;
  gap: 4px;
}
.rm-row:hover { background: #1a2035; }
.rm-row:last-child { border-bottom: none; }
.rm-team-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
}
.rm-team-block.right-block { align-items: center; }
.rm-logo {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 8px; font-weight: 800; color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.rm-name { font-size: 8px; color: #9ba3b8; text-align: center; line-height: 1.3; font-weight: 600; }
.rm-vs {
  flex: 0 0 20px;
  text-align: center;
}
.rm-vs-icon {
  font-size: 10px;
  color: #e84c6b;
  font-weight: 900;
}

/* Win probability */
.prob-card {
  background: #141a2e;
  border: 1px solid #1e2a42;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px 12px;
}
.prob-title {
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.prob-bars { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
.prob-item { display: flex; align-items: center; gap: 6px; }
.prob-lbl { font-size: 9px; color: #5a6a88; min-width: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.prob-track { flex: 1; height: 5px; background: #1e2a42; border-radius: 3px; overflow: hidden; }
.prob-fill { height: 100%; border-radius: 3px; }
.t1-fill { background: #e84c6b; }
.draw-fill { background: #7a8299; }
.t2-fill { background: #4a90e2; }
.prob-pct { font-size: 9px; font-weight: 800; color: #e2e8f0; min-width: 24px; text-align: right; }

.pct-circles-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}
.pct-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  width: 28px;
}
.pct-svg { width: 28px; height: 28px; }
.pct-num { font-size: 8px; font-weight: 800; color: #e2e8f0; }

/* Mini promo */
.mini-promo {
  background: linear-gradient(135deg, #7b1fa2 0%, #5c35c9 50%, #1565c0 100%);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mp-logos { display: flex; gap: 6px; }
.mp-logo {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 900; color: #fff;
}
.t1-bg { background: linear-gradient(135deg, #FEBE10, #c99a00); }
.t2-bg { background: linear-gradient(135deg, #DA291C, #8b001f); }
.mp-sport { font-size: 9px; color: rgba(255,255,255,0.8); letter-spacing: 2px; font-weight: 700; }
.mp-betting { font-size: 16px; font-weight: 900; color: #fff; font-style: italic; line-height: 1; }
.mp-bonus-title { font-size: 10px; font-weight: 800; color: #ffd700; text-transform: uppercase; letter-spacing: 0.5px; }
.mp-code { font-size: 9px; color: rgba(255,255,255,0.7); background: rgba(0,0,0,0.25); border-radius: 3px; padding: 3px 5px; }
.mp-copy {
  background: #ffd700; border: none; color: #1a1d2e;
  padding: 4px 8px; border-radius: 3px; font-size: 9px;
  font-weight: 800; cursor: pointer; text-transform: uppercase;
  align-self: flex-start;
}
</style>
