<template>
  <div class="betwin-app">
    <TopNav />
    <div class="main-layout">
      <LeftSidebar />
      <MainContent />
      <RightSidebar />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
import LeftSidebar from '@/components/LeftSidebar.vue'
import MainContent from '@/components/MainContent.vue'
import RightSidebar from '@/components/RightSidebar.vue'
</script>

<style scoped>
.betwin-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #12141f;
  overflow: hidden;
}
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
