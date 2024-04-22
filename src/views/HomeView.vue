<script setup>
import { onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useScoreStore } from "@/stores/score";
import { useSettingStore } from "@/stores/setting";
import { storeToRefs } from "pinia";

const { settingForm, btnOrder } = storeToRefs(useSettingStore())
const router = useRouter()
const route = useRoute()
const toSetting = () => {
  router.push({ name: 'setting' })
}

const store = useScoreStore()
const toRecord = () => {
  router.push({ name: 'record' })
}
const toResult = () => {
  router.push({ name: 'result' })
}
const handleKeydown = (event) => {
  switch (event.code) {
    case 'Equal': // 主键区的 '=' 键
      store.sum('add')
      break;
    case 'Minus': // 主键区的 '-' 键
      store.sum()
      break;
    case 'NumpadAdd': // 小键盘的 '+' 键
      store.sum('add')
      break;
    case 'NumpadSubtract': // 小键盘的 '-' 键
      store.sum()
      break;
  }
}
if (route.name === 'home' && settingForm.value.keyboard === true) {
  window.addEventListener('keydown', handleKeydown)
}
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="flex flex-col gap-5 full pt-7">
    <van-button :style="{ order: btnOrder.orderTop }" @click="store.sum('add')" class="flex-1" plain color="#f01654">
      <div>
        <span class="font-700 font-size-20">+ 1</span>
        <div class="font-size-6 mt-5">分数：{{ store.$state.pointadd }}</div>
      </div>
    </van-button>
    <div :style="{ order: btnOrder.orderMedium }" class="flex flex-col gap-4">
      <div class="grid gap-3 button-grid">
        <van-button color="#f01654"
          v-longpress="{ onLongPress: store.pressToZero, onShortPress: store.pressToZero, enabled: settingForm.trigger === 1 ? true : false, duration: 1000 }">{{
            settingForm.trigger === 1 ? '长按清零' : '清零' }}</van-button>
        <van-button
          v-longpress="{ onLongPress: toRecord, onShortPress: toRecord, enabled: settingForm.trigger === 1 ? true : false, duration: 1000 }"
          color="#f01654" plain>{{ settingForm.trigger === 1 ? '长按记录' : '记录' }}</van-button>
      </div>
      <div class="grid gap-3 button-grid-2">
        <van-button
          v-longpress="{ onLongPress: toSetting, onShortPress: toSetting, enabled: settingForm.trigger === 1 ? true : false, duration: 1000 }"
          plain color="#f01654">{{ settingForm.trigger === 1 ? '长按设置' : '设置' }}</van-button>
        <van-button
          v-longpress="{ onLongPress: toResult, onShortPress: toResult, enabled: settingForm.trigger === 1 ? true : false, duration: 1000 }"
          color="#f01654">{{ settingForm.trigger === 1 ? '长按查看结果' : '查看结果' }}</van-button>
      </div>
    </div>
    <van-button :style="{ order: btnOrder.orderBottom }" @click="store.sum()" class="flex-1" color="#f01654">
      <div>
        <span class="font-700 font-size-20">- 1</span>
        <div class="font-size-6 mt-5">扣分：{{ store.$state.pointmin }}</div>
      </div>
    </van-button>
  </div>
</template>
<style>
.full {
  min-height: 91vh;
}

.button-grid {
  grid-template-columns: 1fr 1fr;
}

.button-grid-2 {
  grid-template-columns: 1fr 1fr;
}
</style>