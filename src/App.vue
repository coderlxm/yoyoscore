<script setup>
import Header from '@/components/header.vue'
import { useRoute } from "vue-router";
import { useSettingStore } from './stores/setting';
const store = useSettingStore()
const route = useRoute()
const changeTheme = (value) => {
  store.$state.darkTheme = value
}
store.platformPre()
</script>

<template>
  <van-config-provider class="h-full" :theme="store.$state.darkTheme">
    <div class="container1">
      <Header :currentTheme="store.$state.darkTheme" @changeTheme="changeTheme">
      </Header>
      <RouterView v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </div>
  </van-config-provider>
</template>

<style>
.van-theme-dark body {
  color: #f5f5f5;
  background-color: black;
}

.container1 {
  align-items: center;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
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
