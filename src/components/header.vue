<script setup>
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
</script>
<template>
  <div class="flex justify-between items-center h-5vh">
    <div>
      <i></i>
      <span class="font-size-6 font-700">YoYoScore</span>
    </div>
    <div class="flex gap2">
      <van-button size="small" @click="toggleFullScreen">切换全屏</van-button>
      <van-button size="small">切换主题</van-button>
    </div>
  </div>
</template>