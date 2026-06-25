<template>
  <div class="top-matches-section">
    <!-- Section Header -->
    <div class="tm-header">
      <div class="tm-header-left">
        <span class="tm-star">⭐</span>
        <span class="tm-title">TOP MATCHES</span>
      </div>
      <div class="tm-odds-labels">
        <span class="tm-oh">1</span>
        <span class="tm-oh">X</span>
        <span class="tm-oh">2</span>
        <span class="tm-oh">1X</span>
        <span class="tm-oh">X2</span>
        <span class="tm-oh">12</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="tm-state">
      <div class="tm-spinner"></div>
      <span>Loading top matches…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="tm-state tm-error">
      <span>⚠ {{ error }}</span>
      <button class="tm-retry-btn" @click="fetchMatches">Retry</button>
    </div>

    <!-- Grouped match rows -->
    <template v-else>
      <div v-for="group in groupedMatches" :key="group.tournamentId" class="tm-group">
        <!-- League sub-header -->
        <div class="tm-league-header">
          <div class="tm-league-left">
            <img
              v-if="group.categoryLogo"
              :src="group.categoryLogo"
              class="tm-cat-logo"
              @error="($event.target as HTMLImageElement).style.display='none'"
            />
            <span class="tm-league-sport">{{ group.sport }}</span>
            <span class="tm-league-sep">›</span>
            <img
              v-if="group.tournamentLogo"
              :src="group.tournamentLogo"
              class="tm-tourn-logo"
              @error="($event.target as HTMLImageElement).style.display='none'"
            />
            <span class="tm-league-name">{{ group.tournamentName }}</span>
          </div>
          <div class="tm-league-odds-labels">
            <span class="tm-oh-sm">1</span>
            <span class="tm-oh-sm">X</span>
            <span class="tm-oh-sm">2</span>
            <span class="tm-oh-sm">1X</span>
            <span class="tm-oh-sm">X2</span>
            <span class="tm-oh-sm">12</span>
          </div>
        </div>

        <!-- Match rows -->
        <div
          v-for="match in group.matches"
          :key="match.id"
          class="tm-match-row"
          @click="onMatchClick(match)"
        >
          <div class="tm-match-info">
            <div class="tm-datetime">
              <div class="tm-date">{{ match.dateStr }}</div>
              <div class="tm-time">{{ match.timeStr }}</div>
            </div>

            <div class="tm-match-actions">
              <button class="tm-action-btn" @click.stop title="Favourite">☆</button>
              <button class="tm-action-btn" @click.stop title="Statistics">📊</button>
            </div>

            <div class="tm-teams">
              <div class="tm-team-row">
                <img
                  v-if="match.homeLogo"
                  :src="match.homeLogo"
                  class="tm-team-logo"
                  @error="($event.target as HTMLImageElement).style.display='none'"
                />
                <span class="tm-team-name">{{ match.homeName }}</span>
              </div>
              <div class="tm-team-row">
                <img
                  v-if="match.awayLogo"
                  :src="match.awayLogo"
                  class="tm-team-logo"
                  @error="($event.target as HTMLImageElement).style.display='none'"
                />
                <span class="tm-team-name">{{ match.awayName }}</span>
              </div>
            </div>

            <div class="tm-market-count" @click.stop>
              <span class="tm-mc-badge">{{ match.marketCount }} ›</span>
            </div>
          </div>

          <div class="tm-match-odds" @click.stop>
            <OddsButton :value="match.odds1" />
            <OddsButton :value="match.oddsX" />
            <OddsButton :value="match.odds2" />
            <OddsButton :value="match.odds1x" />
            <OddsButton :value="match.oddsX2" />
            <OddsButton :value="match.odds12" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import OddsButton from './OddsButton.vue'

interface MappedMatch {
  id: number
  srId: string
  homeName: string
  homeLogo: string
  awayName: string
  awayLogo: string
  dateStr: string
  timeStr: string
  odds1: string
  oddsX: string
  odds2: string
  odds1x: string
  oddsX2: string
  odds12: string
  marketCount: number
  rawData: unknown
}

interface MatchGroup {
  tournamentId: number
  tournamentName: string
  tournamentLogo: string
  categoryLogo: string
  sport: string
  matches: MappedMatch[]
}

const emit = defineEmits<{
  'match-click': [payload: {
    match: {
      id: number; date: string; time: string
      team1: string; team2: string
      odds1: string; oddsX: string; odds2: string
      odds1x: string; oddsX2: string; odds12: string
      highlighted: string
      homeLogo?: string; awayLogo?: string
    };
    league: { flag: string; sport: string; name: string }
  }]
}>()

const loading = ref(true)
const error = ref('')
const groupedMatches = ref<MatchGroup[]>([])

const TOP_MATCHES_URL =
  '/betmaster-api/feed/sr/matches/sport/top?sport_id=sr%3Asport%3A1&markets_set=main_extended&market=other'

function getOdd(oddsBlock: Record<string, unknown> | undefined, marketId: string, specKey: string, outcomeId: string): string {
  try {
    const market = (oddsBlock as Record<string, unknown>)?.[marketId] as Record<string, unknown>
    const sp = (market?.sp as Record<string, unknown>)?.[specKey] as Record<string, unknown>
    const out = (sp?.out as Record<string, unknown>)?.[outcomeId] as Record<string, unknown>
    const val = out?.o as string
    return val ? Number(val).toFixed(2) : '-'
  } catch {
    return '-'
  }
}

function formatDateTime(tsMs: number) {
  const d = new Date(tsMs)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(2)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return {
    dateStr: `${day}.${month}.${year}`,
    timeStr: `${hours}:${minutes}`,
  }
}

async function fetchMatches() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(TOP_MATCHES_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json() as { matches: unknown[] }
    const raw = json.matches ?? []

    const groupMap = new Map<number, MatchGroup>()

    for (const item of raw) {
      const m = item as Record<string, unknown>
      const infoStatic = m.info_static as Record<string, unknown>
      const infoDynamic = m.info_dynamic as Record<string, unknown>
      const oddsRoot = m.odds as Record<string, unknown>
      const oddsSr1 = oddsRoot?.sr1 as Record<string, unknown>
      const odds3 = oddsSr1?.['3'] as Record<string, unknown>

      const tournament = infoStatic?.tournament as Record<string, unknown>
      const category = infoStatic?.category as Record<string, unknown>
      const sport = infoStatic?.sport as Record<string, unknown>
      const compHome = infoStatic?.competitor_home as Record<string, unknown>
      const compAway = infoStatic?.competitor_away as Record<string, unknown>
      const marketsStats = infoDynamic?.markets_stats as Record<string, unknown>

      const tournId = tournament?.id as number
      const { dateStr, timeStr } = formatDateTime(infoStatic?.start_time as number)

      const mkt1 = odds3?.['1'] as Record<string, unknown>
      const mkt1_sp = mkt1?.sp as Record<string, unknown>

      const mapped: MappedMatch = {
        id: m.id as number,
        srId: m.sr_id as string,
        homeName: ((compHome?.name as Record<string, string>)?.en) ?? 'Home',
        homeLogo: (compHome?.logo_url as string) ?? '',
        awayName: ((compAway?.name as Record<string, string>)?.en) ?? 'Away',
        awayLogo: (compAway?.logo_url as string) ?? '',
        dateStr,
        timeStr,
        odds1: getOdd(odds3, '1', '_', '1'),
        oddsX: getOdd(odds3, '1', '_', '2'),
        odds2: getOdd(odds3, '1', '_', '3'),
        odds1x: getOdd(odds3, '10', '_', '9'),
        oddsX2: getOdd(odds3, '10', '_', '10'),
        odds12: getOdd(odds3, '10', '_', '11'),
        marketCount: (() => {
          try {
            const s = (marketsStats as Record<string, unknown>)?.sr1 as Record<string, unknown>
            return (s?.['3'] as Record<string, unknown>)?.active_counter as number ?? 0
          } catch { return 0 }
        })(),
        rawData: item,
      }

      if (!groupMap.has(tournId)) {
        groupMap.set(tournId, {
          tournamentId: tournId,
          tournamentName: ((tournament?.name as Record<string, string>)?.en) ?? 'League',
          tournamentLogo: (tournament?.logo_url as string) ?? '',
          categoryLogo: (category?.logo_url as string) ?? '',
          sport: ((sport?.name as Record<string, string>)?.en) ?? 'Soccer',
          matches: [],
        })
      }
      groupMap.get(tournId)!.matches.push(mapped)
    }

    groupedMatches.value = Array.from(groupMap.values())
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load matches'
  } finally {
    loading.value = false
  }
}

function onMatchClick(match: MappedMatch) {
  const group = groupedMatches.value.find(g => g.matches.some(m => m.id === match.id))
  emit('match-click', {
    match: {
      id: match.id,
      date: match.dateStr,
      time: match.timeStr,
      team1: match.homeName,
      team2: match.awayName,
      odds1: match.odds1,
      oddsX: match.oddsX,
      odds2: match.odds2,
      odds1x: match.odds1x,
      oddsX2: match.oddsX2,
      odds12: match.odds12,
      highlighted: '',
      homeLogo: match.homeLogo,
      awayLogo: match.awayLogo,
    },
    league: {
      flag: '',
      sport: group?.sport ?? 'Soccer',
      name: group?.tournamentName ?? '',
    },
  })
}

onMounted(fetchMatches)
</script>

<style scoped>
.top-matches-section {
  background: #1a1d2e;
  margin-bottom: 4px;
}

/* ── Section header ─────────────────────────── */
.tm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px 6px;
  background: linear-gradient(90deg, #1c1040 0%, #141624 100%);
  border-bottom: 2px solid #7c3aed;
}
.tm-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.tm-star { font-size: 13px; }
.tm-title {
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.tm-odds-labels {
  display: flex;
  gap: 2px;
}
.tm-oh {
  width: 38px;
  text-align: center;
  font-size: 10px;
  color: #9ba3b8;
  font-weight: 600;
}

/* ── Loading / Error ────────────────────────── */
.tm-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px 12px;
  font-size: 12px;
  color: #9ba3b8;
}
.tm-error { color: #e84c6b; }
.tm-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #7c3aed44;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.tm-retry-btn {
  background: #7c3aed;
  border: none;
  color: #fff;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

/* ── League sub-header ──────────────────────── */
.tm-league-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background: #141624;
  border-bottom: 1px solid #252840;
  border-top: 1px solid #252840;
}
.tm-league-left {
  display: flex;
  align-items: center;
  gap: 5px;
}
.tm-cat-logo {
  width: 16px;
  height: 12px;
  object-fit: contain;
  border-radius: 1px;
}
.tm-tourn-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.tm-league-sport {
  color: #9ba3b8;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 9px;
}
.tm-league-sep { color: #5a6080; font-size: 10px; }
.tm-league-name {
  color: #fff;
  font-weight: 700;
  font-size: 11px;
}
.tm-league-odds-labels {
  display: flex;
  gap: 2px;
}
.tm-oh-sm {
  width: 38px;
  text-align: center;
  font-size: 9px;
  color: #5a6080;
  font-weight: 600;
}

/* ── Match row ──────────────────────────────── */
.tm-match-row {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-bottom: 1px solid #1f2236;
  cursor: pointer;
  transition: background 0.12s;
}
.tm-match-row:hover { background: #1f2236; }

.tm-match-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.tm-datetime {
  flex-shrink: 0;
  min-width: 54px;
}
.tm-date {
  font-size: 9px;
  color: #5a6080;
  line-height: 1.4;
}
.tm-time {
  font-size: 10px;
  color: #9ba3b8;
  font-weight: 600;
  line-height: 1.4;
}

.tm-match-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}
.tm-action-btn {
  background: none;
  border: none;
  color: #5a6080;
  cursor: pointer;
  font-size: 10px;
  padding: 1px;
  transition: color 0.12s;
}
.tm-action-btn:hover { color: #9ba3b8; }

.tm-teams {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tm-team-row {
  display: flex;
  align-items: center;
  gap: 5px;
}
.tm-team-logo {
  width: 14px;
  height: 14px;
  object-fit: contain;
  flex-shrink: 0;
}
.tm-team-name {
  font-size: 11px;
  color: #c8cfe0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.45;
}

.tm-market-count { flex-shrink: 0; }
.tm-mc-badge {
  font-size: 10px;
  color: #5a6080;
  background: #252840;
  border-radius: 3px;
  padding: 1px 5px;
  cursor: pointer;
  white-space: nowrap;
}
.tm-mc-badge:hover { color: #9ba3b8; }

.tm-match-odds {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}
</style>
