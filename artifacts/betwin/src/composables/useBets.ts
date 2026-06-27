import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { BetSlipItem } from './useBetSlip'

export type BetStatus = 'pending' | 'won' | 'lost'
export type BetType = 'single' | 'multi' | 'system'

export interface SelectionResult {
  key: string
  status: BetStatus
}

export interface PlacedBet {
  id: string
  ticketId: string
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

const bets = ref<PlacedBet[]>([])
let unsubBets: (() => void) | null = null

onAuthStateChanged(auth, (firebaseUser) => {
  if (unsubBets) { unsubBets(); unsubBets = null }
  bets.value = []
  if (firebaseUser) {
    unsubBets = onSnapshot(
      query(collection(db, 'bets'), where('userId', '==', firebaseUser.uid)),
      (snap) => {
        const list = snap.docs.map(d => {
          const data = d.data()
          return {
            id: d.id,
            ticketId: data.ticketId || d.id,
            timestamp: new Date(data.placedAt || data.timestamp),
            stake: data.stake,
            potentialReturn: data.potentialReturn,
            status: data.status,
            selections: data.selections || [],
            selectionResults: data.selectionResults || [],
            type: data.type || 'single',
            bonusPct: data.bonusPct || 0,
            combinedOdds: data.combinedOdds,
          } as PlacedBet
        })
        list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        bets.value = list
      }
    )
  }
})

export function useBets() {
  function addBet(bet: Omit<PlacedBet, 'id' | 'ticketId' | 'timestamp' | 'status' | 'selectionResults'>): string {
    const user = auth.currentUser
    const ticketId = 'TK-' + String(100000 + Math.floor(Math.random() * 900000))
    const selectionResults: SelectionResult[] = bet.selections.map(s => ({ key: s.key, status: 'pending' as BetStatus }))
    const now = new Date().toISOString()

    const betData = {
      userId: user?.uid || 'guest',
      ticketId,
      stake: bet.stake,
      potentialReturn: bet.potentialReturn,
      potentialWin: bet.potentialReturn,
      status: 'pending',
      type: bet.type,
      bonusPct: bet.bonusPct,
      combinedOdds: bet.combinedOdds,
      selections: bet.selections,
      selectionResults,
      placedAt: now,
      timestamp: now,
      match: bet.selections[0]?.matchName || 'Unknown',
      selection: bet.selections.map(s => s.label).join(', '),
      odds: bet.combinedOdds,
      sport: 'Soccer',
    }

    addDoc(collection(db, 'bets'), betData).catch(console.error)

    if (user) {
      addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'bet',
        name: `Bet Placed — ${ticketId}`,
        amount: bet.stake,
        positive: false,
        date: now,
        method: 'Bet',
        status: 'completed',
        reference: ticketId,
      }).catch(console.error)
    }

    return ticketId
  }

  return { bets, addBet }
}
