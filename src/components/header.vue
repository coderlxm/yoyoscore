<script setup>
import { useSettingStore } from '@/stores/setting';
import { useRoute } from "vue-router";
import { computed } from "vue";
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
      document.exitFullscreen();
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
const computedSize = computed(() => {
  const aspectRatio = window.innerWidth / window.innerHeight
  console.log(aspectRatio);
  return aspectRatio < (9 / 16) ? 'mini' : 'small'
})
const computedTitleStyle = computed(() => {
  return {
    'color': store.$state.darkTheme === 'dark' ? '#ffffff' : '#f01654',
    'font-size': computedSize.value === 'mini' ? '5.5vw' : '4vw'
  }
})
console.log(computedTitleStyle.value, computedSize.value);
</script>
<template>
  <div class="flex justify-between items-center h-5vh pt-9">
    <div class="flex flex-1">
      <i></i>
      <span :style="computedTitleStyle" class="font-700">YoYoScore</span>
    </div>
    <div class="flex gap-1">
      <van-button color="#f01654" :disabled="route.name !== 'home'" :size="computedSize"
        @click="toggleLayout">切换布局</van-button>
      <van-button color="#f01654" :size="computedSize" @click="toggleFullScreen">切换全屏</van-button>
      <van-button color="#f01654" :size="computedSize" @click="toggle">{{ store.$state.darkTheme === 'dark' ? '黑夜' :
        '白天'
        }}</van-button>
    </div>
  </div>
</template>