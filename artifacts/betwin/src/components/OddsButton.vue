<template>
  <button
    class="odds-btn"
    :class="{ active: active, clicked: isClicked }"
    @click="handleClick"
  >{{ value }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  value: string
  active?: boolean
}>()

const isClicked = ref(false)

function handleClick() {
  isClicked.value = !isClicked.value
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
.odds-btn:hover { background: #3a3f6e; }
.odds-btn.active {
  color: #e84c6b;
  font-weight: 800;
}
.odds-btn.clicked {
  background: #e84c6b;
  color: #fff;
}
</style>
