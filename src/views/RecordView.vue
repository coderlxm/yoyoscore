<script setup>
import { useRouter } from "vue-router";
import { useRecordStore } from "@/stores/record";
import { useScoreStore } from "@/stores/score";
import { storeToRefs } from "pinia";
import { Icon } from '@iconify/vue';
const router = useRouter()
const back = () => {
  router.push({ name: 'home' })
}
const store = useRecordStore()
const scoreStore = useScoreStore()
const { pointadd, pointmin, computedScore } = storeToRefs(scoreStore)
// const activeNames = ref(['1', '2', '3']);
const save = () => {
  const contsObj = { pointadd: pointadd.value, pointmin: pointmin.value, sumScore: computedScore.value, name: store.$state.name, game: store.$state.game }
  let isAllNull = Object.values(contsObj).every(item => item == 0 || item == '')
  if (!isAllNull) {
    store.$state.recordedGames.push(contsObj)
  }
  scoreStore.pressToZero()
  store.$state.game = ''
  store.$state.name = ''
  router.push({ name: 'home' })
}
const chooseThisTag = (item) => {
  store.$state.game = item
}
</script>
<template>
  <div class="mt-10">
    <van-collapse v-model="store.$state.activeNames">
      <van-collapse-item title="选手分数" name="1">
        <van-form ref="formRef" colon label-width="33vw">
          <van-field label="正分">
            <template #input>
              <span class="color-green font-700 font-size-5">{{ pointadd }}</span>
            </template>
          </van-field>
          <van-field name="trigger" label="负分">
            <template #input>
              <span class="color-#f01654 font-700 font-size-5">-{{ pointmin }}</span>
            </template>
          </van-field>
          <van-field name="trigger" label="总得分">
            <template #input>
              <span class="font-700 font-size-5">{{ computedScore }}</span>
            </template>
          </van-field>
        </van-form>
      </van-collapse-item>
      <van-collapse-item title="选手姓名" name="2">
        <van-cell-group inset>
          <van-field v-model="store.$state.name" label="请输入" placeholder="选手姓名" />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="比赛名称" name="3">
        <van-cell-group inset>
          <van-field v-model="store.$state.game" label="请输入或选择" placeholder="比赛名称" />
          <div class="mt-3 grid gap-2 w-full tags" v-if="store.$state.recordedGames.length">
            <van-tag color="#f01654" @click="chooseThisTag(item)" v-for="(item, index) in store.gamesList" :key="index"
              type="primary" size="large">{{ item }}</van-tag>
          </div>
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
    <div style="margin: 16px;" class="grid gap-5">
      <van-button color="#f01654" @click="save" round block type="primary">
        <div class="flex items-center gap-1">
          <Icon class="font-size-5" icon="material-symbols:save" />
          保存
        </div>
      </van-button>
      <van-button color="#f01654" @click="back" round block plain>
        <div class="flex items-center gap-1">
          <Icon class="font-size-5" icon="mingcute:back-fill" />
          返回
        </div>
      </van-button>
    </div>
  </div>
</template>

<style>
.tags {
  grid-template-columns: 1fr 1fr;
}
</style>
