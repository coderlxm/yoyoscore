<script setup>
import { useRouter } from "vue-router";
import { recordStore, scoreStore, settingStore } from "@/stores";
import { storeToRefs } from "pinia";
import { Icon } from '@iconify/vue';
const router = useRouter()
const back = () => {
  router.push({ name: 'home' })
}

const { pointadd, pointmin, computedScore } = storeToRefs(scoreStore)
// const activeNames = ref(['1', '2', '3']);
const save = () => {
  const contsObj = { pointadd: pointadd.value, pointmin: pointmin.value, sumScore: computedScore.value, name: recordStore.name, game: recordStore.game, tips: recordStore.tips }
  let isAllNull = Object.values(contsObj).every(item => item == 0 || item == '')
  if (!isAllNull) {
    recordStore.recordedGames.push(contsObj)
  }
  scoreStore.pressToZero()
  recordStore.game = ''
  recordStore.name = ''
  recordStore.tips = ''
  router.push({ name: 'home' })
}
const chooseThisTag = (item) => {
  recordStore.game = item
}
</script>
<template>
  <div class="mt-10">
    <van-collapse v-model="recordStore.activeNames">
      <van-collapse-item title="选手分数" name="1">
        <van-form ref="formRef" colon label-width="33vw">
          <van-field label="正分">
            <template #input>
              <span class="color-green font-700 font-size-5">{{ pointadd }}</span>
            </template>
          </van-field>
          <van-field name="trigger" label="负分">
            <template #input>
              <span :class="[`color-${settingStore.primaryColor}`, 'font-700', 'font-size-5']">-{{ pointmin }}</span>
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
          <van-field v-model="recordStore.name" label="请输入" placeholder="选手姓名" />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="比赛名称" name="3">
        <van-cell-group inset>
          <van-field v-model="recordStore.game" label="请输入或选择" placeholder="比赛名称" />
          <div class="mt-3 grid gap-2 w-full tags" v-if="recordStore.recordedGames.length">
            <van-tag :color="settingStore.primaryColor" @click="chooseThisTag(item)"
              v-for="(item, index) in recordStore.gamesList" :key="index" type="primary" size="large">{{ item
              }}</van-tag>
          </div>
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="备注（可选）" name="4">
        <van-cell-group inset>
          <van-field v-model="recordStore.tips" rows="2" autosize type="textarea" maxlength="30" placeholder="请输入备注"
            show-word-limit />
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
    <div style="margin: 16px;" class="grid gap-5">
      <van-button :color="settingStore.primaryColor" @click="save" round block type="primary">
        <div class="flex items-center gap-1">
          <Icon class="font-size-5" icon="material-symbols:save" />
          保存
        </div>
      </van-button>
      <van-button :color="settingStore.primaryColor" @click="back" round block plain>
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
