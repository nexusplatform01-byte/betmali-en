<template>
  <div class="match-detail">

    <!-- Loading overlay -->
    <div v-if="loading" class="md-loading">
      <div class="md-spinner"></div>
      <span>Loading match details…</span>
    </div>

    <!-- Top bar: back + breadcrumb + tabs -->
    <div class="detail-topbar">
      <button class="back-btn" @click="emit('close')">‹ Back</button>
      <div class="breadcrumb">
        <img v-if="tournamentLogo" :src="tournamentLogo" class="bc-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
        <span class="bc-sport">{{ sportName }}</span>
        <span class="bc-sep">›</span>
        <span class="bc-name">{{ tournamentName }}</span>
        <span class="bc-sep">›</span>
        <span class="bc-match">{{ homeName }} vs {{ awayName }}</span>
      </div>
      <div class="detail-tabs">
        <button v-for="tab in TABS" :key="tab.id" class="dtab" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
          <span class="dtab-icon">{{ tab.icon }}</span>{{ tab.label }}
        </button>
      </div>
    </div>

    <!-- ═══════════════ OVERVIEW TAB ═══════════════ -->
    <div v-if="activeTab === 'overview'" class="detail-body">
      <div class="detail-main">

        <!-- Match Hero -->
        <div class="match-hero-card">
          <div class="hero-meta">
            <img v-if="categoryLogo" :src="categoryLogo" class="hero-cat-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
            <span class="hero-tourn">{{ tournamentName }}</span>
            <span class="hero-bull">•</span>
            <span class="hero-round">{{ roundName }}</span>
            <span class="hero-bull">•</span>
            <span class="hero-date">{{ matchDateStr }}</span>
            <span class="hero-status" :class="statusCls">{{ statusText }}</span>
          </div>

          <div class="hero-teams-area">
            <div class="hero-team">
              <img v-if="homeLogo" :src="homeLogo" class="hero-team-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
              <div class="hero-team-name">{{ homeName }}</div>
            </div>

            <div class="hero-score-center">
              <template v-if="isLive || isFinished">
                <div class="hero-live-score">
                  <span class="hls-num">{{ liveScore.home }}</span>
                  <span class="hls-sep">:</span>
                  <span class="hls-num">{{ liveScore.away }}</span>
                </div>
                <div v-if="isLive" class="hero-clock">{{ matchClock }}'</div>
                <div v-else class="hero-ft">FT</div>
                <div v-if="periodScores.length" class="hero-ht">
                  ({{ periodScores.map(p => `${p.home}-${p.away}`).join(' / ') }})
                </div>
              </template>
              <template v-else>
                <div class="hero-time">{{ matchTimeStr }}</div>
                <div class="hero-vs">VS</div>
                <div v-if="countdown" class="hero-countdown">{{ countdown }}</div>
              </template>
            </div>

            <div class="hero-team">
              <img v-if="awayLogo" :src="awayLogo" class="hero-team-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
              <div class="hero-team-name">{{ awayName }}</div>
            </div>
          </div>

          <!-- Quick 1X2 odds in hero -->
          <div class="hero-odds-strip" v-if="mainMarketOutcomes.length">
            <button v-for="out in mainMarketOutcomes" :key="out.id"
              class="hero-odds-btn" :class="{ selected: selectedBets.has(`1-_-${out.id}`) }"
              @click="toggleBet('1', '_', out.id, 'Match Result', out.label, out.odds)">
              <span class="hob-lbl">{{ out.label }}</span>
              <span class="hob-odds">{{ out.odds }}</span>
            </button>
          </div>
        </div>

        <!-- Live Pitch Tracker -->
        <div class="tracker-card">
          <div class="tracker-head">
            <span class="tracker-title">⚽ LIVE TRACKER</span>
            <span class="tracker-status-badge" :class="statusCls">{{ statusText }}</span>
          </div>

          <div class="pitch-wrap">
            <svg class="pitch-svg" viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2d6a2d"/>
                  <stop offset="50%" stop-color="#35783a"/>
                  <stop offset="100%" stop-color="#2d6a2d"/>
                </linearGradient>
              </defs>
              <!-- Grass stripes -->
              <rect width="500" height="320" rx="6" fill="url(#pitchGrad)"/>
              <rect x="0" y="0" width="500" height="53" rx="0" fill="rgba(0,0,0,0.06)"/>
              <rect x="0" y="106" width="500" height="53" rx="0" fill="rgba(0,0,0,0.06)"/>
              <rect x="0" y="213" width="500" height="53" rx="0" fill="rgba(0,0,0,0.06)"/>
              <!-- Boundary -->
              <rect x="10" y="10" width="480" height="300" rx="3" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <!-- Centre line -->
              <line x1="250" y1="10" x2="250" y2="310" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <!-- Centre circle -->
              <circle cx="250" cy="160" r="52" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <circle cx="250" cy="160" r="3" fill="rgba(255,255,255,0.7)"/>
              <!-- Left penalty area -->
              <rect x="10" y="88" width="90" height="144" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <!-- Left goal area -->
              <rect x="10" y="123" width="35" height="74" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <!-- Left penalty spot -->
              <circle cx="83" cy="160" r="3" fill="rgba(255,255,255,0.6)"/>
              <!-- Left penalty arc -->
              <path d="M100 128 A52 52 0 0 1 100 192" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <!-- Right penalty area -->
              <rect x="400" y="88" width="90" height="144" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <!-- Right goal area -->
              <rect x="455" y="123" width="35" height="74" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <!-- Right penalty spot -->
              <circle cx="417" cy="160" r="3" fill="rgba(255,255,255,0.6)"/>
              <!-- Right penalty arc -->
              <path d="M400 128 A52 52 0 0 0 400 192" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <!-- Goals -->
              <rect x="5" y="138" width="8" height="44" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
              <rect x="487" y="138" width="8" height="44" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
              <!-- Corner arcs -->
              <path d="M10,30 Q22,10 30,10" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
              <path d="M490,30 Q478,10 470,10" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
              <path d="M10,290 Q22,310 30,310" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
              <path d="M490,290 Q478,310 470,310" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>

              <!-- Goal incident dots on pitch -->
              <g v-for="inc in goalIncidents" :key="'g'+inc.id">
                <circle :cx="incidentX(inc)" :cy="inc.isHome ? 110 : 210" r="10"
                  :fill="inc.isHome ? '#e84c6b' : '#4a90e2'" opacity="0.95"/>
                <text :x="incidentX(inc)" :y="inc.isHome ? 115 : 215"
                  text-anchor="middle" font-size="10" fill="white" font-weight="bold">⚽</text>
              </g>

              <!-- Team logos (pre-match) -->
              <image v-if="!isLive && !isFinished && homeLogo" :href="homeLogo" x="60" y="125" width="70" height="70" preserveAspectRatio="xMidYMid meet" opacity="0.75"/>
              <image v-if="!isLive && !isFinished && awayLogo" :href="awayLogo" x="370" y="125" width="70" height="70" preserveAspectRatio="xMidYMid meet" opacity="0.75"/>
            </svg>

            <!-- Pre-match overlay -->
            <div v-if="!isLive && !isFinished" class="pitch-prematch-overlay">
              <div class="ppo-label">KICK OFF</div>
              <div class="ppo-time">{{ matchTimeStr }}</div>
              <div v-if="countdown" class="ppo-countdown">{{ countdown }}</div>
            </div>
          </div>

          <!-- Incidents timeline -->
          <div v-if="incidents.length" class="incident-timeline">
            <div v-for="inc in incidents" :key="inc.id" class="incident-row" :class="{ 'inc-home': inc.isHome, 'inc-away': !inc.isHome }">
              <div v-if="inc.isHome" class="inc-home-side">
                <span class="inc-player">{{ inc.player }}</span>
                <span class="inc-icon">{{ incidentIcon(inc.type) }}</span>
                <span class="inc-time">{{ inc.time }}'</span>
              </div>
              <div v-else class="inc-away-side">
                <span class="inc-time">{{ inc.time }}'</span>
                <span class="inc-icon">{{ incidentIcon(inc.type) }}</span>
                <span class="inc-player">{{ inc.player }}</span>
              </div>
            </div>
          </div>
          <div v-else class="tracker-empty">
            <span v-if="isLive">Tracking live events…</span>
            <span v-else>Match events will appear here once the game begins</span>
          </div>
        </div>

        <!-- Win Probability -->
        <div class="prob-card" v-if="homeWinPct > 0 || drawPct > 0 || awayWinPct > 0">
          <div class="prob-title">WIN PROBABILITY (from market odds)</div>
          <div class="prob-body">
            <div class="prob-item">
              <div class="prob-team">
                <img v-if="homeLogo" :src="homeLogo" class="prob-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span>{{ homeName }}</span>
              </div>
              <div class="prob-bar-wrap">
                <div class="prob-bar"><div class="prob-fill home-pfill" :style="{ width: homeWinPct + '%' }"></div></div>
              </div>
              <span class="prob-pct home-pct">{{ homeWinPct }}%</span>
            </div>
            <div class="prob-item">
              <div class="prob-team"><span class="prob-draw-icon">═</span><span>Draw</span></div>
              <div class="prob-bar-wrap">
                <div class="prob-bar"><div class="prob-fill draw-pfill" :style="{ width: drawPct + '%' }"></div></div>
              </div>
              <span class="prob-pct draw-pct">{{ drawPct }}%</span>
            </div>
            <div class="prob-item">
              <div class="prob-team">
                <img v-if="awayLogo" :src="awayLogo" class="prob-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span>{{ awayName }}</span>
              </div>
              <div class="prob-bar-wrap">
                <div class="prob-bar"><div class="prob-fill away-pfill" :style="{ width: awayWinPct + '%' }"></div></div>
              </div>
              <span class="prob-pct away-pct">{{ awayWinPct }}%</span>
            </div>
          </div>
        </div>

        <!-- Match Info -->
        <div class="match-info-card">
          <div class="mic-title">MATCH INFO</div>
          <div class="mic-grid">
            <div class="mic-row"><span class="mic-lbl">Tournament</span><span class="mic-val">{{ tournamentName }}</span></div>
            <div class="mic-row"><span class="mic-lbl">Season</span><span class="mic-val">{{ seasonName }}</span></div>
            <div class="mic-row"><span class="mic-lbl">Round</span><span class="mic-val">{{ roundName }}</span></div>
            <div class="mic-row"><span class="mic-lbl">Status</span><span class="mic-val">{{ statusText }}</span></div>
            <div class="mic-row"><span class="mic-lbl">Neutral Ground</span><span class="mic-val">{{ isNeutralGround ? '✓ Yes' : '✗ No' }}</span></div>
            <div class="mic-row"><span class="mic-lbl">Active Markets</span><span class="mic-val">{{ marketCount }}</span></div>
            <div class="mic-row" v-if="isNeutralGround !== null"><span class="mic-lbl">Coverage</span><span class="mic-val">{{ coverageSource }}</span></div>
          </div>
        </div>

        <!-- Lineups (SofaScore) -->
        <div v-if="lineups.home.length || lineups.away.length" class="lineups-card">
          <div class="lu-title">LINEUPS</div>
          <div class="lu-body">
            <div class="lu-col">
              <div class="lu-team-header">
                <img v-if="homeLogo" :src="homeLogo" class="lu-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span>{{ homeName }}</span>
              </div>
              <div v-for="p in lineups.home" :key="p.id" class="lu-player">
                <span class="lu-num">{{ p.jerseyNumber }}</span>
                <span class="lu-name">{{ p.name }}</span>
                <span class="lu-pos">{{ p.position }}</span>
              </div>
            </div>
            <div class="lu-divider"></div>
            <div class="lu-col">
              <div class="lu-team-header">
                <img v-if="awayLogo" :src="awayLogo" class="lu-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span>{{ awayName }}</span>
              </div>
              <div v-for="p in lineups.away" :key="p.id" class="lu-player">
                <span class="lu-num">{{ p.jerseyNumber }}</span>
                <span class="lu-name">{{ p.name }}</span>
                <span class="lu-pos">{{ p.position }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right column -->
      <div class="detail-right">
        <!-- Market highlights -->
        <div class="right-markets-card">
          <div class="rmc-title">KEY MARKETS</div>

          <div v-for="km in keyMarkets" :key="km.name" class="rmc-market">
            <div class="rmc-market-name">{{ km.name }}</div>
            <div class="rmc-outcomes">
              <button v-for="out in km.outcomes" :key="out.id"
                class="rmc-btn" :class="{ selected: selectedBets.has(`${km.marketId}-${km.specKey}-${out.id}`) }"
                @click="toggleBet(km.marketId, km.specKey, out.id, km.name, out.label, out.odds)">
                <span class="rmc-lbl">{{ out.label }}</span>
                <span class="rmc-odds">{{ out.odds }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Selected bets summary -->
        <div v-if="selectedBetsList.length" class="slip-card">
          <div class="slip-title">SELECTIONS ({{ selectedBetsList.length }})</div>
          <div v-for="bet in selectedBetsList" :key="bet.key" class="slip-item">
            <div class="slip-market">{{ bet.marketName }}</div>
            <div class="slip-row">
              <span class="slip-outcome">{{ bet.label }}</span>
              <span class="slip-odds-val">{{ bet.odds }}</span>
              <button class="slip-remove" @click="removeBet(bet.key)">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ ODDS TAB ═══════════════ -->
    <div v-else-if="activeTab === 'odds'" class="detail-body odds-body">
      <div class="detail-main">

        <!-- Status bar -->
        <div class="odds-status-bar">
          <div class="osb-teams">
            <img v-if="homeLogo" :src="homeLogo" class="osb-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
            <span class="osb-name">{{ homeName }}</span>
            <span class="osb-score-txt" v-if="isLive || isFinished">{{ liveScore.home }} : {{ liveScore.away }}</span>
            <span class="osb-vs" v-else>vs</span>
            <span class="osb-name">{{ awayName }}</span>
            <img v-if="awayLogo" :src="awayLogo" class="osb-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
          </div>
          <div class="osb-right">
            <span class="osb-badge" :class="statusCls">{{ statusText }}</span>
            <span class="osb-mkt">{{ marketCount }} markets</span>
          </div>
        </div>

        <!-- Category filter -->
        <div class="mkt-category-bar">
          <button v-for="cat in allCategories" :key="cat"
            class="mkt-cat-btn" :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat">{{ cat }}</button>
        </div>

        <!-- Markets list -->
        <div class="markets-list">
          <div v-for="mkt in filteredMarkets" :key="`${mkt.marketId}-${mkt.specKey}`" class="market-card">
            <div class="market-header" @click="mkt.open = !mkt.open">
              <span class="market-icon">{{ mkt.icon }}</span>
              <div class="market-hdr-info">
                <span class="market-name">{{ mkt.name }}</span>
                <span v-if="mkt.specLabel" class="market-spec-badge">{{ mkt.specLabel }}</span>
              </div>
              <span class="market-sel-count">{{ mkt.outcomes.length }} sel.</span>
              <span class="market-toggle">{{ mkt.open ? '▲' : '▼' }}</span>
            </div>
            <div v-if="mkt.open" class="market-outcomes">
              <div v-for="out in mkt.outcomes" :key="out.id"
                class="outcome-btn"
                :class="{ selected: selectedBets.has(`${mkt.marketId}-${mkt.specKey}-${out.id}`) }"
                @click="toggleBet(mkt.marketId, mkt.specKey, out.id, mkt.name, out.label, out.odds)">
                <span class="out-lbl">{{ out.label }}</span>
                <span class="out-odds">{{ out.odds }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="detail-right">
        <div v-if="selectedBetsList.length" class="slip-card">
          <div class="slip-title">SELECTIONS</div>
          <div v-for="bet in selectedBetsList" :key="bet.key" class="slip-item">
            <div class="slip-market">{{ bet.marketName }}</div>
            <div class="slip-row">
              <span class="slip-outcome">{{ bet.label }}</span>
              <span class="slip-odds-val">{{ bet.odds }}</span>
              <button class="slip-remove" @click="removeBet(bet.key)">×</button>
            </div>
          </div>
        </div>
        <div v-else class="slip-hint-card">
          <div>🛒</div>
          <div class="slip-hint-text">Click any odds button to add to your selection</div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ STATS TAB ═══════════════ -->
    <div v-else-if="activeTab === 'stats'" class="detail-body stats-body">

      <!-- Loading state -->
      <div v-if="statsLoading" class="stats-loading">
        <div class="md-spinner"></div><span>Fetching live data from SofaScore…</span>
      </div>

      <!-- No data fallback -->
      <div v-else-if="!matchStats.length && !h2hMeetings.length && !standings.length" class="stats-empty">
        <div class="stats-empty-icon">📡</div>
        <div class="stats-empty-title">Stats not available</div>
        <div class="stats-empty-sub">SofaScore data will appear here once the match is indexed</div>
      </div>

      <template v-else>

        <!-- ── Match Statistics ── -->
        <div v-if="matchStats.length" class="stats-card">
          <div class="stats-card-header">
            <span class="stats-card-icon">⚡</span>
            <span>Match Statistics</span>
            <span class="stats-badge">LIVE</span>
          </div>
          <div class="stats-card-body">
            <div class="stat-teams-hdr">
              <div class="stat-team-lbl">
                <img v-if="homeLogo" :src="homeLogo" class="stat-team-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                {{ homeName }}
              </div>
              <div class="stat-team-lbl away-lbl">
                {{ awayName }}
                <img v-if="awayLogo" :src="awayLogo" class="stat-team-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
              </div>
            </div>
            <div v-for="stat in matchStats" :key="stat.name" class="stat-row">
              <span class="stat-val home-val">{{ stat.home }}</span>
              <div class="stat-bars">
                <div class="stat-bar-wrap home-bar">
                  <div class="stat-bar-fill home-fill" :style="{ width: statBarPct(stat.homeNum, stat.awayNum, true) + '%' }"></div>
                </div>
                <span class="stat-name">{{ stat.name }}</span>
                <div class="stat-bar-wrap away-bar">
                  <div class="stat-bar-fill away-fill" :style="{ width: statBarPct(stat.homeNum, stat.awayNum, false) + '%' }"></div>
                </div>
              </div>
              <span class="stat-val away-val">{{ stat.away }}</span>
            </div>
          </div>
        </div>

        <!-- ── H2H Meetings ── -->
        <div v-if="h2hMeetings.length" class="stats-card">
          <div class="stats-card-header">
            <span class="stats-card-icon">⚔️</span>
            <span>Head to Head</span>
            <span class="stats-count">Last {{ h2hMeetings.length }} meetings</span>
          </div>
          <div class="stats-card-body">
            <!-- H2H summary bar -->
            <div class="h2h-summary">
              <div class="h2h-sum-team">
                <img v-if="homeLogo" :src="homeLogo" class="h2h-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span class="h2h-sum-name">{{ homeName }}</span>
                <span class="h2h-sum-num">{{ h2hMeetings.filter(m => h2hResultFor(m, sofaHomeTeamId) === 'W').length }}</span>
              </div>
              <div class="h2h-sum-mid">
                <span class="h2h-draw-num">{{ h2hMeetings.filter(m => h2hResultFor(m, sofaHomeTeamId) === 'D').length }}</span>
                <span class="h2h-draw-lbl">Draws</span>
              </div>
              <div class="h2h-sum-team away-sum">
                <span class="h2h-sum-num">{{ h2hMeetings.filter(m => h2hResultFor(m, sofaAwayTeamId) === 'W').length }}</span>
                <span class="h2h-sum-name">{{ awayName }}</span>
                <img v-if="awayLogo" :src="awayLogo" class="h2h-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
              </div>
            </div>

            <!-- Meeting list -->
            <div v-for="m in h2hMeetings" :key="m.id" class="h2h-row">
              <span class="h2h-date">{{ m.date }}</span>
              <span class="h2h-tourn">{{ m.tournament }}</span>
              <div class="h2h-match">
                <span class="h2h-team" :class="{ 'h2h-win': m.homeScore > m.awayScore }">{{ m.homeTeam }}</span>
                <div class="h2h-score-box">
                  <span class="h2h-s">{{ m.homeScore }}</span>
                  <span class="h2h-sdash">-</span>
                  <span class="h2h-s">{{ m.awayScore }}</span>
                </div>
                <span class="h2h-team h2h-team-away" :class="{ 'h2h-win': m.awayScore > m.homeScore }">{{ m.awayTeam }}</span>
              </div>
              <span class="h2h-result-badge" :class="h2hResultFor(m, sofaHomeTeamId) === 'W' ? 'badge-w' : h2hResultFor(m, sofaHomeTeamId) === 'L' ? 'badge-l' : 'badge-d'">
                {{ h2hResultFor(m, sofaHomeTeamId) }}
              </span>
            </div>
          </div>
        </div>

        <!-- ── Team Form ── -->
        <div v-if="homeForm.length || awayForm.length" class="stats-card">
          <div class="stats-card-header">
            <span class="stats-card-icon">📋</span>
            <span>Recent Form</span>
            <span class="stats-count">Last 5 matches</span>
          </div>
          <div class="stats-card-body form-body">
            <div class="form-row">
              <div class="form-team-info">
                <img v-if="homeLogo" :src="homeLogo" class="form-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span class="form-team-name">{{ homeName }}</span>
              </div>
              <div class="form-dots">
                <div v-for="(f, i) in homeForm" :key="i" class="form-dot" :class="'form-' + f.result" :title="f.result + ' vs ' + f.opponent + ' (' + f.score + ')'">
                  {{ f.result }}
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-team-info">
                <img v-if="awayLogo" :src="awayLogo" class="form-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span class="form-team-name">{{ awayName }}</span>
              </div>
              <div class="form-dots">
                <div v-for="(f, i) in awayForm" :key="i" class="form-dot" :class="'form-' + f.result" :title="f.result + ' vs ' + f.opponent + ' (' + f.score + ')'">
                  {{ f.result }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── League Standings ── -->
        <div v-if="standings.length" class="stats-card standings-card">
          <div class="stats-card-header">
            <span class="stats-card-icon">🏆</span>
            <span>{{ tournamentName }}</span>
            <span class="stats-count">Standings</span>
          </div>
          <div class="standings-table-wrap">
            <table class="standings-table">
              <thead>
                <tr>
                  <th class="st-pos">#</th>
                  <th class="st-team">Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                  <th class="st-pts">Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in standings" :key="row.teamId"
                    :class="{ 'st-highlighted': row.teamId === sofaHomeTeamId || row.teamId === sofaAwayTeamId }">
                  <td class="st-pos">{{ row.position }}</td>
                  <td class="st-team">
                    <span class="st-team-name">{{ row.teamName }}</span>
                  </td>
                  <td>{{ row.matches }}</td>
                  <td>{{ row.wins }}</td>
                  <td>{{ row.draws }}</td>
                  <td>{{ row.losses }}</td>
                  <td>{{ row.goalsFor }}</td>
                  <td>{{ row.goalsAgainst }}</td>
                  <td :class="row.goalsFor - row.goalsAgainst > 0 ? 'gd-pos' : row.goalsFor - row.goalsAgainst < 0 ? 'gd-neg' : ''">
                    {{ row.goalsFor - row.goalsAgainst > 0 ? '+' : '' }}{{ row.goalsFor - row.goalsAgainst }}
                  </td>
                  <td class="st-pts">{{ row.points }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </template>
    </div>

    <!-- ═══════════════ AI TAB ═══════════════ -->
    <div v-else-if="activeTab === 'ai'" class="detail-body ai-body">
      <div class="ai-panel">
        <div class="ai-header">
          <div class="ai-logo">🤖</div>
          <div>
            <div class="ai-title">BETWIN AI Assistant</div>
            <div class="ai-subtitle">Ask anything about {{ homeName }} vs {{ awayName }}</div>
          </div>
          <div class="ai-online"><span class="ai-dot"></span> Online</div>
        </div>
        <div v-if="chatMessages.length === 0" class="ai-suggestions">
          <button v-for="s in suggestions" :key="s" class="suggestion-chip" @click="sendSuggestion(s)">{{ s }}</button>
        </div>
        <div class="chat-messages" ref="chatContainer">
          <div v-for="(msg, i) in chatMessages" :key="i" class="chat-msg" :class="msg.role">
            <div v-if="msg.role === 'assistant'" class="msg-avatar">🤖</div>
            <div class="msg-bubble">
              <span v-if="msg.typing" class="typing-dots"><span></span><span></span><span></span></span>
              <span v-else>{{ msg.content }}</span>
            </div>
            <div v-if="msg.role === 'user'" class="msg-avatar user-avatar">👤</div>
          </div>
        </div>
        <div class="chat-input-area">
          <input v-model="chatInput" class="chat-input"
            :placeholder="`Ask about ${homeName} vs ${awayName}…`"
            @keydown.enter="sendMessage" :disabled="aiLoading" />
          <button class="chat-send" @click="sendMessage" :disabled="aiLoading || !chatInput.trim()">
            {{ aiLoading ? '…' : '➤' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ PREDICTION TAB ═══════════════ -->
    <div v-else-if="activeTab === 'prediction'" class="detail-body">
      <div class="detail-main">

        <div class="pred-hero-card">
          <div class="pred-badge">🔮 AI PREDICTION</div>
          <div class="pred-match-title">{{ homeName }} vs {{ awayName }}</div>
          <div class="pred-meta">{{ tournamentName }} · {{ roundName }}</div>
          <div class="pred-verdict">
            <div class="pred-verdict-lbl">Predicted Winner</div>
            <div class="pred-verdict-val">{{ predictedWinner }}</div>
            <div class="pred-confidence">Confidence: <b>{{ predictedConfidence }}%</b></div>
          </div>
        </div>

        <!-- Real win probability from betmaster p values -->
        <div class="pred-prob-card">
          <div class="ppc-title">WIN PROBABILITY (real odds implied)</div>
          <div class="ppc-body">
            <div class="ppc-row">
              <div class="ppc-team">
                <img v-if="homeLogo" :src="homeLogo" class="ppc-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span>{{ homeName }}</span>
              </div>
              <div class="ppc-bar-track">
                <div class="ppc-bar-fill home-pred-fill" :style="{ width: homeWinPct + '%' }">
                  <span class="ppc-pct-label" v-if="homeWinPct > 8">{{ homeWinPct }}%</span>
                </div>
              </div>
              <span class="ppc-pct home-pct">{{ homeWinPct }}%</span>
            </div>
            <div class="ppc-row">
              <div class="ppc-team"><span class="draw-dash">━</span><span>Draw</span></div>
              <div class="ppc-bar-track">
                <div class="ppc-bar-fill draw-pred-fill" :style="{ width: drawPct + '%' }">
                  <span class="ppc-pct-label" v-if="drawPct > 8">{{ drawPct }}%</span>
                </div>
              </div>
              <span class="ppc-pct draw-pct">{{ drawPct }}%</span>
            </div>
            <div class="ppc-row">
              <div class="ppc-team">
                <img v-if="awayLogo" :src="awayLogo" class="ppc-logo" @error="($event.target as HTMLImageElement).style.display='none'" />
                <span>{{ awayName }}</span>
              </div>
              <div class="ppc-bar-track">
                <div class="ppc-bar-fill away-pred-fill" :style="{ width: awayWinPct + '%' }">
                  <span class="ppc-pct-label" v-if="awayWinPct > 8">{{ awayWinPct }}%</span>
                </div>
              </div>
              <span class="ppc-pct away-pct">{{ awayWinPct }}%</span>
            </div>
          </div>
        </div>

        <!-- Market predictions from real odds p values -->
        <div class="pred-markets-card">
          <div class="pmc-title">MARKET PREDICTIONS</div>
          <div class="pmc-body">
            <div v-for="pm in marketPredictions" :key="pm.label" class="pm-row">
              <span class="pm-label">{{ pm.label }}</span>
              <div class="pm-bar-wrap">
                <div class="pm-bar"><div class="pm-fill" :class="pm.cls" :style="{ width: pm.pct + '%' }"></div></div>
              </div>
              <span class="pm-pct">{{ pm.pct }}%</span>
              <span class="pm-verdict" :class="pm.verdict === 'YES' ? 'pm-yes' : 'pm-no'">{{ pm.verdict }}</span>
            </div>
          </div>
        </div>

      </div>

      <div class="detail-right">
        <div class="pred-tip-card">
          <div class="ptc-header">💡 BEST BET</div>
          <div class="ptc-body">
            <div class="ptc-market">Match Result</div>
            <div class="ptc-selection">{{ predictedWinner === homeName ? '1 (Home)' : predictedWinner === awayName ? '2 (Away)' : 'X (Draw)' }}</div>
            <div class="ptc-odds-lbl">Recommended Odds</div>
            <div class="ptc-odds-val">{{ predictedOdds }}</div>
            <div class="ptc-conf-lbl">AI Confidence</div>
            <div class="ptc-bar"><div class="ptc-bar-fill" :style="{ width: predictedConfidence + '%' }"></div></div>
            <div class="ptc-conf-pct">{{ predictedConfidence }}%</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useBetSlip } from '@/composables/useBetSlip'

interface MatchProp {
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
  homeLogo?: string
  awayLogo?: string
}
interface LeagueProp { flag: string; sport: string; name: string }

const props = defineProps<{ match: MatchProp; league: LeagueProp; initialTab?: string }>()
const emit = defineEmits<{ close: [] }>()

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',   label: 'Overview',   icon: '📊' },
  { id: 'stats',      label: 'Stats',      icon: '📈' },
  { id: 'odds',       label: 'Odds',       icon: '🎲' },
  { id: 'ai',         label: 'AI',         icon: '🤖' },
  { id: 'prediction', label: 'Prediction', icon: '🔮' },
]
const activeTab = ref(props.initialTab ?? 'overview')

// ─── State ───────────────────────────────────────────────────────────────────
const loading = ref(true)
const bmData  = ref<Record<string, unknown> | null>(null)

interface Incident { id: number; time: number; type: string; player: string; isHome: boolean }
interface Player    { id: number; name: string; jerseyNumber: string; position: string }
interface H2HEvent  { id: number; date: string; homeTeam: string; awayTeam: string; homeScore: number; awayScore: number; tournament: string; homeId: number; awayId: number }
interface StatItem  { name: string; home: string; away: string; homeNum: number; awayNum: number }
interface Standing  { position: number; teamId: number; teamName: string; teamShort: string; matches: number; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; points: number; form: string }
interface FormMatch { result: 'W' | 'D' | 'L'; score: string; opponent: string }

const incidents    = ref<Incident[]>([])
const lineups      = ref<{ home: Player[]; away: Player[] }>({ home: [], away: [] })
const h2hMeetings  = ref<H2HEvent[]>([])
const homeForm     = ref<FormMatch[]>([])
const awayForm     = ref<FormMatch[]>([])
const matchStats   = ref<StatItem[]>([])
const standings    = ref<Standing[]>([])
const sofaHomeTeamId = ref(0)
const sofaAwayTeamId = ref(0)
const statsLoading   = ref(false)

let pollTimer: ReturnType<typeof setInterval> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null
const countdown = ref('')

// ─── Bet slip (shared composable) ────────────────────────────────────────────
const { toggleBet: _sharedToggle, removeBet: _sharedRemove, hasBet, slipItems } = useBetSlip()

function betKey(marketId: string, specKey: string, outcomeId: string) {
  return `detail-${props.match.id}-${marketId}-${specKey}-${outcomeId}`
}
function toggleBet(marketId: string, specKey: string, outcomeId: string, marketName: string, label: string, odds: string) {
  const key = betKey(marketId, specKey, outcomeId)
  _sharedToggle({ key, label, odds, matchName: `${props.match.team1} vs ${props.match.team2}`, market: marketName })
}
function removeBet(key: string) { _sharedRemove(key) }

const selectedBets = computed(() => ({
  has: (localKey: string) => {
    // localKey is in format `${marketId}-${specKey}-${outcomeId}`
    const full = `detail-${props.match.id}-${localKey}`
    return hasBet(full)
  }
}))
const selectedBetsList = computed(() =>
  slipItems.value
    .filter(b => b.key.startsWith(`detail-${props.match.id}-`))
    .map(b => ({ key: b.key, marketName: b.market, label: b.label, odds: b.odds }))
)

// ─── Betmaster data helpers ───────────────────────────────────────────────────
function gn(obj: unknown, ...path: string[]): unknown {
  let cur: unknown = obj
  for (const k of path) { if (!cur || typeof cur !== 'object') return undefined; cur = (cur as Record<string, unknown>)[k] }
  return cur
}
function gs(obj: unknown, ...path: string[]): string { return (gn(obj, ...path) as string) ?? '' }
function gn2(obj: unknown, ...path: string[]): number { return Number(gn(obj, ...path) ?? 0) }

// ─── Core computed from bmData ────────────────────────────────────────────────
const infoStatic  = computed(() => gn(bmData.value, 'info_static') as Record<string, unknown> ?? {})
const infoDynamic = computed(() => gn(bmData.value, 'info_dynamic') as Record<string, unknown> ?? {})
const oddsRoot    = computed(() => gn(bmData.value, 'odds', 'sr1', '3') as Record<string, unknown> ?? {})

const homeName = computed(() => gs(infoStatic.value, 'competitor_home', 'name', 'en') || props.match.team1)
const awayName = computed(() => gs(infoStatic.value, 'competitor_away', 'name', 'en') || props.match.team2)
const homeLogo = computed(() => gs(infoStatic.value, 'competitor_home', 'logo_url') || props.match.homeLogo || '')
const awayLogo = computed(() => gs(infoStatic.value, 'competitor_away', 'logo_url') || props.match.awayLogo || '')
const homeId   = computed(() => gn2(infoStatic.value, 'competitor_home', 'id'))
const awayId   = computed(() => gn2(infoStatic.value, 'competitor_away', 'id'))

const tournamentName = computed(() => gs(infoStatic.value, 'tournament', 'name', 'en') || props.league.name)
const tournamentLogo = computed(() => gs(infoStatic.value, 'tournament', 'logo_url'))
const categoryLogo   = computed(() => gs(infoStatic.value, 'category', 'logo_url'))
const sportName      = computed(() => gs(infoStatic.value, 'sport', 'name', 'en') || 'Soccer')
const roundName      = computed(() => gs(infoStatic.value, 'round', 'name', 'en'))
const seasonName     = computed(() => gs(infoStatic.value, 'season', 'name', 'en'))
const isNeutralGround = computed(() => gn(infoStatic.value, 'extra', 'neutral_ground') as boolean ?? false)
const coverageSource  = computed(() => gs(infoStatic.value, 'extra', 'coverage_source'))

const eventStatus  = computed(() => gn2(infoDynamic.value, 'event_status'))
const statusText   = computed(() => gs(infoDynamic.value, 'competition_status', 'name', 'en') || 'Not started')
const isLive       = computed(() => eventStatus.value === 1)
const isFinished   = computed(() => eventStatus.value === 2)
const statusCls    = computed(() => isLive.value ? 'status-live' : isFinished.value ? 'status-finished' : 'status-prematch')

const liveScore   = computed(() => {
  const sc = gn(infoDynamic.value, 'score') as Record<string, unknown> | null
  return { home: sc ? gn2(sc, 'home_score') : 0, away: sc ? gn2(sc, 'away_score') : 0 }
})
const matchClock  = computed(() => gs(infoDynamic.value, 'clock', 'played') || '0')
const periodScores = computed(() => {
  const ps = gn(infoDynamic.value, 'period_scores')
  if (!ps || !Array.isArray(ps)) return []
  return (ps as unknown[]).map((p: unknown) => ({ home: gn2(p as Record<string, unknown>, 'home_score'), away: gn2(p as Record<string, unknown>, 'away_score'), number: gn2(p as Record<string, unknown>, 'number') }))
})

const marketCount = computed(() => gn2(infoDynamic.value, 'markets_stats', 'sr1', '3', 'active_counter'))

const startTimeMs = computed(() => {
  const raw = gn2(infoStatic.value, 'start_time')
  if (raw > 0) return raw > 1e12 ? raw : raw * 1000
  // Parse display date 'DD.MM.YY' or 'DD.MM.YYYY'
  const parts = props.match.date.split('.')
  if (parts.length === 3) {
    const [dd, mm, yy] = parts
    const yyyy = yy.length === 2 ? 2000 + parseInt(yy) : parseInt(yy)
    return new Date(yyyy, parseInt(mm) - 1, parseInt(dd)).getTime()
  }
  return Date.now()
})
const matchDateStr = computed(() => {
  if (!startTimeMs.value) return props.match.date
  const d = new Date(startTimeMs.value)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
})
const matchTimeStr = computed(() => {
  if (!startTimeMs.value) return props.match.time
  const d = new Date(startTimeMs.value)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
})

// ─── Countdown ───────────────────────────────────────────────────────────────
function updateCountdown() {
  if (!startTimeMs.value || isLive.value || isFinished.value) { countdown.value = ''; return }
  const diff = startTimeMs.value - Date.now()
  if (diff <= 0) { countdown.value = 'Starting now'; return }
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  countdown.value = h > 0
    ? `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
    : `${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
}

// ─── Market parsing ──────────────────────────────────────────────────────────
interface ParsedOutcome { id: string; label: string; odds: string; p: number }
interface ParsedMarket  {
  marketId: string; specKey: string; specLabel: string
  name: string; icon: string; category: string
  outcomes: ParsedOutcome[]
  open: boolean
}

const MARKET_META: Record<string, { name: string; icon: string; category: string }> = {
  '1':  { name: 'Match Result',           icon: '⚽', category: 'Main' },
  '2':  { name: 'Home / Away',            icon: '🏆', category: 'Main' },
  '8':  { name: 'Next Goal',              icon: '🥅', category: 'Goals' },
  '9':  { name: 'Last Goal',              icon: '🏁', category: 'Goals' },
  '10': { name: 'Double Chance',          icon: '🎯', category: 'Main' },
  '11': { name: 'Draw No Bet',            icon: '🛡',  category: 'Main' },
  '12': { name: 'Home Team To Score',     icon: '🔴', category: 'Goals' },
  '13': { name: 'Both Teams To Score',    icon: '🔵', category: 'Goals' },
  '14': { name: '3-Way Asian Handicap',   icon: '⚖', category: 'Handicap' },
  '15': { name: 'Winning Margin',         icon: '📊', category: 'Special' },
  '16': { name: 'Asian Handicap',         icon: '⚖', category: 'Handicap' },
  '18': { name: 'Total Goals (O/U)',      icon: '🔢', category: 'Goals' },
  '19': { name: '1st Half O/U',           icon: '1️⃣', category: 'Period' },
  '20': { name: '2nd Half O/U',           icon: '2️⃣', category: 'Period' },
  '21': { name: 'Odd / Even Goals',       icon: '🔄', category: 'Special' },
  '22': { name: '1st Half Odd / Even',    icon: '1️⃣', category: 'Period' },
  '29': { name: 'Match Result & BTTS',    icon: '⚽', category: 'Main' },
  '37': { name: 'Anytime Goalscorer',     icon: '👟', category: 'Goals' },
  '60': { name: '1st Half Result',        icon: '1️⃣', category: 'Period' },
  '83': { name: '2nd Half Result',        icon: '2️⃣', category: 'Period' },
}

function outcomeLabel(marketId: string, outcomeId: string): string {
  const map: Record<string, string> = {
    '1':'1','2':'X','3':'2',
    '4':'1','5':'2',
    '6': homeName.value || 'Home',
    '7':'No Goal',
    '8': awayName.value || 'Away',
    '9':'1X','10':'X2','11':'12',
    '12':'Over','13':'Under',
    '74':'1X','76':'X2',
    '776':'Yes','778':'No',
    '780':'Yes','782':'No',
    '1711':'1','1712':'X','1713':'2',
    '1714':'1','1715':'2',
  }
  if (map[outcomeId]) return map[outcomeId]
  if (outcomeId.startsWith('sr:winning_margin')) {
    const parts = outcomeId.split(':')
    return parts[parts.length - 1] ?? outcomeId
  }
  return outcomeId
}

function specLabel(specKey: string): string {
  if (specKey === '_') return ''
  const s = specKey.replace(/\\u002e/gi, '.').replace(/\\u003a/gi, ':')
  if (s.startsWith('total='))    return `O/U ${s.replace('total=','')}`
  if (s.startsWith('hcp='))      return `Hcp ${s.replace('hcp=','')}`
  if (s.startsWith('goalnr='))   return `${s.replace('goalnr=','')}${s === 'goalnr=1' ? 'st' : 'th'} Goal`
  if (s.startsWith('variant='))  return s.replace('variant=sr:winning_margin:','Margin ')
  return s
}

const allParsedMarkets = computed((): ParsedMarket[] => {
  const result: ParsedMarket[] = []
  const odds = oddsRoot.value
  if (!odds) return result

  for (const [marketId, marketData] of Object.entries(odds)) {
    const m = marketData as Record<string, unknown>
    const sp = m.sp as Record<string, unknown>
    if (!sp) continue
    const meta = MARKET_META[marketId] ?? { name: `Market ${marketId}`, icon: '📈', category: 'Other' }

    for (const [specKey, specData] of Object.entries(sp)) {
      const sd = specData as Record<string, unknown>
      if (sd.st === 3) continue  // suspended
      const outMap = sd.out as Record<string, unknown>
      if (!outMap) continue

      const outcomes: ParsedOutcome[] = []
      for (const [outcomeId, outData] of Object.entries(outMap)) {
        const od = outData as Record<string, unknown>
        if (od.st === 3) continue
        outcomes.push({
          id:    outcomeId,
          label: outcomeLabel(marketId, outcomeId),
          odds:  Number(od.o ?? 0).toFixed(2),
          p:     Number(od.p ?? 0),
        })
      }
      if (!outcomes.length) continue

      result.push({
        marketId,
        specKey,
        specLabel: specLabel(specKey),
        name:     meta.name,
        icon:     meta.icon,
        category: meta.category,
        outcomes,
        open: marketId === '1',
      })
    }
  }

  // Sort: Main first, then Goals, Handicap, Period, Special, Other
  const catOrder: Record<string, number> = { Main:1, Goals:2, Handicap:3, Period:4, Special:5, Other:6 }
  result.sort((a, b) => {
    const co = (catOrder[a.category] ?? 9) - (catOrder[b.category] ?? 9)
    if (co !== 0) return co
    return Number(a.marketId) - Number(b.marketId)
  })
  return result
})

const allCategories = computed(() => {
  const cats = new Set(['All'])
  for (const m of allParsedMarkets.value) cats.add(m.category)
  return Array.from(cats)
})
const activeCategory = ref('All')
const filteredMarkets = computed(() =>
  activeCategory.value === 'All'
    ? allParsedMarkets.value
    : allParsedMarkets.value.filter(m => m.category === activeCategory.value)
)

// ─── Quick computed odds ──────────────────────────────────────────────────────
const mainMarketOutcomes = computed(() =>
  allParsedMarkets.value.find(m => m.marketId === '1' && m.specKey === '_')?.outcomes ?? []
)
const bttsOutcomes = computed(() =>
  allParsedMarkets.value.find(m => m.marketId === '13' && m.specKey === '_')?.outcomes ?? []
)
const ouOutcomes = computed(() => {
  const target = allParsedMarkets.value.find(m => m.marketId === '18' && m.specKey.includes('2.5'))
  return target?.outcomes ?? []
})
const dcOutcomes = computed(() =>
  allParsedMarkets.value.find(m => m.marketId === '10' && m.specKey === '_')?.outcomes ?? []
)

const keyMarkets = computed(() => {
  const km = []
  if (mainMarketOutcomes.value.length) km.push({ marketId:'1', specKey:'_', name:'Match Result', outcomes: mainMarketOutcomes.value })
  if (bttsOutcomes.value.length)       km.push({ marketId:'13', specKey:'_', name:'Both Teams To Score', outcomes: bttsOutcomes.value })
  if (ouOutcomes.value.length) {
    const spec = allParsedMarkets.value.find(m => m.marketId === '18' && m.specKey.includes('2.5'))?.specKey ?? 'total=2.5'
    km.push({ marketId:'18', specKey: spec, name:'Total Goals O/U 2.5', outcomes: ouOutcomes.value })
  }
  if (dcOutcomes.value.length)         km.push({ marketId:'10', specKey:'_', name:'Double Chance', outcomes: dcOutcomes.value })
  return km
})

// ─── Win probability (from real betmaster `p` values) ────────────────────────
const rawProbs = computed(() => {
  const market1 = allParsedMarkets.value.find(m => m.marketId === '1' && m.specKey === '_')
  if (!market1) return { home: 0, draw: 0, away: 0 }
  const h = market1.outcomes.find(o => o.id === '1')?.p ?? 0
  const d = market1.outcomes.find(o => o.id === '2')?.p ?? 0
  const a = market1.outcomes.find(o => o.id === '3')?.p ?? 0
  return { home: h, draw: d, away: a }
})
const homeWinPct = computed(() => Math.round(rawProbs.value.home * 100))
const drawPct    = computed(() => Math.round(rawProbs.value.draw  * 100))
const awayWinPct = computed(() => Math.round(rawProbs.value.away  * 100))

const predictedWinner = computed(() => {
  const { home, draw, away } = rawProbs.value
  if (home >= draw && home >= away) return homeName.value
  if (away >= home && away >= draw) return awayName.value
  return 'Draw'
})
const predictedConfidence = computed(() => {
  const { home, draw, away } = rawProbs.value
  return Math.round(Math.max(home, draw, away) * 100)
})
const predictedOdds = computed(() => {
  if (!mainMarketOutcomes.value.length) return '-'
  if (predictedWinner.value === homeName.value) return mainMarketOutcomes.value.find(o => o.id === '1')?.odds ?? '-'
  if (predictedWinner.value === awayName.value) return mainMarketOutcomes.value.find(o => o.id === '3')?.odds ?? '-'
  return mainMarketOutcomes.value.find(o => o.id === '2')?.odds ?? '-'
})

const marketPredictions = computed(() => {
  const preds = []
  const btts = allParsedMarkets.value.find(m => m.marketId === '13' && m.specKey === '_')
  if (btts) {
    const yesP = (btts.outcomes.find(o => o.id === '780')?.p ?? 0) * 100
    preds.push({ label: 'Both Teams To Score', pct: Math.round(yesP), cls: 'pm-green', verdict: yesP > 50 ? 'YES' : 'NO' })
  }
  const ou25 = allParsedMarkets.value.find(m => m.marketId === '18' && m.specKey.includes('2.5'))
  if (ou25) {
    const overP = (ou25.outcomes.find(o => o.id === '12')?.p ?? 0) * 100
    preds.push({ label: 'Over 2.5 Goals', pct: Math.round(overP), cls: 'pm-blue', verdict: overP > 50 ? 'YES' : 'NO' })
  }
  const ou15 = allParsedMarkets.value.find(m => m.marketId === '18' && m.specKey.includes('1.5'))
  if (ou15) {
    const overP = (ou15.outcomes.find(o => o.id === '12')?.p ?? 0) * 100
    preds.push({ label: 'Over 1.5 Goals', pct: Math.round(overP), cls: 'pm-blue', verdict: overP > 50 ? 'YES' : 'NO' })
  }
  if (homeWinPct.value > 0) preds.push({ label: `${homeName.value} to Win`, pct: homeWinPct.value, cls: 'pm-red', verdict: homeWinPct.value > 50 ? 'YES' : 'NO' })
  if (awayWinPct.value > 0) preds.push({ label: `${awayName.value} to Win`, pct: awayWinPct.value, cls: 'pm-purple', verdict: awayWinPct.value > 50 ? 'YES' : 'NO' })
  return preds
})

// ─── Goal incidents for pitch ─────────────────────────────────────────────────
const goalIncidents = computed(() =>
  incidents.value.filter(i => i.type === 'goal' || i.type === 'ownGoal')
)
function incidentX(inc: Incident): number {
  const maxMinutes = 90
  return 10 + (inc.time / maxMinutes) * 480
}
function incidentIcon(type: string): string {
  const m: Record<string, string> = {
    goal:'⚽', ownGoal:'⚽', yellowCard:'🟨', redCard:'🟥',
    yellowRedCard:'🟨🟥', substitution:'🔄', penaltyMissed:'❌'
  }
  return m[type] ?? '•'
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────
const chatMessages = ref<{ role: string; content: string; typing?: boolean }[]>([])
const chatInput    = ref('')
const aiLoading    = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const suggestions = computed(() => [
  `Who will win ${homeName.value} vs ${awayName.value}?`,
  `What are the best odds for ${tournamentName.value}?`,
  `Analyze ${homeName.value}'s recent form`,
  `Predict the scoreline for this match`,
])

async function sendMessage() {
  const text = chatInput.value.trim()
  if (!text || aiLoading.value) return
  chatInput.value = ''
  chatMessages.value.push({ role: 'user', content: text })
  aiLoading.value = true
  chatMessages.value.push({ role: 'assistant', content: '', typing: true })
  await nextTick(); chatContainer.value?.scrollTo({ top: 9999, behavior: 'smooth' })
  try {
    const context = `Match: ${homeName.value} vs ${awayName.value}. Tournament: ${tournamentName.value}. Status: ${statusText.value}. Win probability: Home ${homeWinPct.value}%, Draw ${drawPct.value}%, Away ${awayWinPct.value}%.`
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openai', messages: [
        { role: 'system', content: `You are a sports betting analyst. Context: ${context}` },
        ...chatMessages.value.filter(m => !m.typing).map(m => ({ role: m.role, content: m.content })),
      ]})
    })
    const reply = await res.text()
    const idx = chatMessages.value.findLastIndex(m => m.typing)
    if (idx !== -1) chatMessages.value[idx] = { role: 'assistant', content: reply }
  } catch {
    const idx = chatMessages.value.findLastIndex(m => m.typing)
    if (idx !== -1) chatMessages.value[idx] = { role: 'assistant', content: 'Sorry, I could not connect. Please try again.' }
  } finally {
    aiLoading.value = false
    await nextTick(); chatContainer.value?.scrollTo({ top: 9999, behavior: 'smooth' })
  }
}
function sendSuggestion(s: string) { chatInput.value = s; sendMessage() }

// ─── Data fetching ────────────────────────────────────────────────────────────
async function fetchBetmaster() {
  try {
    const res = await fetch(`/betmaster-api/feed/sr/matches/${props.match.id}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json() as { match: unknown }
    bmData.value = json.match as Record<string, unknown>
  } catch (e) {
    console.warn('[BetWin] Betmaster fetch failed:', e)
  }
}

// ─── SofaScore name matching helpers ─────────────────────────────────────────
const TEAM_ALIASES: Record<string, string> = {
  'usa': 'united states', 'united states': 'usa',
  'ivory coast': 'cote divoire', 'cote divoire': 'ivory coast',
  'cape verde': 'cabo verde', 'cabo verde': 'cape verde',
  'south korea': 'korea republic', 'korea republic': 'south korea',
  'north korea': 'korea dpr', 'korea dpr': 'north korea',
  'curacao': 'curacao', 'netherlands antilles': 'curacao',
  'czech republic': 'czechia', 'czechia': 'czech republic',
  'republic of ireland': 'ireland', 'ireland': 'republic of ireland',
}
function normName(n: string): string {
  return n.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
}
function namesMatch(a: string, b: string): boolean {
  const na = normName(a); const nb = normName(b)
  if (na === nb) return true
  if (na.includes(nb) || nb.includes(na)) return true
  if (na.length >= 3 && nb.length >= 3 && na.slice(0,4) === nb.slice(0,4)) return true
  const al = TEAM_ALIASES[na]
  if (al && (al === nb || al.includes(nb) || nb.includes(al))) return true
  // token overlap: if they share ≥2 words
  const wa = new Set(na.split(' ')); const wb = nb.split(' ')
  const shared = wb.filter(w => w.length > 2 && wa.has(w))
  return shared.length >= 1 && Math.min(na.split(' ').length, nb.split(' ').length) === 1
    ? shared.length >= 1 : shared.length >= 2
}

function deriveMatchDate(): Date {
  // 1. Try Betmaster start_time — could be ms (>1e12) or seconds (<1e12)
  const raw = gn2(infoStatic.value, 'start_time')
  if (raw > 0) {
    const ms = raw > 1e12 ? raw : raw * 1000
    const d = new Date(ms)
    if (!isNaN(d.getTime())) return d
  }
  // 2. Parse display date 'DD.MM.YY' or 'DD.MM.YYYY'
  const parts = props.match.date.split('.')
  if (parts.length === 3) {
    const [dd, mm, yy] = parts
    const yyyy = yy.length === 2 ? 2000 + parseInt(yy) : parseInt(yy)
    const d = new Date(yyyy, parseInt(mm) - 1, parseInt(dd))
    if (!isNaN(d.getTime())) return d
  }
  // 3. Fallback to today
  return new Date()
}

async function fetchSofaScore() {
  statsLoading.value = true
  try {
    const d = deriveMatchDate()
    // Try match date ±2 days to handle timezone & indexing delays
    const seenDates = new Set<string>()
    const tryDates: string[] = []
    for (let offset = -2; offset <= 2; offset++) {
      const dd = new Date(d.getTime() + offset * 86400000)
      const ds = `${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}-${String(dd.getDate()).padStart(2,'0')}`
      if (!seenDates.has(ds)) { seenDates.add(ds); tryDates.push(ds) }
    }
    // Also always include today
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    if (!seenDates.has(todayStr)) tryDates.push(todayStr)

    let found: unknown = null
    for (const date of tryDates) {
      const res = await fetch(`/sofascore-api/sport/football/scheduled-events/${date}`)
      if (!res.ok) continue
      const json = await res.json() as { events?: unknown[] }
      found = (json.events ?? []).find((e: unknown) => {
        const ev = e as Record<string, unknown>
        const hn = gs(ev, 'homeTeam', 'name')
        const an = gs(ev, 'awayTeam', 'name')
        return namesMatch(hn, homeName.value) && namesMatch(an, awayName.value)
      })
      if (found) break
    }
    if (!found) { statsLoading.value = false; return }
    const ev = found as Record<string, unknown>
    const eventId = gn2(ev, 'id')
    if (!eventId) { statsLoading.value = false; return }

    sofaHomeTeamId.value = gn2(ev, 'homeTeam', 'id')
    sofaAwayTeamId.value = gn2(ev, 'awayTeam', 'id')

    const uniqueTournId = gn2(ev, 'tournament', 'uniqueTournament', 'id')
    const seasonId      = gn2(ev, 'season', 'id')

    // Fetch all data in parallel
    const [incRes, luRes, h2hRes, statsRes, standRes] = await Promise.allSettled([
      fetch(`/sofascore-api/event/${eventId}/incidents`),
      fetch(`/sofascore-api/event/${eventId}/lineups`),
      fetch(`/sofascore-api/event/${eventId}/h2h`),
      fetch(`/sofascore-api/event/${eventId}/statistics`),
      uniqueTournId && seasonId
        ? fetch(`/sofascore-api/unique-tournament/${uniqueTournId}/season/${seasonId}/standings/total`)
        : Promise.reject('no ids'),
    ])

    // ── Incidents ──
    if (incRes.status === 'fulfilled' && incRes.value.ok) {
      const incJson = await incRes.value.json() as { incidents?: unknown[] }
      incidents.value = (incJson.incidents ?? []).map((inc: unknown) => {
        const i = inc as Record<string, unknown>
        const isHome = gs(i, 'team', 'side') === 'home'
        return {
          id:     gn2(i, 'id'),
          time:   gn2(i, 'time'),
          type:   gs(i, 'incidentType'),
          player: gs(i, 'player', 'name') || gs(i, 'playerIn', 'name'),
          isHome,
        }
      }).filter((i: Incident) => i.time > 0).sort((a: Incident, b: Incident) => a.time - b.time)
    }

    // ── Lineups ──
    if (luRes.status === 'fulfilled' && luRes.value.ok) {
      const luJson = await luRes.value.json() as { home?: unknown; away?: unknown }
      const mapPlayers = (side: unknown): Player[] => {
        const s = side as Record<string, unknown>
        const players = (s?.players ?? []) as unknown[]
        return players.map((pl: unknown) => {
          const p = pl as Record<string, unknown>
          return {
            id:           gn2(p, 'player', 'id'),
            name:         gs(p, 'player', 'name') || gs(p, 'player', 'shortName'),
            jerseyNumber: String(gn2(p, 'jerseyNumber') || ''),
            position:     gs(p, 'position'),
          }
        })
      }
      lineups.value = { home: mapPlayers(luJson.home), away: mapPlayers(luJson.away) }
    }

    // ── H2H ──
    if (h2hRes.status === 'fulfilled' && h2hRes.value.ok) {
      const h2hJson = await h2hRes.value.json() as {
        events?: unknown[]
        homeTeamLastMatches?: unknown[]
        awayTeamLastMatches?: unknown[]
      }

      const parseEvent = (e: unknown): H2HEvent => {
        const ev = e as Record<string, unknown>
        const hs = gn2(ev, 'homeScore', 'display')
        const as_ = gn2(ev, 'awayScore', 'display')
        const ts = gn2(ev, 'startTimestamp') * 1000
        return {
          id:        gn2(ev, 'id'),
          date:      ts ? new Date(ts).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' }) : '',
          homeTeam:  gs(ev, 'homeTeam', 'shortName') || gs(ev, 'homeTeam', 'name'),
          awayTeam:  gs(ev, 'awayTeam', 'shortName') || gs(ev, 'awayTeam', 'name'),
          homeScore: hs,
          awayScore: as_,
          tournament: gs(ev, 'tournament', 'name'),
          homeId:    gn2(ev, 'homeTeam', 'id'),
          awayId:    gn2(ev, 'awayTeam', 'id'),
        }
      }

      h2hMeetings.value = (h2hJson.events ?? []).slice(0, 10).map(parseEvent)

      const parseForm = (matches: unknown[], teamId: number): FormMatch[] =>
        (matches ?? []).slice(0, 5).map((e: unknown) => {
          const ev = e as Record<string, unknown>
          const hs = gn2(ev, 'homeScore', 'display')
          const as_ = gn2(ev, 'awayScore', 'display')
          const hid = gn2(ev, 'homeTeam', 'id')
          const isHome = hid === teamId
          let result: 'W' | 'D' | 'L' = 'D'
          if (hs > as_) result = isHome ? 'W' : 'L'
          else if (as_ > hs) result = isHome ? 'L' : 'W'
          const opp = isHome
            ? (gs(ev, 'awayTeam', 'shortName') || gs(ev, 'awayTeam', 'name'))
            : (gs(ev, 'homeTeam', 'shortName') || gs(ev, 'homeTeam', 'name'))
          return { result, score: `${hs}-${as_}`, opponent: opp }
        })

      homeForm.value = parseForm(h2hJson.homeTeamLastMatches ?? [], sofaHomeTeamId.value)
      awayForm.value = parseForm(h2hJson.awayTeamLastMatches ?? [], sofaAwayTeamId.value)
    }

    // ── Statistics ──
    if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
      const stJson = await statsRes.value.json() as { statistics?: unknown[] }
      const allPeriod = (stJson.statistics ?? []).find((p: unknown) => gs(p as Record<string,unknown>, 'period') === 'ALL')
      if (allPeriod) {
        const groups = (gn(allPeriod as Record<string,unknown>, 'groups') as unknown[]) ?? []
        const items: StatItem[] = []
        for (const g of groups) {
          const statItems = (gn(g as Record<string,unknown>, 'statisticsItems') as unknown[]) ?? []
          for (const si of statItems) {
            const s = si as Record<string, unknown>
            const hv = String(s.home ?? '')
            const av = String(s.away ?? '')
            const hn = parseFloat(hv) || 0
            const an = parseFloat(av) || 0
            items.push({ name: String(s.name ?? ''), home: hv, away: av, homeNum: hn, awayNum: an })
          }
        }
        const SHOW = ['Ball possession','Total shots','Shots on target','Corners','Fouls','Yellow cards','Red cards','Offsides','Saves','Passes','Tackles','Free kicks']
        matchStats.value = items.filter(i => SHOW.some(k => i.name.toLowerCase().includes(k.toLowerCase()))).slice(0, 12)
      }
    }

    // ── Standings ──
    if (standRes.status === 'fulfilled' && standRes.value.ok) {
      const stJson = await standRes.value.json() as { standings?: unknown[] }
      const rows = (gn((stJson.standings ?? [])[0] as Record<string,unknown>, 'rows') as unknown[]) ?? []
      standings.value = rows.map((r: unknown) => {
        const row = r as Record<string, unknown>
        const gf = gn2(row, 'scoresFor')
        const ga = gn2(row, 'scoresAgainst')
        return {
          position:   gn2(row, 'position'),
          teamId:     gn2(row, 'team', 'id'),
          teamName:   gs(row, 'team', 'name'),
          teamShort:  gs(row, 'team', 'shortName') || gs(row, 'team', 'name').slice(0,3).toUpperCase(),
          matches:    gn2(row, 'matches'),
          wins:       gn2(row, 'wins'),
          draws:      gn2(row, 'draws'),
          losses:     gn2(row, 'losses'),
          goalsFor:   gf,
          goalsAgainst: ga,
          points:     gn2(row, 'points'),
          form:       gs(row, 'promotion', 'text'),
        }
      })
    }
  } catch (e) {
    console.warn('[BetWin] SofaScore fetch failed (graceful):', e)
  } finally {
    statsLoading.value = false
  }
}

// ─── Stats helpers ────────────────────────────────────────────────────────────
function statBarPct(homeNum: number, awayNum: number, isHome: boolean): number {
  const total = homeNum + awayNum
  if (!total) return 50
  return Math.round(isHome ? (homeNum / total) * 100 : (awayNum / total) * 100)
}
function h2hResultFor(m: H2HEvent, teamId: number): 'W' | 'D' | 'L' {
  const isHome = m.homeId === teamId
  if (m.homeScore > m.awayScore) return isHome ? 'W' : 'L'
  if (m.awayScore > m.homeScore) return isHome ? 'L' : 'W'
  return 'D'
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  loading.value = true
  await fetchBetmaster()
  loading.value = false

  // Countdown timer
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)

  // Try SofaScore in background
  fetchSofaScore()

  // Poll betmaster every 30s if live
  if (isLive.value) {
    pollTimer = setInterval(async () => { await fetchBetmaster() }, 30000)
  }
})

onUnmounted(() => {
  if (pollTimer)     clearInterval(pollTimer)
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<style scoped>
/* ─── Layout ─────────────────────────────────────────────────────── */
.match-detail {
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
  background: #12141f; position: relative;
}
.md-loading {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  gap: 12px; font-size: 13px; color: #9ba3b8; background: rgba(18,20,31,0.85); z-index: 10;
}
.md-spinner {
  width: 20px; height: 20px; border: 2px solid #7c3aed44;
  border-top-color: #7c3aed; border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Topbar ─────────────────────────────────────────────────────── */
.detail-topbar {
  display: flex; align-items: center; gap: 10px; padding: 6px 12px;
  background: #0e1120; border-bottom: 1px solid #252840; flex-shrink: 0; flex-wrap: wrap;
}
.back-btn {
  background: #1a1d2e; border: 1px solid #252840; color: #9ba3b8;
  padding: 4px 10px; border-radius: 5px; font-size: 12px; cursor: pointer;
  transition: background 0.15s; white-space: nowrap; flex-shrink: 0;
}
.back-btn:hover { background: #252840; color: #fff; }
.breadcrumb {
  display: flex; align-items: center; gap: 5px; flex: 1; min-width: 0;
  font-size: 10px; color: #9ba3b8; overflow: hidden;
}
.bc-logo { width: 16px; height: 16px; object-fit: contain; flex-shrink: 0; }
.bc-sport { color: #7a8299; font-weight: 700; text-transform: uppercase; font-size: 9px; }
.bc-sep { color: #3a4060; }
.bc-name { color: #c8cfe0; font-weight: 700; }
.bc-match { color: #fff; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.detail-tabs { display: flex; gap: 2px; flex-shrink: 0; }
.dtab {
  background: #1a1d2e; border: 1px solid #252840; color: #9ba3b8;
  padding: 4px 10px; border-radius: 5px; font-size: 11px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; gap: 4px; transition: background 0.15s;
}
.dtab.active { background: #7c3aed; border-color: #7c3aed; color: #fff; }
.dtab:hover:not(.active) { background: #252840; }
.dtab-icon { font-size: 12px; }

/* ─── Body layout ────────────────────────────────────────────────── */
.detail-body {
  display: flex; gap: 10px; padding: 10px; flex: 1; overflow-y: auto;
  align-items: flex-start;
}
.detail-main { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0; }
.detail-right { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }

/* ─── Match Hero Card ────────────────────────────────────────────── */
.match-hero-card {
  background: linear-gradient(135deg, #1a1040 0%, #0e1628 60%, #141a2e 100%);
  border: 1px solid #2a2060; border-radius: 10px; overflow: hidden;
}
.hero-meta {
  display: flex; align-items: center; gap: 6px; padding: 8px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 10px; color: #9ba3b8;
}
.hero-cat-logo { width: 16px; height: 12px; object-fit: contain; border-radius: 1px; }
.hero-tourn { font-weight: 700; color: #c8cfe0; }
.hero-bull  { color: #3a4060; }
.hero-round { color: #7a8299; }
.hero-date  { color: #7a8299; }
.hero-status {
  margin-left: auto; font-size: 9px; font-weight: 800; padding: 2px 8px;
  border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px;
}
.status-live     { background: rgba(232,76,107,0.2); color: #e84c6b; border: 1px solid rgba(232,76,107,0.3); animation: pulse-badge 1.5s infinite; }
.status-finished { background: rgba(122,130,153,0.2); color: #9ba3b8; border: 1px solid rgba(122,130,153,0.3); }
.status-prematch { background: rgba(76,175,80,0.15); color: #4caf50; border: 1px solid rgba(76,175,80,0.2); }
@keyframes pulse-badge { 0%,100%{opacity:1}50%{opacity:0.6} }

.hero-teams-area {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 16px 12px; gap: 10px;
}
.hero-team {
  display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1;
}
.hero-team-logo {
  width: 56px; height: 56px; object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
}
.hero-team-name {
  font-size: 12px; font-weight: 800; color: #fff; text-align: center; line-height: 1.3;
}
.hero-score-center { text-align: center; flex-shrink: 0; }
.hero-live-score {
  display: flex; align-items: center; gap: 4px; font-size: 42px; font-weight: 900; color: #fff;
}
.hls-sep { color: #5a6a88; font-size: 32px; }
.hero-clock  { font-size: 12px; font-weight: 800; color: #e84c6b; margin-top: 2px; }
.hero-ft     { font-size: 11px; font-weight: 700; color: #9ba3b8; margin-top: 2px; }
.hero-ht     { font-size: 10px; color: #5a6a88; margin-top: 2px; }
.hero-time   { font-size: 22px; font-weight: 900; color: #fff; }
.hero-vs     { font-size: 14px; font-weight: 900; color: #5a6a88; letter-spacing: 2px; margin: 2px 0; }
.hero-countdown { font-size: 11px; font-weight: 800; color: #7c3aed; font-variant-numeric: tabular-nums; }

.hero-odds-strip {
  display: flex; border-top: 1px solid rgba(255,255,255,0.06);
}
.hero-odds-btn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 8px 4px; background: transparent; border: none; border-right: 1px solid rgba(255,255,255,0.06);
  cursor: pointer; transition: background 0.15s;
}
.hero-odds-btn:last-child { border-right: none; }
.hero-odds-btn:hover { background: rgba(255,255,255,0.05); }
.hero-odds-btn.selected { background: rgba(232,76,107,0.15); }
.hob-lbl  { font-size: 9px; color: #7a8299; font-weight: 700; }
.hob-odds { font-size: 14px; font-weight: 900; color: #fff; }
.hero-odds-btn.selected .hob-odds { color: #e84c6b; }

/* ─── Tracker Card ───────────────────────────────────────────────── */
.tracker-card {
  background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden;
}
.tracker-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px; background: #0e1628; border-bottom: 1px solid #1e2a42;
}
.tracker-title { font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 1px; }
.tracker-status-badge { font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 10px; }
.pitch-wrap { position: relative; }
.pitch-svg { width: 100%; height: auto; display: block; }
.pitch-prematch-overlay {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  text-align: center; pointer-events: none;
}
.ppo-label    { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; }
.ppo-time     { font-size: 20px; font-weight: 900; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.8); }
.ppo-countdown { font-size: 12px; font-weight: 800; color: #7c3aed; margin-top: 4px; font-variant-numeric: tabular-nums; }

.incident-timeline { padding: 8px 12px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #1e2a42; }
.incident-row { display: flex; align-items: center; }
.inc-home-side,.inc-away-side { display: flex; align-items: center; gap: 6px; }
.inc-away-side { flex-direction: row-reverse; margin-left: auto; }
.inc-time   { font-size: 9px; font-weight: 700; color: #e84c6b; min-width: 28px; }
.inc-icon   { font-size: 12px; }
.inc-player { font-size: 10px; color: #c8cfe0; font-weight: 600; }

.tracker-empty { padding: 16px 14px; text-align: center; font-size: 11px; color: #5a6a88; }

/* ─── Win Probability Card ───────────────────────────────────────── */
.prob-card {
  background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px;
  padding: 10px 14px;
}
.prob-title { font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.prob-body  { display: flex; flex-direction: column; gap: 8px; }
.prob-item  { display: flex; align-items: center; gap: 8px; }
.prob-team  { display: flex; align-items: center; gap: 6px; min-width: 110px; font-size: 10px; color: #c8cfe0; font-weight: 600; }
.prob-logo  { width: 18px; height: 18px; object-fit: contain; }
.prob-draw-icon { font-size: 10px; color: #5a6a88; }
.prob-bar-wrap { flex: 1; }
.prob-bar   { height: 8px; background: #1e2a42; border-radius: 4px; overflow: hidden; }
.prob-fill  { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
.home-pfill { background: linear-gradient(90deg, #e84c6b, #c0395a); }
.draw-pfill { background: linear-gradient(90deg, #5a6a88, #3a4060); }
.away-pfill { background: linear-gradient(90deg, #4a90e2, #2e6ab8); }
.prob-pct   { font-size: 11px; font-weight: 800; min-width: 34px; text-align: right; }
.home-pct   { color: #e84c6b; }
.draw-pct   { color: #9ba3b8; }
.away-pct   { color: #4a90e2; }

/* ─── Match Info Card ─────────────────────────────────────────────── */
.match-info-card {
  background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden;
}
.mic-title { padding: 8px 14px; font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.8px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.mic-grid  { display: grid; grid-template-columns: 1fr 1fr; }
.mic-row   { display: flex; flex-direction: column; padding: 7px 12px; border-bottom: 1px solid #1a2035; border-right: 1px solid #1a2035; }
.mic-row:nth-child(even) { border-right: none; }
.mic-lbl   { font-size: 8px; color: #5a6a88; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.mic-val   { font-size: 11px; color: #e2e8f0; font-weight: 600; }

/* ─── Lineups Card ───────────────────────────────────────────────── */
.lineups-card {
  background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden;
}
.lu-title { padding: 8px 14px; font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.8px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.lu-body  { display: flex; }
.lu-col   { flex: 1; padding: 8px 10px; }
.lu-divider { width: 1px; background: #1e2a42; }
.lu-team-header { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.lu-logo  { width: 18px; height: 18px; object-fit: contain; }
.lu-player { display: flex; align-items: center; gap: 5px; padding: 3px 0; border-bottom: 1px solid #1a2035; }
.lu-num   { font-size: 9px; font-weight: 800; color: #7c3aed; min-width: 18px; text-align: center; }
.lu-name  { font-size: 10px; color: #c8cfe0; flex: 1; }
.lu-pos   { font-size: 8px; color: #5a6a88; text-transform: uppercase; }

/* ─── Right Markets Card ─────────────────────────────────────────── */
.right-markets-card {
  background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden;
}
.rmc-title { padding: 8px 12px; font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.8px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.rmc-market { padding: 8px 10px; border-bottom: 1px solid #1a2035; }
.rmc-market:last-child { border-bottom: none; }
.rmc-market-name { font-size: 9px; color: #7a8299; font-weight: 700; text-transform: uppercase; margin-bottom: 5px; }
.rmc-outcomes { display: flex; gap: 3px; }
.rmc-btn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 1px;
  background: #0e1628; border: 1px solid #1e2a42; border-radius: 5px;
  padding: 5px 3px; cursor: pointer; transition: background 0.15s;
}
.rmc-btn:hover { background: #172035; border-color: #2e3f64; }
.rmc-btn.selected { background: rgba(232,76,107,0.15); border-color: #e84c6b; }
.rmc-lbl  { font-size: 8px; color: #7a8299; font-weight: 700; }
.rmc-odds { font-size: 12px; font-weight: 900; color: #fff; }
.rmc-btn.selected .rmc-odds { color: #e84c6b; }

/* ─── Slip Card ──────────────────────────────────────────────────── */
.slip-card {
  background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden;
}
.slip-title { padding: 7px 12px; font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.slip-item  { padding: 7px 10px; border-bottom: 1px solid #1a2035; }
.slip-market { font-size: 8px; color: #5a6a88; text-transform: uppercase; margin-bottom: 2px; }
.slip-row   { display: flex; align-items: center; gap: 4px; }
.slip-outcome { flex: 1; font-size: 10px; color: #e2e8f0; font-weight: 700; }
.slip-odds-val { font-size: 12px; font-weight: 900; color: #e84c6b; }
.slip-remove { background: none; border: none; color: #5a6a88; cursor: pointer; font-size: 14px; line-height: 1; padding: 0 2px; transition: color 0.12s; }
.slip-remove:hover { color: #e84c6b; }
.slip-hint-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; padding: 16px 12px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 22px; }
.slip-hint-text { font-size: 10px; color: #5a6a88; line-height: 1.5; }

/* ─── Odds Tab ───────────────────────────────────────────────────── */
.odds-body { align-items: flex-start; }
.odds-status-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px; background: #141a2e; border: 1px solid #1e2a42; border-radius: 8px; gap: 8px;
}
.osb-teams { display: flex; align-items: center; gap: 7px; flex: 1; font-size: 11px; color: #e2e8f0; font-weight: 700; }
.osb-logo  { width: 20px; height: 20px; object-fit: contain; }
.osb-name  { font-weight: 700; color: #e2e8f0; }
.osb-score-txt { font-size: 15px; font-weight: 900; color: #fff; }
.osb-vs    { font-size: 11px; color: #5a6a88; font-weight: 700; }
.osb-right { display: flex; align-items: center; gap: 8px; }
.osb-badge { font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; }
.osb-mkt   { font-size: 9px; color: #5a6a88; font-weight: 600; }

.mkt-category-bar { display: flex; gap: 4px; flex-wrap: wrap; }
.mkt-cat-btn {
  background: #1a1d2e; border: 1px solid #252840; color: #9ba3b8;
  padding: 4px 10px; border-radius: 14px; font-size: 10px; font-weight: 700;
  cursor: pointer; transition: background 0.15s;
}
.mkt-cat-btn.active { background: #7c3aed; border-color: #7c3aed; color: #fff; }
.mkt-cat-btn:hover:not(.active) { background: #252840; }

.markets-list { display: flex; flex-direction: column; gap: 4px; }
.market-card  { background: #141a2e; border: 1px solid #1e2a42; border-radius: 8px; overflow: hidden; }
.market-header { display: flex; align-items: center; gap: 8px; padding: 10px 12px; cursor: pointer; user-select: none; transition: background 0.12s; }
.market-header:hover { background: #1a2035; }
.market-icon  { font-size: 14px; flex-shrink: 0; }
.market-hdr-info { flex: 1; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.market-name  { font-size: 11px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; }
.market-spec-badge { font-size: 9px; font-weight: 700; color: #7c3aed; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); border-radius: 8px; padding: 1px 6px; }
.market-sel-count { font-size: 9px; color: #5a6a88; }
.market-toggle { font-size: 9px; color: #5a6a88; }
.market-outcomes {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 4px; padding: 8px 10px; border-top: 1px solid #1e2a42;
}
.outcome-btn {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; background: #0e1628; border: 1px solid #1e2a42; border-radius: 6px;
  cursor: pointer; transition: background 0.12s, border-color 0.12s;
}
.outcome-btn:hover  { background: #172035; border-color: #2e3f64; }
.outcome-btn.selected { background: rgba(232,76,107,0.15); border-color: #e84c6b; }
.out-lbl  { font-size: 10px; color: #c8cfe0; font-weight: 600; }
.out-odds { font-size: 13px; font-weight: 900; color: #fff; }
.outcome-btn.selected .out-odds { color: #e84c6b; }

/* ─── Stats Tab ──────────────────────────────────────────────────── */
.stats-body {
  flex-direction: column; max-width: 860px; margin: 0 auto; padding: 12px;
  gap: 10px; overflow-y: auto; flex: 1;
}
.stats-loading {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 48px; color: #9ba3b8; font-size: 13px;
}
.stats-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 64px 24px; gap: 8px; text-align: center;
}
.stats-empty-icon { font-size: 40px; }
.stats-empty-title { font-size: 15px; font-weight: 700; color: #c8cfe0; }
.stats-empty-sub { font-size: 12px; color: #5a6280; }

.stats-card {
  background: #181b2e; border: 1px solid #252840; border-radius: 10px; overflow: hidden;
}
.stats-card-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: #0e1120; border-bottom: 1px solid #252840;
  font-size: 12px; font-weight: 700; color: #c8cfe0;
}
.stats-card-icon { font-size: 14px; }
.stats-badge {
  margin-left: auto; font-size: 9px; font-weight: 800; padding: 2px 7px;
  border-radius: 10px; background: rgba(232,76,107,0.2); color: #e84c6b;
  border: 1px solid rgba(232,76,107,0.3); animation: pulse-badge 1.5s infinite;
}
.stats-count { margin-left: auto; font-size: 10px; color: #7a8299; font-weight: 600; }
.stats-card-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }

/* Match statistics bars */
.stat-teams-hdr {
  display: flex; justify-content: space-between; margin-bottom: 4px;
  font-size: 11px; font-weight: 700; color: #9ba3b8;
}
.stat-team-lbl { display: flex; align-items: center; gap: 5px; }
.stat-team-lbl.away-lbl { flex-direction: row-reverse; }
.stat-team-logo { width: 18px; height: 18px; object-fit: contain; }
.stat-row {
  display: grid; grid-template-columns: 36px 1fr 36px;
  align-items: center; gap: 8px;
}
.stat-val { font-size: 12px; font-weight: 800; color: #fff; }
.stat-val.home-val { text-align: right; }
.stat-val.away-val { text-align: left; }
.stat-bars {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 6px;
}
.stat-name { font-size: 10px; color: #7a8299; text-align: center; white-space: nowrap; }
.stat-bar-wrap { height: 6px; border-radius: 3px; background: #252840; overflow: hidden; }
.home-bar { display: flex; justify-content: flex-end; }
.away-bar { display: flex; justify-content: flex-start; }
.stat-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.home-fill { background: linear-gradient(90deg, #7c3aed, #a855f7); }
.away-fill { background: linear-gradient(90deg, #e84c6b, #f06292); }

/* H2H */
.h2h-summary {
  display: flex; align-items: center; justify-content: space-between;
  background: #0e1120; border-radius: 8px; padding: 10px 14px; margin-bottom: 4px;
}
.h2h-sum-team { display: flex; align-items: center; gap: 7px; flex: 1; }
.h2h-sum-team.away-sum { flex-direction: row-reverse; }
.h2h-logo { width: 24px; height: 24px; object-fit: contain; }
.h2h-sum-name { font-size: 11px; font-weight: 700; color: #c8cfe0; }
.h2h-sum-num { font-size: 22px; font-weight: 900; color: #7c3aed; min-width: 24px; text-align: center; }
.h2h-sum-mid { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 0 12px; }
.h2h-draw-num { font-size: 22px; font-weight: 900; color: #e0b040; }
.h2h-draw-lbl { font-size: 9px; color: #5a6280; text-transform: uppercase; letter-spacing: 0.5px; }

.h2h-row {
  display: grid; grid-template-columns: 62px 1fr auto 24px;
  align-items: center; gap: 8px; padding: 7px 0;
  border-bottom: 1px solid #1e2138;
}
.h2h-row:last-child { border-bottom: none; }
.h2h-date { font-size: 10px; color: #5a6280; white-space: nowrap; }
.h2h-tourn { font-size: 10px; color: #7a8299; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.h2h-match { display: flex; align-items: center; gap: 6px; justify-content: center; }
.h2h-team { font-size: 11px; color: #9ba3b8; font-weight: 600; white-space: nowrap; max-width: 80px; overflow: hidden; text-overflow: ellipsis; }
.h2h-team-away { text-align: right; }
.h2h-win { color: #c8cfe0; font-weight: 800; }
.h2h-score-box { display: flex; align-items: center; gap: 3px; }
.h2h-s { font-size: 13px; font-weight: 900; color: #fff; min-width: 14px; text-align: center; }
.h2h-sdash { font-size: 12px; color: #3a4060; }
.h2h-result-badge {
  width: 20px; height: 20px; border-radius: 50%; font-size: 9px; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
}
.badge-w { background: rgba(76,175,80,0.25); color: #4caf50; border: 1px solid rgba(76,175,80,0.3); }
.badge-l { background: rgba(232,76,107,0.2); color: #e84c6b; border: 1px solid rgba(232,76,107,0.3); }
.badge-d { background: rgba(224,176,64,0.2); color: #e0b040; border: 1px solid rgba(224,176,64,0.3); }

/* Recent Form */
.form-body { gap: 12px; }
.form-row { display: flex; align-items: center; gap: 10px; }
.form-team-info { display: flex; align-items: center; gap: 6px; width: 160px; flex-shrink: 0; }
.form-logo { width: 22px; height: 22px; object-fit: contain; }
.form-team-name { font-size: 11px; font-weight: 700; color: #c8cfe0; }
.form-dots { display: flex; gap: 6px; }
.form-dot {
  width: 28px; height: 28px; border-radius: 50%; font-size: 10px; font-weight: 900;
  display: flex; align-items: center; justify-content: center; cursor: default;
}
.form-W { background: rgba(76,175,80,0.25); color: #4caf50; border: 1px solid rgba(76,175,80,0.4); }
.form-L { background: rgba(232,76,107,0.2); color: #e84c6b; border: 1px solid rgba(232,76,107,0.4); }
.form-D { background: rgba(224,176,64,0.2); color: #e0b040; border: 1px solid rgba(224,176,64,0.4); }

/* Standings Table */
.standings-card .stats-card-body { padding: 0; }
.standings-table-wrap { overflow-x: auto; }
.standings-table {
  width: 100%; border-collapse: collapse; font-size: 11px; color: #9ba3b8;
}
.standings-table th {
  padding: 8px 6px; text-align: center; font-size: 9px; font-weight: 700;
  text-transform: uppercase; color: #5a6280; background: #0e1120;
  border-bottom: 1px solid #252840; letter-spacing: 0.5px;
}
.standings-table td {
  padding: 7px 6px; text-align: center; border-bottom: 1px solid #1a1d2e;
}
.standings-table tbody tr:last-child td { border-bottom: none; }
.standings-table tbody tr:hover td { background: #1e2138; }
.st-highlighted td {
  background: rgba(124,58,237,0.08) !important;
  color: #c8cfe0 !important; font-weight: 700;
}
.st-highlighted td.st-pts { color: #a855f7 !important; }
.st-pos { color: #5a6280; font-size: 10px; width: 24px; }
.st-team { text-align: left !important; padding-left: 10px !important; }
.st-team-name { font-size: 11px; font-weight: 600; color: #c8cfe0; }
.st-pts { font-weight: 900 !important; color: #fff !important; }
.gd-pos { color: #4caf50; font-weight: 700; }
.gd-neg { color: #e84c6b; font-weight: 700; }

/* ─── AI Chat ────────────────────────────────────────────────────── */
.ai-body { padding: 0; overflow: hidden; align-items: stretch; }
.ai-panel { display: flex; flex-direction: column; flex: 1; min-height: 0; background: #0e1120; }
.ai-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #141624; border-bottom: 1px solid #252840; flex-shrink: 0; }
.ai-logo   { font-size: 28px; flex-shrink: 0; }
.ai-title  { font-size: 13px; font-weight: 800; color: #fff; }
.ai-subtitle { font-size: 10px; color: #7a8299; }
.ai-online { display: flex; align-items: center; gap: 5px; font-size: 10px; color: #4caf50; font-weight: 700; margin-left: auto; }
.ai-dot    { width: 7px; height: 7px; border-radius: 50%; background: #4caf50; animation: pulse-badge 1.5s infinite; }
.ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 16px; border-bottom: 1px solid #1e2a42; flex-shrink: 0; }
.suggestion-chip { background: #141a2e; border: 1px solid #252840; color: #c8cfe0; padding: 6px 12px; border-radius: 16px; font-size: 10px; font-weight: 600; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.suggestion-chip:hover { background: #1e2a42; border-color: #e84c6b; color: #fff; }
.chat-messages { flex: 1; overflow-y: auto; min-height: 0; padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; }
.chat-msg  { display: flex; align-items: flex-end; gap: 8px; }
.chat-msg.user { flex-direction: row-reverse; }
.msg-avatar { font-size: 18px; flex-shrink: 0; margin-bottom: 2px; }
.msg-bubble { max-width: 75%; padding: 10px 14px; border-radius: 12px; font-size: 12px; line-height: 1.5; color: #e2e8f0; }
.chat-msg.assistant .msg-bubble { background: #141a2e; border: 1px solid #1e2a42; border-bottom-left-radius: 3px; }
.chat-msg.user .msg-bubble { background: linear-gradient(135deg,#e84c6b,#c0395a); color: #fff; border-bottom-right-radius: 3px; }
.typing-dots { display: inline-flex; gap: 4px; align-items: center; }
.typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #7a8299; animation: typing 1.2s infinite; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:0.5}30%{transform:translateY(-4px);opacity:1} }
.chat-input-area { display: flex; gap: 8px; padding: 12px 16px; background: #141624; border-top: 1px solid #252840; flex-shrink: 0; }
.chat-input { flex: 1; background: #1a1d2e; border: 1px solid #252840; color: #e2e8f0; padding: 10px 14px; border-radius: 20px; font-size: 12px; outline: none; transition: border-color 0.15s; }
.chat-input:focus { border-color: #e84c6b; }
.chat-input::placeholder { color: #5a6a88; }
.chat-send { width: 38px; height: 38px; border-radius: 50%; background: #e84c6b; border: none; color: #fff; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }
.chat-send:hover:not(:disabled) { background: #d43c5c; }
.chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Prediction Tab ─────────────────────────────────────────────── */
.pred-hero-card {
  background: linear-gradient(135deg,#1a1040,#0e1628); border: 1px solid #2e2060;
  border-radius: 10px; padding: 20px; text-align: center;
}
.pred-badge { display: inline-block; background: rgba(232,76,107,0.2); border: 1px solid rgba(232,76,107,0.4); color: #e84c6b; padding: 3px 10px; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.pred-match-title { font-size: 16px; font-weight: 900; color: #fff; margin-bottom: 2px; }
.pred-meta { font-size: 10px; color: #7a8299; margin-bottom: 12px; }
.pred-verdict { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 10px; }
.pred-verdict-lbl { font-size: 9px; color: #7a8299; text-transform: uppercase; font-weight: 700; }
.pred-verdict-val { font-size: 18px; font-weight: 900; color: #e84c6b; }
.pred-confidence  { font-size: 10px; color: #9ba3b8; margin-top: 2px; }
.pred-confidence b { color: #4caf50; }

.pred-prob-card {
  background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden;
}
.ppc-title { padding: 8px 14px; font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.8px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.ppc-body  { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
.ppc-row   { display: flex; align-items: center; gap: 8px; }
.ppc-team  { display: flex; align-items: center; gap: 5px; font-size: 10px; color: #c8cfe0; font-weight: 600; min-width: 115px; }
.ppc-logo  { width: 18px; height: 18px; object-fit: contain; }
.draw-dash { color: #5a6a88; font-size: 12px; }
.ppc-bar-track { flex: 1; height: 24px; background: #0e1628; border-radius: 4px; overflow: hidden; border: 1px solid #1e2a42; }
.ppc-bar-fill  { height: 100%; display: flex; align-items: center; padding-left: 6px; border-radius: 4px; transition: width 0.6s ease; }
.ppc-pct-label { font-size: 10px; font-weight: 800; color: #fff; }
.home-pred-fill { background: linear-gradient(90deg,#e84c6b,#c0395a); }
.draw-pred-fill { background: linear-gradient(90deg,#5a6a88,#3a4060); }
.away-pred-fill { background: linear-gradient(90deg,#4a90e2,#2e6ab8); }
.ppc-pct   { font-size: 11px; font-weight: 800; min-width: 32px; text-align: right; }

.pred-markets-card { background: #141a2e; border: 1px solid #1e2a42; border-radius: 10px; overflow: hidden; }
.pmc-title { padding: 8px 14px; font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.8px; background: #0e1628; border-bottom: 1px solid #1e2a42; }
.pmc-body  { padding: 10px 14px; display: flex; flex-direction: column; gap: 8px; }
.pm-row    { display: flex; align-items: center; gap: 8px; }
.pm-label  { font-size: 9px; color: #9ba3b8; min-width: 130px; font-weight: 600; }
.pm-bar-wrap { flex: 1; }
.pm-bar    { height: 6px; background: #1e2a42; border-radius: 3px; overflow: hidden; }
.pm-fill   { height: 100%; border-radius: 3px; transition: width 0.6s; }
.pm-green  { background: linear-gradient(90deg,#4caf50,#2e8b40); }
.pm-blue   { background: linear-gradient(90deg,#4a90e2,#2e6ab8); }
.pm-red    { background: linear-gradient(90deg,#e84c6b,#c0395a); }
.pm-purple { background: linear-gradient(90deg,#9d6cf0,#7c3aed); }
.pm-pct    { font-size: 9px; font-weight: 800; min-width: 28px; text-align: right; color: #9ba3b8; }
.pm-verdict { font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 4px; }
.pm-yes    { background: rgba(76,175,80,0.2); color: #4caf50; }
.pm-no     { background: rgba(232,76,107,0.15); color: #e84c6b; }

.pred-tip-card { background: linear-gradient(135deg,#1a1040,#0e1628); border: 1px solid #2e2060; border-radius: 10px; overflow: hidden; }
.ptc-header { padding: 8px 12px; font-size: 11px; font-weight: 800; color: #ffd700; background: rgba(0,0,0,0.3); border-bottom: 1px solid #2e2060; }
.ptc-body   { padding: 12px; }
.ptc-market { font-size: 9px; color: #7a8299; text-transform: uppercase; font-weight: 700; }
.ptc-selection { font-size: 15px; font-weight: 900; color: #fff; margin: 4px 0 8px; }
.ptc-odds-lbl  { font-size: 9px; color: #7a8299; }
.ptc-odds-val  { font-size: 28px; font-weight: 900; color: #e84c6b; }
.ptc-conf-lbl  { font-size: 9px; color: #7a8299; margin-top: 8px; margin-bottom: 4px; }
.ptc-bar       { height: 5px; background: #1e2a42; border-radius: 3px; overflow: hidden; margin-bottom: 3px; }
.ptc-bar-fill  { height: 100%; background: linear-gradient(90deg,#4caf50,#2e9c40); border-radius: 3px; }
.ptc-conf-pct  { font-size: 10px; font-weight: 800; color: #4caf50; }
</style>
