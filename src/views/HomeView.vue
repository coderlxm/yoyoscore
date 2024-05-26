<script setup>
import { onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useScoreStore } from "@/stores/score";
import { useSettingStore } from "@/stores/setting";
import { storeToRefs } from "pinia";
import { Icon } from '@iconify/vue';
const { settingForm, btnOrder, primaryColor } = storeToRefs(useSettingStore())
const router = useRouter()
const route = useRoute()
const toSetting = () => {
  router.push({ name: 'setting' })
}

const store = useScoreStore()
store.preloadAudio()
const toRecord = () => {
  router.push({ name: 'record' })
}
const toResult = () => {
  router.push({ name: 'result' })
}
const pressedKeys = {}
const handleKeyup = (event) => {
  // 当按键松开时，将其从按下状态中移除
  delete pressedKeys[event.code];
}
const handleKeydown = (event) => {
  if (pressedKeys[event.code]) {
    // 如果按键已记录为按下状态，不再触发
    return;
  }
  pressedKeys[event.code] = true;
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
const addKeyboardListeners = () => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
};
const removeKeyboardListeners = () => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('keyup', handleKeyup)
}
if (route.name === 'home' && settingForm.value.keyboard) {
  addKeyboardListeners();
}
onUnmounted(() => {
  removeKeyboardListeners()
})
</script>

<template>
  <div class="flex flex-col gap-5 full pt-7">
    <van-button :style="{ order: btnOrder.orderTop }" @click="store.sum('add')" class="flex-1" plain
      :color="primaryColor">
      <div>
        <span class="font-700 font-size-20">+ 1</span>
        <div class="font-size-6 mt-5">分数：{{ store.pointadd }}</div>
      </div>
    </van-button>
    <div :style="{ order: btnOrder.orderMedium }" class="flex flex-col gap-4">
      <div class="grid gap-3 button-grid">
        <van-button :color="primaryColor"
          v-longpress="{ onLongPress: store.pressToZero, onShortPress: store.pressToZero, enabled: settingForm.trigger === 1, duration: 1000 }">
          <div class="flex items-center gap-1">
            <Icon icon="icon-park-outline:clear" class="font-size-5" style="color: #fff;" />
            <span>{{
              settingForm.trigger === 1 ? '长按清零' : '清零' }}</span>
          </div>
        </van-button>
        <van-button
          v-longpress="{ onLongPress: toRecord, onShortPress: toRecord, enabled: settingForm.trigger === 1, duration: 1000 }"
          :color="primaryColor" plain>
          <div class="flex items-center gap-1">
            <Icon icon="jam:write" class="font-size-5" />
            <span>{{ settingForm.trigger === 1 ? '长按记录' : '记录' }}</span>
          </div>
        </van-button>
      </div>
      <div class="grid gap-3 button-grid-2">
        <van-button
          v-longpress="{ onLongPress: toSetting, onShortPress: toSetting, enabled: settingForm.trigger === 1, duration: 1000 }"
          plain :color="primaryColor">
          <div class="flex items-center gap-1">
            <Icon class="font-size-5" icon="uil:setting" />
            <span>{{ settingForm.trigger === 1 ? '长按设置' : '设置' }}</span>
          </div>
        </van-button>
        <van-button
          v-longpress="{ onLongPress: toResult, onShortPress: toResult, enabled: settingForm.trigger === 1, duration: 1000 }"
          :color="primaryColor">
          <div class="flex items-center gap-1">
            <Icon class="font-size-5" icon="carbon:result" />
            <span>{{ settingForm.trigger === 1 ? '长按查看结果' : '查看结果' }}</span>
          </div>
        </van-button>
      </div>
    </div>
    <van-button :style="{ order: btnOrder.orderBottom }" @click="store.sum()" class="flex-1" :color="primaryColor">
      <div>
        <span class="font-700 font-size-20">- 1</span>
        <div class="font-size-6 mt-5">扣分：{{ store.pointmin }}</div>
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