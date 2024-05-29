<script setup>
import { useRouter } from "vue-router";
// the following description is a big mistake
// import { recordStore, scoreStore, settingStore, resultStore } from "@/stores";
import { useRecordStore } from "@/stores/record";
import { useScoreStore } from "@/stores/score";
import { useResultStore } from "@/stores/result";
import { useSettingStore } from "@/stores/setting";
import { storeToRefs } from "pinia";
import { Icon } from '@iconify/vue';
const router = useRouter()
const recordStore = useRecordStore()
const scoreStore = useScoreStore()
const settingStore = useSettingStore()
const resultStore = useResultStore()
const { pointadd, pointmin, computedScore } = storeToRefs(scoreStore)
// const activeNames = ref(['1', '2', '3']);
const save = () => {
  const contsObj = { pointadd: pointadd.value, pointmin: pointmin.value, sumScore: computedScore.value, name: recordStore.name.trim(), game: recordStore.game.trim(), tips: recordStore.tips.trim() }
  let isAllNull = Object.values(contsObj).every(item => item == 0 || item == '')
  if (!isAllNull) {
    recordStore.recordedGames.push(contsObj)
    if (resultStore.activeNames.length === 0) {
      resultStore.activeNames.push(contsObj.game)
    } else {
      resultStore.activeNames = [contsObj.game]
    }
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
// always keeping remark item collapsed
if (recordStore.activeNames.includes('remark')) recordStore.activeNames = recordStore.activeNames.filter((item) => item != 'remark')
</script>
<template>
  <div class="mt-10">
    <van-collapse v-model="recordStore.activeNames">
      <van-collapse-item title="选手分数" name="score">
        <van-form ref="formRef" colon label-width="33vw">
          <van-field label="正分">
            <template #input>
              <span class="color-green font-700 font-size-5">{{ pointadd }}</span>
            </template>
          </van-field>
          <van-field name="trigger" label="负分">
            <template #input>
              <span :class="['font-700', 'font-size-5']" :style="{ color: settingStore.primaryColor }">-{{ pointmin
                }}</span>
            </template>
          </van-field>
          <van-field name="trigger" label="总得分">
            <template #input>
              <span class="font-700 font-size-5">{{ computedScore }}</span>
            </template>
          </van-field>
        </van-form>
      </van-collapse-item>
      <van-collapse-item title="选手姓名" name="name">
        <van-cell-group inset>
          <van-field v-model="recordStore.name" label="请输入" placeholder="选手姓名" />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="比赛名称" name="game">
        <van-cell-group inset>
          <van-field v-model="recordStore.game" label="请输入或选择" placeholder="比赛名称" />
          <div class="mt-3 grid gap-2 w-full grid-cols-2" v-if="recordStore.recordedGames.length">
            <van-tag :color="settingStore.primaryColor" @click="chooseThisTag(item)"
              v-for="(item, index) in recordStore.gamesList" :key="index" type="primary" size="large">{{ item
              }}</van-tag>
          </div>
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="备注（可选）" name="remark">
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
      <van-button :color="settingStore.primaryColor" @click="router.push({ name: 'home' })" round block plain>
        <div class="flex items-center gap-1">
          <Icon class="font-size-5" icon="mingcute:back-fill" />
          返回
        </div>
      </van-button>
    </div>
  </div>
</template>
