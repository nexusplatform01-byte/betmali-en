import { ref, computed } from 'vue'

export interface BetSlipItem {
  key: string
  market: string
  label: string
  odds: string
  matchName: string
}

const slipItems = ref<BetSlipItem[]>([])

export function useBetSlip() {
  function addBet(item: BetSlipItem) {
    if (!slipItems.value.find(b => b.key === item.key)) {
      slipItems.value.push(item)
    }
  }

  function removeBet(key: string) {
    slipItems.value = slipItems.value.filter(b => b.key !== key)
  }

  function toggleBet(item: BetSlipItem) {
    const exists = slipItems.value.find(b => b.key === item.key)
    if (exists) {
      removeBet(item.key)
    } else {
      addBet(item)
    }
  }

  function clearAll() {
    slipItems.value = []
  }

  function hasBet(key: string) {
    return slipItems.value.some(b => b.key === key)
  }

  const totalOdds = computed(() => {
    if (slipItems.value.length === 0) return '0.00'
    const total = slipItems.value.reduce((acc, b) => acc * parseFloat(b.odds), 1)
    return total.toFixed(2)
  })

  return { slipItems, addBet, removeBet, toggleBet, clearAll, hasBet, totalOdds }
}
