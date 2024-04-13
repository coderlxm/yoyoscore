<script setup>
import { useSettingStore } from '@/stores/setting';

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
</script>
<template>
  <div class="flex justify-between items-center h-5vh mb-2 pt-12">
    <div>
      <i></i>
      <span :style="{ color: store.$state.darkTheme === 'dark' ? '#ffffff' : '#f01654' }"
        class="font-size-6 font-700">YoYoScore</span>
    </div>
    <div class="flex gap2">
      <van-button color="#f01654" size="small" @click="toggleFullScreen">切换全屏</van-button>
      <van-button color="#f01654" size="small" @click="toggle">{{ store.$state.darkTheme === 'dark' ? '黑夜' : '白天'
        }}</van-button>
    </div>
  </div>
</template>