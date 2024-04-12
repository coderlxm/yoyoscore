<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()
const toSetting = () => {
  router.push({ name: 'setting' })
}
const sumpoint = ref(0)
const minpoint = ref(0)
const add1point = () => {
  sumpoint.value += 1
}
const min1point = () => {
  minpoint.value += 1
}
const presstozero = () => {
  sumpoint.value = 0
  minpoint.value = 0
}
</script>

<template>
  <div class="flex flex-col gap-5 full">
    <van-button @click="add1point" class="flex-1" plain color="#7232dd">
      <div>
        <span class="font-700 font-size-20">+ 1</span>
        <div class="font-size-6 mt-5">分数：{{ sumpoint }}</div>
      </div>
    </van-button>
    <van-button @click="min1point" class="flex-1" color="#7232dd">
      <div>
        <span class="font-700 font-size-20">- 1</span>
        <div class="font-size-6 mt-5">扣分：{{ minpoint }}</div>
      </div>
    </van-button>
    <div class="grid gap-3 grid-auto-flow-row-dense button-grid">
      <van-button color="#7232dd" v-longpress="presstozero" round plain>长按清零</van-button>
      <van-button color="#7232dd" round plain>长按记录</van-button>
      <van-button v-longpress="toSetting" color="#7232dd" round plain>长按设置</van-button>
      <van-button color="#7232dd" round plain>长按查看结果</van-button>
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