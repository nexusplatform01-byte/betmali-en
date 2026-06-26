<template>
  <button
    class="odds-btn"
    :class="{ active: active, clicked: isActive }"
    @click.stop="handleClick"
    :disabled="value === '-'"
  >{{ value }}</button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBetSlip } from '@/composables/useBetSlip'

const props = defineProps<{
  value: string
  active?: boolean
  betKey?: string
  betLabel?: string
  betMatch?: string
  betMarket?: string
}>()

const { toggleBet, hasBet } = useBetSlip()

const isActive = computed(() => {
  if (props.betKey) return hasBet(props.betKey)
  return false
})

function handleClick() {
  if (props.value === '-') return
  if (props.betKey) {
    toggleBet({
      key: props.betKey,
      label: props.betLabel ?? props.value,
      odds: props.value,
      matchName: props.betMatch ?? '',
      market: props.betMarket ?? 'Match Result',
    })
  }
}
</script>

<style scoped>
.odds-btn {
  background: #252840;
  color: #e2e8f0;
  border: none;
  border-radius: 3px;
  padding: 4px 0;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  width: 38px;
  text-align: center;
  transition: background 0.12s, color 0.12s;
}
.odds-btn:hover:not(:disabled) { background: #3a3f6e; }
.odds-btn:disabled { opacity: 0.4; cursor: default; }
.odds-btn.active {
  color: #e84c6b;
  font-weight: 800;
}
.odds-btn.clicked {
  background: #e84c6b;
  color: #fff;
}
</style>
