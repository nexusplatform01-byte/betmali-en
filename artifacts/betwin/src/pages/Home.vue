<template>
  <div class="betwin-app">
    <TopNav />
    <div class="main-layout">
      <LeftSidebar />
      <MainContent />
      <RightSidebar />
    </div>
    <AuthModal />
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
import LeftSidebar from '@/components/LeftSidebar.vue'
import MainContent from '@/components/MainContent.vue'
import RightSidebar from '@/components/RightSidebar.vue'
import AuthModal from '@/components/AuthModal.vue'
</script>

<style scoped>
.betwin-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f3f7;
  overflow: hidden;
}
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
