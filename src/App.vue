<script setup>
import Header from '@/components/headerBar.vue'
import { onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useSettingStore } from './stores/setting';
// Toast
import "vant/es/toast/style";
// Dialog
import "vant/es/dialog/style";
// Notify
import "vant/es/notify/style";
// ImagePreview
import "vant/es/image-preview/style";
const store = useSettingStore()
const route = useRoute()
const changeTheme = (value) => {
  store.darkTheme = value
}
store.platformPre()
store.setupFullScreenListener()
onUnmounted(() => {
  store.removeFullScreenListener()
})

</script>

<template>
  <van-config-provider class="h-full" :theme="store.darkTheme">
    <Header v-if="!route.meta.start && route.name !== undefined" :currentTheme="store.darkTheme"
      @changeTheme="changeTheme">
    </Header>
    <div class="container1">
      <RouterView v-slot="{ Component }">
        <!-- <transition name="fade">
          <component :is="Component" :key="route.path" />
        </transition> -->
        <component :is="Component" :key="route.path" />
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
  /* min-height: 100%; */
}

/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */
</style>
