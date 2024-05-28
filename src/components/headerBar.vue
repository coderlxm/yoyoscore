<script setup>
import { useSettingStore } from '@/stores/setting';
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { Icon } from '@iconify/vue';
const route = useRoute()
const store = useSettingStore()
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    // 如果当前没有元素在全屏模式，请求全屏模式
    document.documentElement.requestFullscreen().catch(err => {
      alert(`无法启用全屏模式: ${err.message}`);
    });
  } else {
    // 如果当前已经是全屏模式，退出全屏模式
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}
const emit = defineEmits(['changeTheme'])
const props = defineProps(['currentTheme'])
const toggle = () => {
  const currentTheme = props.currentTheme === 'light' ? 'dark' : 'light'
  emit('changeTheme', currentTheme)
}
const toggleLayout = () => {
  store.changeBtnOrder()
}
const innerWidth = ref(window.innerWidth)
const innerHeight = ref(window.innerHeight)
const computedSize = computed(() => {
  const aspectRatio = innerWidth.value / innerHeight.value
  // console.log(aspectRatio);
  return aspectRatio <= (9 / 14) ? 'mini' : 'small'
})
const computedTitleStyle = computed(() => {
  return {
    'color': store.darkTheme === 'dark' ? '#ffffff' : store.primaryColor
  }
})

window.addEventListener('resize', () => {
  innerWidth.value = window.innerWidth
  innerHeight.value = window.innerHeight
});
</script>
<template>
  <div class="flex justify-between items-center h-5vh pt-9 pr-1.5rem pl-1.5rem">
    <div class="flex flex-1 items-center gap-2">
      <Icon class="font-size-8" icon="noto:yo-yo" />
      <span :style="computedTitleStyle" class="font-700 font-size-1.2rem">YoYoScore</span>
    </div>
    <div class="flex gap-1">
      <van-button v-if="store.deferredPrompt" :color="store.primaryColor" :size="computedSize"
        @click="store.promptInstall()">
        安装
      </van-button>
      <van-button :color="store.primaryColor" :disabled="route.name !== 'home'" :size="computedSize"
        @click="toggleLayout">切换布局</van-button>
      <van-button :color="store.primaryColor" :size="computedSize" @click="toggleFullScreen">切换全屏</van-button>
      <van-button :color="store.primaryColor" :size="computedSize" @click="toggle">{{ store.darkTheme === 'dark' ? '黑夜'
        :
        '白天'
        }}</van-button>
    </div>
  </div>
</template>