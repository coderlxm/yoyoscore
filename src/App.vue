<script setup>
import Header from '@/components/header.vue'
import { useRoute } from "vue-router";
const route = useRoute()
</script>

<template>
  <div class="container">
    <Header></Header>
    <RouterView v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" :key="route.name" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  min-height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
