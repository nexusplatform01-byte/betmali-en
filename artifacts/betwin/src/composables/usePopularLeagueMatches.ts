import { ref, onMounted } from 'vue'

export interface PopularLeagueCard {
  flag: string
  leagueName: string
  team1: string
  team1Abbr: string
  team1Color: string
  team2: string
  team2Abbr: string
  team2Color: string
  time: string
  odds: [string, string, string]
  activeOdd: number
  aiReason?: string
}

const TOP_LEAGUES: Record<string, { flag: string; color1: string; color2: string }> = {
  'premier league':     { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color1: '#3d195b', color2: '#00ff85' },
  'laliga':             { flag: '🇪🇸', color1: '#e84c6b', color2: '#ff9d00' },
  'la liga':            { flag: '🇪🇸', color1: '#e84c6b', color2: '#ff9d00' },
  'bundesliga':         { flag: '🇩🇪', color1: '#d4002a', color2: '#f5a623' },
  'serie a':            { flag: '🇮🇹', color1: '#003087', color2: '#009246' },
  'ligue 1':            { flag: '🇫🇷', color1: '#1a1a4e', color2: '#ffffff' },
  'champions league':   { flag: '🏆', color1: '#0a0a2e', color2: '#1a78be' },
  'uefa champions':     { flag: '🏆', color1: '#0a0a2e', color2: '#1a78be' },
  'world cup':          { flag: '🌍', color1: '#003087', color2: '#c8a800' },
  'europa league':      { flag: '🟠', color1: '#f07000', color2: '#1a1a1a' },
  'eredivisie':         { flag: '🇳🇱', color1: '#ff6000', color2: '#ffffff' },
  'primeira liga':      { flag: '🇵🇹', color1: '#006600', color2: '#ff0000' },
}

function leagueStyle(name: string): { flag: string; color1: string; color2: string } {
  const lower = name.toLowerCase()
  for (const [key, val] of Object.entries(TOP_LEAGUES)) {
    if (lower.includes(key)) return val
  }
  return { flag: '🌐', color1: '#4a3f7a', color2: '#7c3aed' }
}

function teamColor(teamName: string, base: string): string {
  const hash = [...teamName].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue = (hash * 37) % 360
  return `linear-gradient(135deg, ${base}, hsl(${hue},60%,35%))`
}

function abbr(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return name.slice(0, 3).toUpperCase()
  if (words.length === 2) return (words[0][0] + words[1].slice(0, 2)).toUpperCase()
  return (words[0][0] + words[1][0] + words[2][0]).toUpperCase()
}

function getOdd(oddsRoot: Record<string, unknown> | undefined, marketId: string, specKey: string, outcomeId: string): string {
  try {
    const sr1 = (oddsRoot as Record<string, unknown>)?.sr1 as Record<string, unknown>
    const market = sr1?.[marketId] as Record<string, unknown>
    const sp = (market?.sp as Record<string, unknown>)?.[specKey] as Record<string, unknown>
    const out = (sp?.out as Record<string, unknown>)?.[outcomeId] as Record<string, unknown>
    const val = out?.o as string
    return val ? Number(val).toFixed(2) : '-'
  } catch {
    return '-'
  }
}

function formatTime(tsMs: number): string {
  const d = new Date(tsMs)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

interface RawMatch {
  matchIndex: number
  tournamentName: string
  homeName: string
  awayName: string
  startTime: number
  odds1: string
  oddsX: string
  odds2: string
}

export function usePopularLeagueMatches() {
  const cards = ref<PopularLeagueCard[]>([])
  const loading = ref(true)
  const error = ref('')
  const aiLabel = ref('AI Picks')

  async function fetchAndPickMatches() {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch(
        '/betmaster-api/feed/sr/matches/sport/top?sport_id=sr%3Asport%3A1&markets_set=main_extended&market=other'
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json() as { matches: unknown[] }
      const raw = json.matches ?? []

      const candidates: RawMatch[] = []
      for (let i = 0; i < raw.length; i++) {
        const m = raw[i] as Record<string, unknown>
        const infoStatic = m.info_static as Record<string, unknown>
        const tournament = infoStatic?.tournament as Record<string, unknown>
        const compHome = infoStatic?.competitor_home as Record<string, unknown>
        const compAway = infoStatic?.competitor_away as Record<string, unknown>
        const oddsRoot = m.odds as Record<string, unknown>

        const tournName = ((tournament?.name as Record<string, string>)?.en) ?? ''
        const homeName = ((compHome?.name as Record<string, string>)?.en) ?? 'Home'
        const awayName = ((compAway?.name as Record<string, string>)?.en) ?? 'Away'
        const startTime = (infoStatic?.start_time as number) ?? Date.now()
        const odds1 = getOdd(oddsRoot, '1', '_', '1')
        const oddsX = getOdd(oddsRoot, '1', '_', '2')
        const odds2 = getOdd(oddsRoot, '1', '_', '3')

        candidates.push({ matchIndex: i, tournamentName: tournName, homeName, awayName, startTime, odds1, oddsX, odds2 })
      }

      const matchList = candidates
        .slice(0, 40)
        .map((c, i) => `${i}: [${c.tournamentName}] ${c.homeName} vs ${c.awayName} (odds: ${c.odds1}/${c.oddsX}/${c.odds2})`)
        .join('\n')

      const prompt = `You are a sports betting expert. From the following football matches, select exactly 4 of the most exciting and high-profile matches from the top leagues (Premier League, LaLiga, Bundesliga, Serie A, Ligue 1, Champions League, World Cup, etc). Reply with ONLY a JSON array of 4 numbers — the index numbers of your chosen matches (e.g. [0,3,7,12]). No explanation.

Matches:
${matchList}`

      let chosenIndices: number[] = []
      try {
        const aiRes = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt) + '?model=openai&seed=42')
        const aiText = await aiRes.text()
        const match = aiText.match(/\[[\d,\s]+\]/)
        if (match) {
          chosenIndices = JSON.parse(match[0]).slice(0, 4)
        }
      } catch {
        chosenIndices = [0, 1, 2, 3]
      }

      if (chosenIndices.length < 4) {
        chosenIndices = [0, 1, 2, 3].slice(0, 4 - chosenIndices.length).map(i => i + chosenIndices.length).concat(chosenIndices)
        chosenIndices = [...new Set(chosenIndices)].slice(0, 4)
      }

      cards.value = chosenIndices.map(idx => {
        const c = candidates[idx]
        if (!c) return null
        const style = leagueStyle(c.tournamentName)
        return {
          flag: style.flag,
          leagueName: c.tournamentName || 'League',
          team1: c.homeName,
          team1Abbr: abbr(c.homeName),
          team1Color: teamColor(c.homeName, style.color1),
          team2: c.awayName,
          team2Abbr: abbr(c.awayName),
          team2Color: teamColor(c.awayName, style.color2),
          time: formatTime(c.startTime),
          odds: [c.odds1, c.oddsX, c.odds2] as [string, string, string],
          activeOdd: 0,
        } satisfies PopularLeagueCard
      }).filter(Boolean) as PopularLeagueCard[]

    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load matches'
      cards.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchAndPickMatches)

  return { cards, loading, error, aiLabel, refresh: fetchAndPickMatches }
}
