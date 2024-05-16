<script setup>
import { useRouter } from "vue-router";
import { useSettingStore } from '@/stores/setting';
import { Icon } from '@iconify/vue';
const router = useRouter()
const store = useSettingStore()
const startUse = () => {
  localStorage.setItem('isRegUser', true)
  router.push({ name: 'home' })
}
</script>
<template>
  <Transition appear name="bounce">
    <div class="full flex flex-col items-center justify-center">
      <div :style="{ 'color': store.primaryColor }" class="flex-1 gap-1 flex flex-col items-center justify-center">
        <Icon class="font-size-30" icon="noto:yo-yo" />
        <h1>YoYoScore</h1>
        <!-- <div class="flex flex-col">
        <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I don't want to win by making compromises to myself, I've
          always wanted to win on my
          own terms</h4>
        <h4 class="self-end">---Kerian Cooper</h4>
      </div> -->
        <van-button style="margin-bottom: 1rem;" :plain="store.deviceType === 'mobile'" :color="store.primaryColor"
          size="large" @click="startUse">开始使用</van-button>
        <van-button v-if="store.deviceType === 'mobile' && store.systemOSType !== 'ios'" :color="store.primaryColor"
          size="large" @click="startUse">安装YoYoScore</van-button>
        <!-- <h2>欢迎使用YoYoScore！</h2> -->
      </div>
    </div>
  </Transition>
</template>
<style>
.full {
  min-height: 91vh;
}

.bounce-enter-active {
  animation: bounce-in 0.6s;
}

.bounce-leave-active {
  animation: bounce-in 0.6s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}
</style>