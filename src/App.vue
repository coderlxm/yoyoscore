<script setup>
import Header from '@/components/header.vue'
</script>

<template>
  <div class="container">
    <Header></Header>
    <RouterView />
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  min-height: 100%;
}
</style>
