import { ref } from 'vue'
import type { BetSlipItem } from './useBetSlip'

export type BetStatus = 'pending' | 'won' | 'lost'
export type BetType = 'single' | 'multi' | 'system'

export interface SelectionResult {
  key: string
  status: BetStatus
}

export interface PlacedBet {
  id: string
  timestamp: Date
  stake: number
  potentialReturn: number
  status: BetStatus
  selections: BetSlipItem[]
  selectionResults: SelectionResult[]
  type: BetType
  bonusPct: number
  combinedOdds: number
}

const bets = ref<PlacedBet[]>([
  {
    id: '332',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    stake: 5000,
    potentialReturn: 111240,
    status: 'pending',
    type: 'multi',
    bonusPct: 3,
    combinedOdds: 21.60,
    selections: [
      { key: 'nzl-bel-1', market: '1X2', label: 'New Zealand Win', odds: '12.00', matchName: 'New Zealand vs Belgium' },
      { key: 'cro-gha-1', market: '1X2', label: 'Croatia Win', odds: '1.80', matchName: 'Croatia vs Ghana' },
    ],
    selectionResults: [
      { key: 'nzl-bel-1', status: 'pending' },
      { key: 'cro-gha-1', status: 'pending' },
    ],
  },
  {
    id: '287',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
    stake: 10000,
    potentialReturn: 34500,
    status: 'won',
    type: 'single',
    bonusPct: 0,
    combinedOdds: 3.45,
    selections: [
      { key: 'col-por-x', market: '1X2', label: 'Draw', odds: '3.45', matchName: 'Colombia vs Portugal' },
    ],
    selectionResults: [
      { key: 'col-por-x', status: 'won' },
    ],
  },
  {
    id: '201',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    stake: 20000,
    potentialReturn: 86000,
    status: 'lost',
    type: 'multi',
    bonusPct: 5,
    combinedOdds: 4.10,
    selections: [
      { key: 'egy-iri-2', market: '1X2', label: 'IR Iran Win', odds: '1.50', matchName: 'Egypt vs IR Iran' },
      { key: 'pan-eng-2', market: '1X2', label: 'England Win', odds: '1.04', matchName: 'Panama vs England' },
      { key: 'uru-esp-2', market: '1X2', label: 'Spain Win', odds: '1.72', matchName: 'Uruguay vs Spain' },
    ],
    selectionResults: [
      { key: 'egy-iri-2', status: 'won' },
      { key: 'pan-eng-2', status: 'won' },
      { key: 'uru-esp-2', status: 'lost' },
    ],
  },
])

export function useBets() {
  function addBet(bet: Omit<PlacedBet, 'id' | 'timestamp' | 'status' | 'selectionResults'>): string {
    const id = String(100 + Math.floor(Math.random() * 900))
    const selectionResults: SelectionResult[] = bet.selections.map(s => ({ key: s.key, status: 'pending' as BetStatus }))
    bets.value.unshift({
      ...bet,
      id,
      timestamp: new Date(),
      status: 'pending',
      selectionResults,
    })
    return id
  }

  return { bets, addBet }
}
