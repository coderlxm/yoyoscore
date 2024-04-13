<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useScoreStore } from "@/stores/score";
const router = useRouter()
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
</script>

<template>
  <div class="flex flex-col gap-5 full">
    <van-button @click="store.sum('add')" class="flex-1" plain color="#7232dd">
      <div>
        <span class="font-700 font-size-20">+ 1</span>
        <div class="font-size-6 mt-5">分数：{{ store.$state.pointadd }}</div>
      </div>
    </van-button>
    <van-button @click="store.sum()" class="flex-1" color="#7232dd">
      <div>
        <span class="font-700 font-size-20">- 1</span>
        <div class="font-size-6 mt-5">扣分：{{ store.$state.pointmin }}</div>
      </div>
    </van-button>
    <div class="grid gap-3 grid-auto-flow-row-dense button-grid">
      <van-button color="#7232dd" v-longpress="store.pressToZero" round plain>长按清零</van-button>
      <van-button @click="toRecord" color="#7232dd" round plain>长按记录</van-button>
      <van-button v-longpress="toSetting" color="#7232dd" round plain>长按设置</van-button>
      <van-button @click="toResult" color="#7232dd" round plain>长按查看结果</van-button>
    </div>
  </div>
</template>
<style>
.full {
  min-height: 90vh;
}

.button-grid {
  grid-template-columns: 1fr 1fr;
}
</style>