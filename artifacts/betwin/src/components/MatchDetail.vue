<template>
  <div class="match-detail">

    <!-- Top bar: back + breadcrumb + tabs -->
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
          :key="tab.id"
          class="dtab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="dtab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- STATISTICS TAB -->
    <div v-if="activeTab === 'statistics'" class="detail-body">
      <div class="detail-main">

        <!-- HEAD TO HEAD card -->
        <div class="h2h-card">
          <div class="h2h-title"><span class="h2h-icon">⚔</span> HEAD TO HEAD</div>
          <div class="h2h-content">
            <div class="h2h-team">
              <div class="h2h-logo t1-bg"><span class="h2h-abbr">{{ team1Abbr }}</span></div>
              <div class="h2h-club">FC {{ match.team1.split(' ')[0] }}</div>
              <div class="h2h-name">{{ match.team1 }}</div>
              <div class="h2h-badge win">Win</div>
              <div class="h2h-stats">
                <div class="hstat"><span class="hstat-label">Avg. goals/match</span><span class="hstat-val">1.47</span></div>
                <div class="hstat"><span class="hstat-label">Best score</span><span class="hstat-val">5 : 0</span></div>
                <div class="hstat"><span class="hstat-label">Wins (last 10)</span><span class="hstat-val">6</span></div>
                <div class="hstat"><span class="hstat-label">Clean sheets</span><span class="hstat-val">4</span></div>
              </div>
            </div>
            <div class="h2h-chart-area">
              <div class="h2h-vs-badge">
                <span class="vs-t1">{{ team1Abbr }}</span>
                <span class="vs-mid">VS</span>
                <span class="vs-t2">{{ team2Abbr }}</span>
              </div>
              <svg class="h2h-chart" viewBox="0 0 240 80" preserveAspectRatio="none">
                <line x1="0" y1="40" x2="240" y2="40" stroke="#252840" stroke-width="1"/>
                <polyline points="0,60 30,45 60,30 90,50 120,25 150,40 180,20 210,35 240,15" fill="none" stroke="#e84c6b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M0,60 30,45 60,30 90,50 120,25 150,40 180,20 210,35 240,15 L240,80 L0,80 Z" fill="url(#grad1)" opacity="0.25"/>
                <polyline points="0,20 30,35 60,55 90,30 120,55 150,38 180,60 210,45 240,50" fill="none" stroke="#4a90e2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M0,20 30,35 60,55 90,30 120,55 150,38 180,60 210,45 240,50 L240,80 L0,80 Z" fill="url(#grad2)" opacity="0.2"/>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#e84c6b"/><stop offset="100%" stop-color="#e84c6b" stop-opacity="0"/>
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#4a90e2"/><stop offset="100%" stop-color="#4a90e2" stop-opacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="chart-legend">
                <span class="leg-item t1">● {{ match.team1 }}</span>
                <span class="leg-item t2">● {{ match.team2 }}</span>
              </div>
              <!-- H2H results row -->
              <div class="h2h-results">
                <div v-for="r in h2hResults" :key="r.id" class="h2h-result-item" :class="r.outcome">
                  {{ r.score }}
                </div>
              </div>
            </div>
            <div class="h2h-team right">
              <div class="h2h-logo t2-bg"><span class="h2h-abbr">{{ team2Abbr }}</span></div>
              <div class="h2h-club">FC {{ match.team2.split(' ')[0] }}</div>
              <div class="h2h-name">{{ match.team2 }}</div>
              <div class="h2h-badge win-t2">Win</div>
              <div class="h2h-stats">
                <div class="hstat"><span class="hstat-label">Avg. goals/match</span><span class="hstat-val">1.20</span></div>
                <div class="hstat"><span class="hstat-label">Best score</span><span class="hstat-val">3 : 1</span></div>
                <div class="hstat"><span class="hstat-label">Wins (last 10)</span><span class="hstat-val">3</span></div>
                <div class="hstat"><span class="hstat-label">Clean sheets</span><span class="hstat-val">2</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live match card -->
        <div class="live-card">
          <div class="live-card-header">
            <div class="live-league-info">
              <span class="live-flag">{{ league.flag }}</span>
              <span class="live-league-name">{{ league.name }}</span>
              <span class="live-date">{{ match.date }}</span>
            </div>
            <span class="live-badge">● LIVE</span>
          </div>
          <div class="live-teams-area">
            <div class="live-team-side">
              <div class="live-player-avatar t1-avatar"><span class="lpa-text">{{ team1Abbr }}</span></div>
              <div class="live-team-info"><div class="lti-name">{{ match.team1 }}</div></div>
            </div>
            <div class="live-score-block">
              <div class="score-boxes">
                <div class="score-box"><span class="score-num">{{ liveScore[0] }}</span><span class="score-lbl">HOME</span></div>
                <div class="score-divider"><div class="timer-display">{{ liveTimer }}</div></div>
                <div class="score-box"><span class="score-num">{{ liveScore[1] }}</span><span class="score-lbl">AWAY</span></div>
              </div>
            </div>
            <div class="live-team-side right-side">
              <div class="live-player-avatar t2-avatar"><span class="lpa-text">{{ team2Abbr }}</span></div>
              <div class="live-team-info right"><div class="lti-name">{{ match.team2 }}</div></div>
            </div>
          </div>
          <div class="live-stats-bars">
            <div v-for="s in liveStats" :key="s.label" class="stat-bar-group">
              <span class="sb-pct t1-pct">{{ s.t1 }}</span>
              <div class="sb-track"><div class="sb-fill t1-fill" :style="{ width: s.t1 }"></div></div>
              <span class="sb-label">{{ s.label }}</span>
              <div class="sb-track right"><div class="sb-fill t2-fill" :style="{ width: s.t2 }"></div></div>
              <span class="sb-pct t2-pct">{{ s.t2 }}</span>
            </div>
          </div>
        </div>

        <!-- Betting statistics radar -->
        <div class="stats-card">
          <div class="stats-title">BETTING STATISTICS</div>
          <div class="stats-body">
            <div class="radar-wrap">
              <svg viewBox="0 0 120 120" class="radar-svg">
                <polygon points="60,10 104,35 104,85 60,110 16,85 16,35" fill="none" stroke="#252840" stroke-width="1"/>
                <polygon points="60,25 91,43 91,77 60,95 29,77 29,43" fill="none" stroke="#252840" stroke-width="1"/>
                <polygon points="60,40 78,51 78,69 60,80 42,69 42,51" fill="none" stroke="#252840" stroke-width="1"/>
                <polygon points="60,20 95,50 85,88 35,88 25,50" fill="#e84c6b" fill-opacity="0.3" stroke="#e84c6b" stroke-width="1.5"/>
                <polygon points="60,32 88,55 78,82 42,82 32,55" fill="#4a90e2" fill-opacity="0.25" stroke="#4a90e2" stroke-width="1.5"/>
                <circle cx="60" cy="60" r="3" fill="#e84c6b"/>
              </svg>
            </div>
            <div class="stat-details">
              <div class="stats-table">
                <div class="st-header">
                  <span class="st-team t1-col">{{ team1Abbr }}</span>
                  <span class="st-cat">Stat</span>
                  <span class="st-team t2-col">{{ team2Abbr }}</span>
                </div>
                <div v-for="s in bettingStats" :key="s.label" class="st-row">
                  <span class="st-val t1-col">{{ s.t1 }}</span>
                  <span class="st-lbl">{{ s.label }}</span>
                  <span class="st-val t2-col">{{ s.t2 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form guide -->
        <div class="form-card">
          <div class="form-title">RECENT FORM</div>
          <div class="form-body">
            <div class="form-row">
              <span class="form-team-name">{{ match.team1 }}</span>
              <div class="form-badges">
                <span v-for="(r, i) in team1Form" :key="i" class="form-badge" :class="r">{{ r }}</span>
              </div>
            </div>
            <div class="form-row">
              <span class="form-team-name">{{ match.team2 }}</span>
              <div class="form-badges">
                <span v-for="(r, i) in team2Form" :key="i" class="form-badge" :class="r">{{ r }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right column -->
      <div class="detail-right">
        <div class="related-card">
          <div class="related-title">Related Matches</div>
          <div v-for="rm in relatedMatches" :key="rm.id" class="rm-row">
            <div class="rm-team-block">
              <div class="rm-logo" :style="{ background: rm.t1color }">{{ rm.t1abbr }}</div>
              <div class="rm-name">{{ rm.team1 }}</div>
            </div>
            <div class="rm-vs"><span class="rm-vs-icon">›‹</span></div>
            <div class="rm-team-block right-block">
              <div class="rm-logo" :style="{ background: rm.t2color }">{{ rm.t2abbr }}</div>
              <div class="rm-name">{{ rm.team2 }}</div>
            </div>
          </div>
        </div>
        <div class="prob-card">
          <div class="prob-title">Win Probability</div>
          <div class="prob-bars">
            <div class="prob-item">
              <span class="prob-lbl">{{ match.team1 }}</span>
              <div class="prob-track"><div class="prob-fill t1-fill" style="width:64%"></div></div>
              <span class="prob-pct">64%</span>
            </div>
            <div class="prob-item">
              <span class="prob-lbl">Draw</span>
              <div class="prob-track"><div class="prob-fill draw-fill" style="width:18%"></div></div>
              <span class="prob-pct">18%</span>
            </div>
            <div class="prob-item">
              <span class="prob-lbl">{{ match.team2 }}</span>
              <div class="prob-track"><div class="prob-fill t2-fill" style="width:18%"></div></div>
              <span class="prob-pct">18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ODDS TAB -->
    <div v-else-if="activeTab === 'odds'" class="detail-body odds-body">
      <div class="detail-main">

        <!-- Live score mini bar -->
        <div class="odds-live-bar">
          <span class="live-badge-sm">● LIVE</span>
          <span class="olb-teams">{{ match.team1 }} <b>{{ liveScore[0] }} : {{ liveScore[1] }}</b> {{ match.team2 }}</span>
          <span class="olb-timer">{{ liveTimer }}</span>
        </div>

        <!-- Markets -->
        <div v-for="market in allMarkets" :key="market.id" class="market-card">
          <div class="market-header" @click="market.open = !market.open">
            <span class="market-icon">{{ market.icon }}</span>
            <span class="market-name">{{ market.name }}</span>
            <span class="market-count">{{ market.outcomes.length }} selections</span>
            <span class="market-toggle">{{ market.open ? '▲' : '▼' }}</span>
          </div>
          <div v-if="market.open" class="market-outcomes">
            <div
              v-for="outcome in market.outcomes"
              :key="outcome.label"
              class="outcome-btn"
              :class="{ selected: hasBet(`${market.id}-${outcome.label}`) }"
              @click="toggleOutcome(market, outcome)"
            >
              <span class="outcome-label">{{ outcome.label }}</span>
              <span class="outcome-odds" :class="{ 'odds-up': outcome.trend === 'up', 'odds-down': outcome.trend === 'down' }">
                {{ outcome.odds }}
                <span v-if="outcome.trend === 'up'" class="trend-arrow">▲</span>
                <span v-if="outcome.trend === 'down'" class="trend-arrow">▼</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- Right col: market movers only -->
      <div class="detail-right">
        <div class="market-stats-card">
          <div class="ms-title">Market Movers</div>
          <div v-for="m in marketMovers" :key="m.label" class="ms-row">
            <span class="ms-label">{{ m.label }}</span>
            <span class="ms-change" :class="m.dir">{{ m.dir === 'up' ? '▲' : '▼' }} {{ m.change }}</span>
          </div>
        </div>
        <div class="slip-hint-card">
          <div class="slip-hint-icon">🛒</div>
          <div class="slip-hint-text">Selected odds appear in the bet slip on the right</div>
        </div>
      </div>
    </div>

    <!-- AI CHAT TAB -->
    <div v-else-if="activeTab === 'ai'" class="detail-body ai-body">
      <div class="ai-panel">
        <div class="ai-header">
          <div class="ai-logo">🤖</div>
          <div>
            <div class="ai-title">BETWIN AI Assistant</div>
            <div class="ai-subtitle">Ask me anything about this match, odds, or betting strategy</div>
          </div>
          <div class="ai-status">
            <span class="ai-status-dot"></span> Online
          </div>
        </div>

        <!-- Suggested prompts -->
        <div v-if="chatMessages.length === 0" class="ai-suggestions">
          <button
            v-for="s in suggestions"
            :key="s"
            class="suggestion-chip"
            @click="sendSuggestion(s)"
          >{{ s }}</button>
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="chatContainer">
          <div
            v-for="(msg, i) in chatMessages"
            :key="i"
            class="chat-msg"
            :class="msg.role"
          >
            <div v-if="msg.role === 'assistant'" class="msg-avatar">🤖</div>
            <div class="msg-bubble">
              <span v-if="msg.typing" class="typing-dots"><span></span><span></span><span></span></span>
              <span v-else>{{ msg.content }}</span>
            </div>
            <div v-if="msg.role === 'user'" class="msg-avatar user-avatar">👤</div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-area">
          <input
            v-model="chatInput"
            class="chat-input"
            placeholder="Ask about odds, team form, betting tips..."
            @keydown.enter="sendMessage"
            :disabled="aiLoading"
          />
          <button class="chat-send" @click="sendMessage" :disabled="aiLoading || !chatInput.trim()">
            {{ aiLoading ? '...' : '➤' }}
          </button>
        </div>
      </div>
    </div>

    <!-- PREDICTION TAB -->
    <div v-else-if="activeTab === 'prediction'" class="detail-body">
      <div class="detail-main">

        <!-- Prediction header card -->
        <div class="pred-header-card">
          <div class="pred-badge">🔮 AI PREDICTION</div>
          <div class="pred-match-title">{{ match.team1 }} vs {{ match.team2 }}</div>
          <div class="pred-league">{{ league.flag }} {{ league.name }}</div>
          <div class="pred-verdict">
            <div class="pred-verdict-label">Predicted Winner</div>
            <div class="pred-verdict-value">{{ match.team1 }}</div>
            <div class="pred-confidence">Confidence: <b>74%</b></div>
          </div>
        </div>

        <!-- Win probability -->
        <div class="pred-card">
          <div class="pred-card-title">WIN PROBABILITY</div>
          <div class="pred-prob-bars">
            <div class="pred-prob-item">
              <div class="pred-prob-team">
                <div class="pred-team-dot t1-dot"></div>
                <span>{{ match.team1 }}</span>
              </div>
              <div class="pred-prob-track">
                <div class="pred-prob-fill t1-pred-fill" style="width:64%">
                  <span class="pred-prob-label">64%</span>
                </div>
              </div>
            </div>
            <div class="pred-prob-item">
              <div class="pred-prob-team">
                <div class="pred-team-dot draw-dot"></div>
                <span>Draw</span>
              </div>
              <div class="pred-prob-track">
                <div class="pred-prob-fill draw-pred-fill" style="width:18%">
                  <span class="pred-prob-label">18%</span>
                </div>
              </div>
            </div>
            <div class="pred-prob-item">
              <div class="pred-prob-team">
                <div class="pred-team-dot t2-dot"></div>
                <span>{{ match.team2 }}</span>
              </div>
              <div class="pred-prob-track">
                <div class="pred-prob-fill t2-pred-fill" style="width:18%">
                  <span class="pred-prob-label">18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Score prediction -->
        <div class="pred-card">
          <div class="pred-card-title">SCORE PREDICTIONS</div>
          <div class="pred-scores-grid">
            <div v-for="s in scorePredictions" :key="s.score" class="pred-score-item" :class="{ top: s.top }">
              <div class="ps-score">{{ s.score }}</div>
              <div class="ps-pct">{{ s.pct }}%</div>
              <div class="ps-bar"><div class="ps-bar-fill" :style="{ height: s.pct + '%' }"></div></div>
            </div>
          </div>
        </div>

        <!-- Key factors -->
        <div class="pred-card">
          <div class="pred-card-title">KEY FACTORS</div>
          <div class="pred-factors">
            <div v-for="f in keyFactors" :key="f.label" class="pred-factor">
              <div class="pf-icon">{{ f.icon }}</div>
              <div class="pf-body">
                <div class="pf-label">{{ f.label }}</div>
                <div class="pf-desc">{{ f.desc }}</div>
              </div>
              <div class="pf-impact" :class="f.impact">{{ f.impact === 'positive' ? '▲' : '▼' }}</div>
            </div>
          </div>
        </div>

        <!-- Both teams to score / over under prediction -->
        <div class="pred-card">
          <div class="pred-card-title">MARKET PREDICTIONS</div>
          <div class="pred-markets">
            <div v-for="pm in predictedMarkets" :key="pm.label" class="pm-row">
              <span class="pm-label">{{ pm.label }}</span>
              <div class="pm-bar-wrap">
                <div class="pm-bar"><div class="pm-bar-fill" :class="pm.color" :style="{ width: pm.pct + '%' }"></div></div>
              </div>
              <span class="pm-pct" :class="pm.color + '-text'">{{ pm.pct }}%</span>
              <span class="pm-verdict" :class="pm.verdict === 'YES' ? 'pm-yes' : 'pm-no'">{{ pm.verdict }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Right col -->
      <div class="detail-right">
        <div class="pred-tip-card">
          <div class="tip-header">💡 BEST BET</div>
          <div class="tip-body">
            <div class="tip-market">Match Result</div>
            <div class="tip-selection">{{ match.team1 }} WIN</div>
            <div class="tip-odds-label">Recommended Odds</div>
            <div class="tip-odds-val">{{ match.odds1 }}</div>
            <div class="tip-confidence">
              <div class="tc-label">AI Confidence</div>
              <div class="tc-bar"><div class="tc-fill" style="width:74%"></div></div>
              <div class="tc-pct">74%</div>
            </div>
          </div>
        </div>
        <div class="pred-value-card">
          <div class="pv-title">VALUE BETS</div>
          <div v-for="vb in valueBets" :key="vb.label" class="pv-row">
            <div class="pv-label">{{ vb.label }}</div>
            <div class="pv-val">{{ vb.val }}</div>
            <div class="pv-edge" :class="{ positive: vb.edge > 0 }">+{{ vb.edge }}% edge</div>
          </div>
        </div>
        <div class="related-card">
          <div class="related-title">Related Matches</div>
          <div v-for="rm in relatedMatches" :key="rm.id" class="rm-row">
            <div class="rm-team-block">
              <div class="rm-logo" :style="{ background: rm.t1color }">{{ rm.t1abbr }}</div>
              <div class="rm-name">{{ rm.team1 }}</div>
            </div>
            <div class="rm-vs"><span class="rm-vs-icon">›‹</span></div>
            <div class="rm-team-block right-block">
              <div class="rm-logo" :style="{ background: rm.t2color }">{{ rm.t2abbr }}</div>
              <div class="rm-name">{{ rm.team2 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useBetSlip } from '@/composables/useBetSlip'

const { toggleBet, hasBet } = useBetSlip()

interface Match {
  id: number; date: string; time: string
  team1: string; team2: string
  odds1: string; oddsX: string; odds2: string
  odds1x: string; oddsX2: string; odds12: string
  highlighted: string
}
interface League { flag: string; sport: string; name: string }

const props = defineProps<{ match: Match; league: League }>()
const emit = defineEmits<{ close: [] }>()

const activeTab = ref('statistics')
const detailTabs = [
  { id: 'statistics', label: 'STATISTICS', icon: '📊' },
  { id: 'odds',       label: 'ODDS',       icon: '🎯' },
  { id: 'ai',         label: 'AI',         icon: '🤖' },
  { id: 'prediction', label: 'PREDICTION', icon: '🔮' },
]

const team1Abbr = computed(() => props.match.team1.slice(0, 3).toUpperCase())
const team2Abbr = computed(() => props.match.team2.slice(0, 3).toUpperCase())

// Live timer
const liveScore = ref([1, 2])
const timerSeconds = ref(1341)
const liveTimer = computed(() => {
  const m = Math.floor(timerSeconds.value / 60).toString().padStart(2, '0')
  const s = (timerSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})
let timerInterval: ReturnType<typeof setInterval>
onMounted(() => { timerInterval = setInterval(() => { timerSeconds.value++ }, 1000) })
onUnmounted(() => clearInterval(timerInterval))

// Statistics data
const liveStats = [
  { label: 'Possession', t1: '51%', t2: '49%' },
  { label: 'Shots on target', t1: '12%', t2: '22%' },
  { label: 'Passes', t1: '58%', t2: '42%' },
  { label: 'Corners', t1: '5', t2: '3' },
  { label: 'Fouls', t1: '8', t2: '11' },
]
const bettingStats = [
  { label: 'Avg goals/game', t1: '1.47', t2: '1.20' },
  { label: 'Wins last 10', t1: '6', t2: '3' },
  { label: 'Goals scored', t1: '24', t2: '18' },
  { label: 'Goals conceded', t1: '12', t2: '19' },
  { label: 'Over 2.5 rate', t1: '70%', t2: '50%' },
  { label: 'BTTS rate', t1: '60%', t2: '55%' },
]
const team1Form = ['W', 'W', 'D', 'W', 'L']
const team2Form = ['L', 'W', 'D', 'L', 'W']
const h2hResults = [
  { id: 1, score: '2-0', outcome: 'win' },
  { id: 2, score: '1-1', outcome: 'draw' },
  { id: 3, score: '3-1', outcome: 'win' },
  { id: 4, score: '0-1', outcome: 'loss' },
  { id: 5, score: '2-1', outcome: 'win' },
]
const relatedMatches = [
  { id: 1, team1: 'Manchester United', t1abbr: 'MUN', t1color: '#DA291C', team2: 'FC Barcelona', t2abbr: 'FCB', t2color: '#004D98' },
  { id: 2, team1: 'Real Madrid', t1abbr: 'RMA', t1color: '#FEBE10', team2: 'Arsenal', t2abbr: 'ARS', t2color: '#EF0107' },
  { id: 3, team1: 'Atletico Madrid', t1abbr: 'ATM', t1color: '#CB3524', team2: 'FC Valencia', t2abbr: 'VCF', t2color: '#F7D000' },
]

// ── ODDS TAB ──────────────────────────────────────────────────────────────
interface Outcome { label: string; odds: string; selected: boolean; trend?: 'up' | 'down' | '' }
interface Market { id: string; name: string; icon: string; open: boolean; outcomes: Outcome[] }

const allMarkets = ref<Market[]>([
  {
    id: 'match_result', name: 'Match Result (1X2)', icon: '⚽', open: true,
    outcomes: [
      { label: props.match.team1, odds: props.match.odds1, selected: false, trend: 'down' },
      { label: 'Draw', odds: props.match.oddsX, selected: false, trend: '' },
      { label: props.match.team2, odds: props.match.odds2, selected: false, trend: 'up' },
    ]
  },
  {
    id: 'double_chance', name: 'Double Chance', icon: '🔁', open: true,
    outcomes: [
      { label: `${props.match.team1} or Draw`, odds: '1.18', selected: false, trend: '' },
      { label: `${props.match.team1} or ${props.match.team2}`, odds: '1.36', selected: false, trend: 'up' },
      { label: `Draw or ${props.match.team2}`, odds: '2.10', selected: false, trend: '' },
    ]
  },
  {
    id: 'over_under', name: 'Total Goals Over/Under', icon: '📈', open: true,
    outcomes: [
      { label: 'Over 0.5', odds: '1.06', selected: false, trend: '' },
      { label: 'Under 0.5', odds: '8.50', selected: false, trend: '' },
      { label: 'Over 1.5', odds: '1.24', selected: false, trend: '' },
      { label: 'Under 1.5', odds: '3.80', selected: false, trend: '' },
      { label: 'Over 2.5', odds: '1.65', selected: false, trend: 'down' },
      { label: 'Under 2.5', odds: '2.15', selected: false, trend: 'up' },
      { label: 'Over 3.5', odds: '2.55', selected: false, trend: '' },
      { label: 'Under 3.5', odds: '1.48', selected: false, trend: '' },
      { label: 'Over 4.5', odds: '4.20', selected: false, trend: '' },
      { label: 'Under 4.5', odds: '1.18', selected: false, trend: '' },
    ]
  },
  {
    id: 'btts', name: 'Both Teams To Score', icon: '🎯', open: true,
    outcomes: [
      { label: 'Yes', odds: '1.72', selected: false, trend: 'up' },
      { label: 'No', odds: '2.00', selected: false, trend: 'down' },
    ]
  },
  {
    id: 'asian_handicap', name: 'Asian Handicap', icon: '⚖️', open: false,
    outcomes: [
      { label: `${props.match.team1} -1.5`, odds: '2.10', selected: false, trend: '' },
      { label: `${props.match.team2} +1.5`, odds: '1.72', selected: false, trend: '' },
      { label: `${props.match.team1} -0.5`, odds: '1.48', selected: false, trend: 'down' },
      { label: `${props.match.team2} +0.5`, odds: '2.55', selected: false, trend: 'up' },
      { label: `${props.match.team1} -1.0`, odds: '1.80', selected: false, trend: '' },
      { label: `${props.match.team2} +1.0`, odds: '2.05', selected: false, trend: '' },
    ]
  },
  {
    id: 'correct_score', name: 'Correct Score', icon: '🔢', open: false,
    outcomes: [
      { label: '1-0', odds: '6.50', selected: false, trend: '' },
      { label: '2-0', odds: '8.00', selected: false, trend: '' },
      { label: '2-1', odds: '7.00', selected: false, trend: '' },
      { label: '3-0', odds: '14.00', selected: false, trend: '' },
      { label: '3-1', odds: '12.00', selected: false, trend: '' },
      { label: '0-0', odds: '11.00', selected: false, trend: '' },
      { label: '1-1', odds: '6.00', selected: false, trend: '' },
      { label: '2-2', odds: '15.00', selected: false, trend: '' },
      { label: '0-1', odds: '13.00', selected: false, trend: '' },
      { label: '0-2', odds: '19.00', selected: false, trend: '' },
      { label: '1-2', odds: '11.00', selected: false, trend: '' },
    ]
  },
  {
    id: 'first_goal', name: 'Next Goal / Anytime Scorer', icon: '🥅', open: false,
    outcomes: [
      { label: 'Home team scores next', odds: '1.55', selected: false, trend: '' },
      { label: 'Away team scores next', odds: '2.30', selected: false, trend: '' },
      { label: 'No more goals', odds: '5.50', selected: false, trend: '' },
    ]
  },
  {
    id: 'halftime', name: 'Half-Time Result', icon: '⏱️', open: false,
    outcomes: [
      { label: `${props.match.team1} HT Win`, odds: '2.15', selected: false, trend: '' },
      { label: 'HT Draw', odds: '2.10', selected: false, trend: '' },
      { label: `${props.match.team2} HT Win`, odds: '4.20', selected: false, trend: '' },
    ]
  },
  {
    id: 'corners', name: 'Total Corners', icon: '📐', open: false,
    outcomes: [
      { label: 'Over 8.5 corners', odds: '1.85', selected: false, trend: '' },
      { label: 'Under 8.5 corners', odds: '1.95', selected: false, trend: '' },
      { label: 'Over 10.5 corners', odds: '2.60', selected: false, trend: '' },
      { label: 'Under 10.5 corners', odds: '1.50', selected: false, trend: '' },
    ]
  },
  {
    id: 'cards', name: 'Total Cards', icon: '🟨', open: false,
    outcomes: [
      { label: 'Over 3.5 cards', odds: '1.75', selected: false, trend: '' },
      { label: 'Under 3.5 cards', odds: '2.00', selected: false, trend: '' },
      { label: 'Home team yellow card', odds: '1.40', selected: false, trend: '' },
      { label: 'Away team red card', odds: '9.00', selected: false, trend: '' },
    ]
  },
])

function toggleOutcome(market: Market, outcome: Outcome) {
  toggleBet({
    key: `${market.id}-${outcome.label}`,
    market: market.name,
    label: outcome.label,
    odds: outcome.odds,
    matchName: `${props.match.team1} vs ${props.match.team2}`,
  })
}

const marketMovers = [
  { label: `${props.match.team1} Win`, dir: 'down', change: '0.12' },
  { label: 'Over 2.5 Goals', dir: 'up', change: '0.08' },
  { label: 'BTTS Yes', dir: 'up', change: '0.15' },
  { label: 'Draw', dir: 'down', change: '0.05' },
]

// ── AI TAB ────────────────────────────────────────────────────────────────
interface ChatMessage { role: 'user' | 'assistant'; content: string; typing?: boolean }

const chatMessages = ref<ChatMessage[]>([])
const chatInput = ref('')
const aiLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const suggestions = [
  `Who will win ${props.match.team1} vs ${props.match.team2}?`,
  'What are the best value bets for this match?',
  'Analyze both teams form and stats',
  'Should I bet on Over 2.5 goals?',
  'What is the head to head record?',
]

function sendSuggestion(s: string) {
  chatInput.value = s
  sendMessage()
}

async function sendMessage() {
  const text = chatInput.value.trim()
  if (!text || aiLoading.value) return

  chatMessages.value.push({ role: 'user', content: text })
  chatInput.value = ''
  aiLoading.value = true

  const typingMsg: ChatMessage = { role: 'assistant', content: '', typing: true }
  chatMessages.value.push(typingMsg)

  await nextTick()
  scrollChat()

  try {
    const systemPrompt = `You are BETWIN AI, an expert sports betting assistant. 
The current match is: ${props.match.team1} vs ${props.match.team2} in ${props.league.name} (${props.league.flag}).
Current live score: ${liveScore.value[0]}-${liveScore.value[1]} at ${liveTimer.value}.
Odds: ${props.match.team1} Win=${props.match.odds1}, Draw=${props.match.oddsX}, ${props.match.team2} Win=${props.match.odds2}.
Give concise, insightful betting analysis. Always include a clear recommendation.`

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatMessages.value
            .filter(m => !m.typing)
            .slice(0, -1)
            .map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: text }
        ],
        model: 'openai',
        seed: 42,
        jsonMode: false,
        private: true
      })
    })

    const reply = await response.text()
    const idx = chatMessages.value.findIndex(m => m.typing)
    if (idx !== -1) {
      chatMessages.value[idx] = { role: 'assistant', content: reply.trim(), typing: false }
    }
  } catch {
    const idx = chatMessages.value.findIndex(m => m.typing)
    if (idx !== -1) {
      chatMessages.value[idx] = {
        role: 'assistant',
        content: `Based on current stats: ${props.match.team1} are favourites with odds at ${props.match.odds1}. With a live score of ${liveScore.value[0]}-${liveScore.value[1]}, the momentum favours the home side. Consider the Double Chance or Over 2.5 Goals markets for safer value.`,
        typing: false
      }
    }
  }

  aiLoading.value = false
  await nextTick()
  scrollChat()
}

function scrollChat() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// ── PREDICTION TAB ────────────────────────────────────────────────────────
const scorePredictions = [
  { score: '2-0', pct: 18, top: true },
  { score: '2-1', pct: 15, top: false },
  { score: '1-0', pct: 14, top: false },
  { score: '3-1', pct: 10, top: false },
  { score: '1-1', pct: 9,  top: false },
  { score: '2-2', pct: 7,  top: false },
  { score: '0-1', pct: 6,  top: false },
  { score: '3-0', pct: 5,  top: false },
]
const keyFactors = [
  { icon: '🏆', label: 'Home advantage', desc: `${props.match.team1} wins 68% at home`, impact: 'positive' },
  { icon: '⚡', label: 'Current form', desc: 'W-W-D-W-L in last 5 games', impact: 'positive' },
  { icon: '🤕', label: 'Injuries', desc: '2 key players unavailable', impact: 'negative' },
  { icon: '🔄', label: 'Head to head', desc: '3W-1D-1L in last 5 meetings', impact: 'positive' },
  { icon: '🛡️', label: 'Defensive record', desc: 'Clean sheet in 40% of home games', impact: 'positive' },
  { icon: '📉', label: 'Fatigue factor', desc: 'Played 3 games in last 7 days', impact: 'negative' },
]
const predictedMarkets = [
  { label: `${props.match.team1} Win`, pct: 64, color: 'pred-t1', verdict: 'YES' },
  { label: 'Over 2.5 Goals', pct: 62, color: 'pred-neutral', verdict: 'YES' },
  { label: 'Both Teams Score', pct: 55, color: 'pred-neutral', verdict: 'YES' },
  { label: 'Home Win HT', pct: 48, color: 'pred-t1', verdict: 'NO' },
  { label: 'Draw', pct: 18, color: 'pred-draw', verdict: 'NO' },
  { label: `${props.match.team2} Win`, pct: 18, color: 'pred-t2', verdict: 'NO' },
]
const valueBets = [
  { label: `${props.match.team1} Win`, val: props.match.odds1, edge: 8 },
  { label: 'Over 2.5 Goals', val: '1.65', edge: 5 },
  { label: 'BTTS Yes', val: '1.72', edge: 3 },
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

/* ── TOP BAR ─────────────────────────────── */
.detail-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #141624;
  border-bottom: 1px solid #252840;
  flex-shrink: 0;
}
.back-btn {
  display: flex; align-items: center; gap: 4px;
  background: #252840; border: none; color: #e2e8f0;
  padding: 5px 10px; border-radius: 4px;
  font-size: 11px; font-weight: 700; cursor: pointer;
  flex-shrink: 0; transition: background 0.15s;
}
.back-btn:hover { background: #2e3660; }
.back-arrow { font-size: 14px; font-weight: 900; }
.breadcrumb {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; flex: 1; min-width: 0; overflow: hidden;
}
.bc-flag { font-size: 12px; }
.bc-sport { color: #9ba3b8; font-weight: 600; text-transform: uppercase; font-size: 10px; }
.bc-sep { color: #3a4060; }
.bc-name { color: #c8cfe0; font-weight: 600; }
.bc-match { color: #fff; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.detail-tabs { display: flex; gap: 2px; flex-shrink: 0; }
.dtab {
  background: #1a1d2e; border: none; color: #7a8299;
  padding: 5px 10px; border-radius: 4px;
  font-size: 10px; font-weight: 700; cursor: pointer;
  text-transform: uppercase; transition: background 0.15s, color 0.15s;
  display: flex; align-items: center; gap: 4px;
}
.dtab:hover { color: #fff; background: #22263a; }
.dtab.active { background: #e84c6b; color: #fff; }
.dtab-icon { font-size: 11px; }

/* ── BODY LAYOUT ─────────────────────────── */
.detail-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  display: flex;
  gap: 8px;
  padding: 10px;
  align-items: flex-start;
  scrollbar-width: thin;
  scrollbar-color: #252840 transparent;
}
.detail-body::-webkit-scrollbar { width: 5px; }
.detail-body::-webkit-scrollbar-track { background: transparent; }
.detail-body::-webkit-scrollbar-thumb { background: #252840; border-radius: 3px; }
.detail-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.detail-right {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── SHARED CARD ─────────────────────────── */
.h2h-card, .live-card, .stats-card, .form-card,
.market-card, .pred-card, .pred-header-card {
  background: #141a2e; border: 1px solid #1e2a42;
  border-radius: 10px; overflow: hidden;
}

/* ── H2H ────────────────────────────────── */
.h2h-title {
  padding: 8px 14px; font-size: 11px; font-weight: 800;
  color: #fff; text-transform: uppercase; letter-spacing: 1px;
  background: #0e1628; border-bottom: 1px solid #1e2a42;
  display: flex; align-items: center; gap: 6px;
}
.h2h-icon { font-size: 14px; }
.h2h-content { display: flex; align-items: flex-start; padding: 14px; gap: 12px; }
.h2h-team { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 90px; flex-shrink: 0; }
.h2h-logo { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4); font-size: 11px; font-weight: 800; color: #fff; }
.t1-bg { background: linear-gradient(135deg,#FEBE10,#c99a00); }
.t2-bg { background: linear-gradient(135deg,#DA291C,#8b001f); }
.h2h-abbr { font-size: 10px; font-weight: 900; }
.h2h-club { font-size: 9px; color: #7a8299; font-weight: 600; text-align: center; }
.h2h-name { font-size: 10px; font-weight: 800; color: #fff; text-align: center; }
.h2h-badge { font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; }
.win { background: rgba(76,175,80,0.2); color: #4caf50; }
.win-t2 { background: rgba(232,76,107,0.2); color: #e84c6b; }
.h2h-stats { width: 100%; display: flex; flex-direction: column; gap: 3px; margin-top: 4px; }
.hstat { display: flex; justify-content: space-between; width: 100%; }
.hstat-label { font-size: 8px; color: #5a6a88; }
.hstat-val { font-size: 8px; font-weight: 800; color: #e2e8f0; }
.h2h-chart-area { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
.h2h-vs-badge { display: flex; align-items: center; gap: 6px; background: #0e1628; border-radius: 20px; padding: 3px 10px; border: 1px solid #252840; }
.vs-t1 { font-size: 9px; font-weight: 800; color: #FEBE10; }
.vs-mid { font-size: 10px; font-weight: 900; color: #fff; }
.vs-t2 { font-size: 9px; font-weight: 800; color: #DA291C; }
.h2h-chart { width: 100%; height: 70px; display: block; }
.chart-legend { display: flex; gap: 12px; font-size: 9px; }
.leg-item.t1 { color: #e84c6b; }
.leg-item.t2 { color: #4a90e2; }
.h2h-results { display: flex; gap: 4px; margin-top: 4px; }
.h2h-result-item { font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
.h2h-result-item.win { background: rgba(76,175,80,0.2); color: #4caf50; }
.h2h-result-item.draw { background: rgba(122,130,153,0.2); color: #9ba3b8; }
.h2h-result-item.loss { background: rgba(232,76,107,0.2); color: #e84c6b; }

/* ── LIVE CARD ───────────────────────────── */
.live-card-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.live-league-info { display: flex; align-items: center; gap: 6px; }
.live-flag { font-size: 14px; }
.live-league-name { font-size: 11px; font-weight: 700; color: #c8cfe0; }
.live-date { font-size: 10px; color: #5a6a88; margin-left: 4px; }
.live-badge { font-size: 10px; font-weight: 800; color: #e84c6b; background: rgba(232,76,107,0.15); border: 1px solid rgba(232,76,107,0.3); border-radius: 10px; padding: 2px 8px; animation: pulse-badge 1.5s infinite; }
@keyframes pulse-badge { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
.live-teams-area { display: flex; align-items: center; justify-content: space-between; padding: 14px; gap: 8px; background: linear-gradient(135deg,rgba(232,76,107,0.06) 0%,transparent 50%,rgba(74,144,226,0.06) 100%); }
.live-team-side { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
.live-player-avatar { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.5); }
.t1-avatar { background: linear-gradient(135deg,#003087,#0047ba); }
.t2-avatar { background: linear-gradient(135deg,#EF0107,#a61a10); }
.lpa-text { font-size: 10px; font-weight: 900; color: #fff; }
.live-team-info { text-align: center; }
.lti-name { font-size: 11px; font-weight: 800; color: #fff; }
.live-score-block { flex: 0 0 auto; text-align: center; }
.score-boxes { display: flex; align-items: center; background: #0e1628; border-radius: 8px; border: 1px solid #252840; overflow: hidden; }
.score-box { display: flex; flex-direction: column; align-items: center; padding: 10px 14px; gap: 2px; }
.score-num { font-size: 28px; font-weight: 900; color: #fff; line-height: 1; }
.score-lbl { font-size: 8px; color: #5a6a88; text-transform: uppercase; font-weight: 700; }
.score-divider { display: flex; flex-direction: column; align-items: center; padding: 8px 6px; border-left: 1px solid #252840; border-right: 1px solid #252840; }
.timer-display { font-size: 11px; font-weight: 800; color: #e84c6b; }
.live-stats-bars { padding: 8px 14px; display: flex; flex-direction: column; gap: 6px; border-top: 1px solid #1e2a42; }
.stat-bar-group { display: flex; align-items: center; gap: 6px; }
.sb-pct { font-size: 10px; font-weight: 800; min-width: 28px; text-align: right; }
.t1-pct { color: #e84c6b; }
.t2-pct { color: #4a90e2; }
.sb-track { flex: 1; height: 4px; background: #1e2a42; border-radius: 2px; overflow: hidden; }
.sb-track.right { transform: scaleX(-1); }
.sb-fill { height: 100%; border-radius: 2px; }
.t1-fill { background: #e84c6b; }
.t2-fill { background: #4a90e2; }
.sb-label { font-size: 9px; color: #5a6a88; text-align: center; min-width: 90px; font-weight: 600; }

/* ── STATS TABLE ─────────────────────────── */
.stats-title { padding: 8px 14px; font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 1px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.stats-body { display: flex; gap: 12px; padding: 12px 14px; }
.radar-wrap { flex-shrink: 0; width: 110px; }
.radar-svg { width: 100%; height: auto; }
.stat-details { flex: 1; min-width: 0; }
.stats-table { display: flex; flex-direction: column; gap: 2px; }
.st-header { display: flex; align-items: center; padding: 3px 0; border-bottom: 1px solid #1e2a42; margin-bottom: 2px; }
.st-row { display: flex; align-items: center; padding: 3px 0; border-bottom: 1px solid #1a2035; }
.st-cat { flex: 1; font-size: 9px; color: #5a6a88; text-align: center; font-weight: 600; }
.st-lbl { flex: 1; font-size: 9px; color: #7a8299; text-align: center; }
.st-team { font-size: 9px; font-weight: 800; min-width: 36px; text-align: center; }
.st-val { font-size: 9px; font-weight: 800; color: #e2e8f0; min-width: 36px; text-align: center; }
.t1-col { color: #e84c6b; }
.t2-col { color: #4a90e2; }

/* ── FORM CARD ───────────────────────────── */
.form-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden; }
.form-title { padding: 8px 14px; font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 1px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.form-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.form-row { display: flex; align-items: center; gap: 10px; }
.form-team-name { font-size: 10px; font-weight: 700; color: #c8cfe0; min-width: 120px; }
.form-badges { display: flex; gap: 4px; }
.form-badge { font-size: 10px; font-weight: 900; width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.form-badge.W { background: rgba(76,175,80,0.25); color: #4caf50; }
.form-badge.D { background: rgba(122,130,153,0.2); color: #9ba3b8; }
.form-badge.L { background: rgba(232,76,107,0.2); color: #e84c6b; }

/* ── RIGHT SIDEBAR CARDS ─────────────────── */
.related-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden; }
.related-title { padding: 8px 12px; font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.rm-row { display: flex; align-items: center; padding: 8px 10px; border-bottom: 1px solid #1e2a42; cursor: pointer; transition: background 0.12s; gap: 4px; }
.rm-row:hover { background: #1a2035; }
.rm-row:last-child { border-bottom: none; }
.rm-team-block { display: flex; flex-direction: column; align-items: center; gap: 3px; flex: 1; }
.rm-logo { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 800; color: #fff; }
.rm-name { font-size: 8px; color: #9ba3b8; text-align: center; line-height: 1.3; font-weight: 600; }
.rm-vs { flex: 0 0 20px; text-align: center; }
.rm-vs-icon { font-size: 10px; color: #e84c6b; font-weight: 900; }
.prob-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; padding: 10px 12px; }
.prob-title { font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.prob-bars { display: flex; flex-direction: column; gap: 5px; }
.prob-item { display: flex; align-items: center; gap: 6px; }
.prob-lbl { font-size: 9px; color: #5a6a88; min-width: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.prob-track { flex: 1; height: 5px; background: #1e2a42; border-radius: 3px; overflow: hidden; }
.prob-fill { height: 100%; border-radius: 3px; }
.t1-fill { background: #e84c6b; }
.draw-fill { background: #7a8299; }
.t2-fill { background: #4a90e2; }
.prob-pct { font-size: 9px; font-weight: 800; color: #e2e8f0; min-width: 24px; text-align: right; }

/* ── ODDS TAB ────────────────────────────── */
.odds-body { align-items: flex-start; }
.odds-live-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 14px; background: #141a2e;
  border: 1px solid #1e2a42; border-radius: 8px;
  font-size: 11px;
}
.live-badge-sm { font-size: 9px; font-weight: 800; color: #e84c6b; background: rgba(232,76,107,0.15); border: 1px solid rgba(232,76,107,0.3); border-radius: 10px; padding: 2px 7px; animation: pulse-badge 1.5s infinite; }
.olb-teams { color: #e2e8f0; font-weight: 600; flex: 1; }
.olb-teams b { color: #fff; font-size: 13px; }
.olb-timer { color: #e84c6b; font-weight: 800; font-size: 12px; }
.market-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 8px; overflow: hidden; }
.market-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; cursor: pointer; user-select: none; transition: background 0.12s; }
.market-header:hover { background: #1a2035; }
.market-icon { font-size: 14px; }
.market-name { flex: 1; font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; }
.market-count { font-size: 9px; color: #5a6a88; }
.market-toggle { font-size: 9px; color: #5a6a88; }
.market-outcomes {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 4px; padding: 8px 10px;
  border-top: 1px solid #1e2a42;
}
.outcome-btn {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; background: #0e1628; border-radius: 6px;
  cursor: pointer; transition: background 0.12s, border-color 0.12s;
  border: 1px solid #1e2a42;
}
.outcome-btn:hover { background: #172035; border-color: #2e3f64; }
.outcome-btn.selected { background: rgba(232,76,107,0.15); border-color: #e84c6b; }
.outcome-label { font-size: 10px; color: #c8cfe0; font-weight: 600; }
.outcome-odds { font-size: 12px; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 2px; }
.outcome-btn.selected .outcome-odds { color: #e84c6b; }
.odds-up .trend-arrow { color: #4caf50; font-size: 8px; }
.odds-down .trend-arrow { color: #e84c6b; font-size: 8px; }
.slip-hint-card {
  background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px;
  padding: 12px; text-align: center; display: flex; flex-direction: column;
  align-items: center; gap: 6px;
}
.slip-hint-icon { font-size: 22px; }
.slip-hint-text { font-size: 10px; color: #5a6a88; line-height: 1.5; }
.slip-item { padding: 8px 12px; border-bottom: 1px solid #1e2a42; }
.slip-market { font-size: 8px; color: #5a6a88; text-transform: uppercase; }
.slip-outcome { font-size: 10px; font-weight: 700; color: #e2e8f0; }
.slip-odds { font-size: 12px; font-weight: 900; color: #e84c6b; }
.slip-total { display: flex; justify-content: space-between; padding: 8px 12px; border-top: 1px solid #252840; font-size: 10px; color: #9ba3b8; }
.slip-total-val { font-weight: 900; color: #ffd700; }
.slip-place-btn { width: 100%; padding: 10px; background: #e84c6b; border: none; color: #fff; font-size: 11px; font-weight: 800; cursor: pointer; text-transform: uppercase; transition: background 0.15s; }
.slip-place-btn:hover { background: #d43c5c; }
.market-stats-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden; padding: 10px 12px; }
.ms-title { font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 8px; }
.ms-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #1a2035; }
.ms-row:last-child { border-bottom: none; }
.ms-label { font-size: 9px; color: #9ba3b8; }
.ms-change { font-size: 9px; font-weight: 800; }
.ms-change.up { color: #4caf50; }
.ms-change.down { color: #e84c6b; }

/* ── AI CHAT TAB ─────────────────────────── */
.ai-body {
  padding: 0;
  overflow: hidden;
  align-items: stretch;
}
.ai-panel { display: flex; flex-direction: column; flex: 1; min-height: 0; background: #0e1120; }
.ai-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #141624; border-bottom: 1px solid #252840; flex-shrink: 0; }
.ai-logo { font-size: 28px; flex-shrink: 0; }
.ai-title { font-size: 13px; font-weight: 800; color: #fff; }
.ai-subtitle { font-size: 10px; color: #7a8299; }
.ai-status { display: flex; align-items: center; gap: 5px; font-size: 10px; color: #4caf50; font-weight: 700; margin-left: auto; }
.ai-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #4caf50; animation: pulse-badge 1.5s infinite; }
.ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 16px; border-bottom: 1px solid #1e2a42; flex-shrink: 0; }
.suggestion-chip { background: #141a2e; border: 1px solid #252840; color: #c8cfe0; padding: 6px 12px; border-radius: 16px; font-size: 10px; font-weight: 600; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.suggestion-chip:hover { background: #1e2a42; border-color: #e84c6b; color: #fff; }
.chat-messages { flex: 1; overflow-y: auto; min-height: 0; padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; }
.chat-msg { display: flex; align-items: flex-end; gap: 8px; }
.chat-msg.user { flex-direction: row-reverse; }
.msg-avatar { font-size: 18px; flex-shrink: 0; margin-bottom: 2px; }
.user-avatar { }
.msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 12px; line-height: 1.5; color: #e2e8f0;
}
.chat-msg.assistant .msg-bubble { background: #141a2e; border: 1px solid #1e2a42; border-bottom-left-radius: 3px; }
.chat-msg.user .msg-bubble { background: linear-gradient(135deg,#e84c6b,#c0395a); color: #fff; border-bottom-right-radius: 3px; }
.typing-dots { display: inline-flex; gap: 4px; align-items: center; }
.typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #7a8299; animation: typing 1.2s infinite; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }
.chat-input-area { display: flex; gap: 8px; padding: 12px 16px; background: #141624; border-top: 1px solid #252840; flex-shrink: 0; }
.chat-input { flex: 1; background: #1a1d2e; border: 1px solid #252840; color: #e2e8f0; padding: 10px 14px; border-radius: 20px; font-size: 12px; outline: none; transition: border-color 0.15s; }
.chat-input:focus { border-color: #e84c6b; }
.chat-input::placeholder { color: #5a6a88; }
.chat-input:disabled { opacity: 0.6; }
.chat-send { width: 38px; height: 38px; border-radius: 50%; background: #e84c6b; border: none; color: #fff; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }
.chat-send:hover:not(:disabled) { background: #d43c5c; }
.chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── PREDICTION TAB ──────────────────────── */
.pred-header-card { background: linear-gradient(135deg,#1a1040,#0e1628); border: 1px solid #2e2060; border-radius: 10px; padding: 20px; text-align: center; }
.pred-badge { display: inline-block; background: rgba(232,76,107,0.2); border: 1px solid rgba(232,76,107,0.4); color: #e84c6b; padding: 3px 10px; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.pred-match-title { font-size: 15px; font-weight: 900; color: #fff; margin-bottom: 2px; }
.pred-league { font-size: 10px; color: #7a8299; margin-bottom: 12px; }
.pred-verdict { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 10px; }
.pred-verdict-label { font-size: 9px; color: #7a8299; text-transform: uppercase; font-weight: 700; }
.pred-verdict-value { font-size: 18px; font-weight: 900; color: #e84c6b; }
.pred-confidence { font-size: 10px; color: #9ba3b8; margin-top: 2px; }
.pred-confidence b { color: #4caf50; }
.pred-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden; }
.pred-card-title { padding: 8px 14px; font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 1px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.pred-prob-bars { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.pred-prob-item { display: flex; align-items: center; gap: 8px; }
.pred-prob-team { display: flex; align-items: center; gap: 5px; font-size: 10px; color: #c8cfe0; font-weight: 600; min-width: 110px; }
.pred-team-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.t1-dot { background: #e84c6b; }
.draw-dot { background: #7a8299; }
.t2-dot { background: #4a90e2; }
.pred-prob-track { flex: 1; height: 22px; background: #0e1628; border-radius: 4px; overflow: hidden; border: 1px solid #1e2a42; }
.pred-prob-fill { height: 100%; display: flex; align-items: center; padding-left: 6px; border-radius: 4px; transition: width 0.6s ease; }
.pred-prob-label { font-size: 10px; font-weight: 800; color: #fff; }
.t1-pred-fill { background: linear-gradient(90deg,#e84c6b,#c0395a); }
.draw-pred-fill { background: linear-gradient(90deg,#5a6a88,#3a4060); }
.t2-pred-fill { background: linear-gradient(90deg,#4a90e2,#2e6ab8); }
.pred-scores-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 12px 14px; }
.pred-score-item { display: flex; flex-direction: column; align-items: center; gap: 4px; background: #0e1628; border-radius: 8px; padding: 8px 4px; border: 1px solid #1e2a42; transition: border-color 0.15s; }
.pred-score-item.top { border-color: #e84c6b; background: rgba(232,76,107,0.1); }
.ps-score { font-size: 13px; font-weight: 900; color: #fff; }
.ps-pct { font-size: 10px; font-weight: 700; color: #e84c6b; }
.ps-bar { width: 4px; height: 40px; background: #1e2a42; border-radius: 2px; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; }
.ps-bar-fill { width: 100%; background: linear-gradient(to top,#e84c6b,rgba(232,76,107,0.3)); border-radius: 2px; }
.pred-factors { padding: 8px 14px; display: flex; flex-direction: column; gap: 6px; }
.pred-factor { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #1a2035; }
.pred-factor:last-child { border-bottom: none; }
.pf-icon { font-size: 16px; flex-shrink: 0; }
.pf-body { flex: 1; }
.pf-label { font-size: 10px; font-weight: 800; color: #e2e8f0; }
.pf-desc { font-size: 9px; color: #7a8299; margin-top: 1px; }
.pf-impact { font-size: 12px; font-weight: 900; }
.pf-impact.positive { color: #4caf50; }
.pf-impact.negative { color: #e84c6b; }
.pred-markets { padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; }
.pm-row { display: flex; align-items: center; gap: 8px; }
.pm-label { font-size: 9px; color: #9ba3b8; min-width: 110px; font-weight: 600; }
.pm-bar-wrap { flex: 1; }
.pm-bar { height: 5px; background: #1e2a42; border-radius: 3px; overflow: hidden; }
.pm-bar-fill { height: 100%; border-radius: 3px; }
.pred-t1 { background: #e84c6b; }
.pred-t2 { background: #4a90e2; }
.pred-draw { background: #7a8299; }
.pred-neutral { background: #7c3aed; }
.pred-t1-text { color: #e84c6b; }
.pred-t2-text { color: #4a90e2; }
.pred-neutral-text { color: #9d6cf0; }
.pred-draw-text { color: #7a8299; }
.pm-pct { font-size: 9px; font-weight: 800; min-width: 30px; text-align: right; }
.pm-verdict { font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 4px; }
.pm-yes { background: rgba(76,175,80,0.2); color: #4caf50; }
.pm-no { background: rgba(232,76,107,0.15); color: #e84c6b; }
.pred-tip-card { background: linear-gradient(135deg,#1a1040,#0e1628); border: 1px solid #2e2060; border-radius: 10px; overflow: hidden; }
.tip-header { padding: 8px 12px; font-size: 11px; font-weight: 800; color: #ffd700; background: rgba(0,0,0,0.3); border-bottom: 1px solid #2e2060; }
.tip-body { padding: 12px; }
.tip-market { font-size: 9px; color: #7a8299; text-transform: uppercase; font-weight: 700; }
.tip-selection { font-size: 14px; font-weight: 900; color: #fff; margin: 4px 0 8px; }
.tip-odds-label { font-size: 9px; color: #7a8299; }
.tip-odds-val { font-size: 24px; font-weight: 900; color: #e84c6b; }
.tc-label { font-size: 9px; color: #7a8299; margin-top: 8px; margin-bottom: 4px; }
.tc-bar { height: 5px; background: #1e2a42; border-radius: 3px; overflow: hidden; }
.tc-fill { height: 100%; background: linear-gradient(90deg,#4caf50,#2e9c40); border-radius: 3px; }
.tc-pct { font-size: 10px; font-weight: 800; color: #4caf50; margin-top: 2px; }
.pred-value-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden; padding: 10px 12px; }
.pv-title { font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 8px; }
.pv-row { padding: 5px 0; border-bottom: 1px solid #1a2035; display: flex; flex-direction: column; gap: 2px; }
.pv-row:last-child { border-bottom: none; }
.pv-label { font-size: 9px; color: #9ba3b8; }
.pv-val { font-size: 12px; font-weight: 900; color: #fff; }
.pv-edge { font-size: 9px; font-weight: 700; color: #7a8299; }
.pv-edge.positive { color: #4caf50; }
</style>
