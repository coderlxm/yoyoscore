<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useResultStore } from "@/stores/result";
import { useRecordStore } from "@/stores/record";
import resultTable from "@/components/resultTable.vue"
const isEditMode = ref(false)
// 默认为1 总分模式1 计数模式0
const scoreMode = ref(1)
const store = useResultStore()
const recordStore = useRecordStore()
const edit = () => {
  isEditMode.value = !isEditMode.value
}
const del = (item) => {
  const itemAtIndex = recordStore.$state.recordedGames.findIndex((record) => item.name === record.name)
  // console.log(itemAtIndex);
  recordStore.$state.recordedGames.splice(itemAtIndex, 1)
  console.log(recordStore.recordGroupedAndRanked);
}
const toggleScoreMode = () => {
  if (scoreMode.value === 0) {
    scoreMode.value = 1
  } else {
    scoreMode.value = 0
  }
}
const router = useRouter()
const back = () => {
  router.push({ name: 'home' })
}
</script>
<template>
  <div class="flex gap-3 mb-5 w-full mt-8">
    <van-button class="flex-1" @click="toggleScoreMode" size="small" plain color="#f01654">切换分数显示模式</van-button>
    <van-button class="flex-1" @click="edit" size="small" color="#f01654">{{ isEditMode ? '退出编辑' : '编辑' }}</van-button>
  </div>
  <van-collapse v-model="store.$state.activeNames">
    <van-collapse-item :name="key" v-for="(item, key) in recordStore.recordGroupedAndRanked" :key="key">
      <template #title>
        <div class="pr-2 flex justify-between font-700 font-size-4 color-#f01654">
          <div>比赛名称</div>
          <div>{{ key }}</div>
        </div>
      </template>
      <result-table @del="del" :scoreMode="scoreMode" :isEditMode="isEditMode" :results="item"></result-table>
    </van-collapse-item>
    <!-- <van-collapse-item title="选手姓名" name="2">
      <van-cell-group inset>
        <van-field v-model="store.$state.name" label="请输入" placeholder="选手姓名" />
      </van-cell-group>
    </van-collapse-item> -->
  </van-collapse>
  <div class="mt-4">
    <van-button color="#f01654" @click="back" round block plain>
      返回
    </van-button>
  </div>
</template>

<style></style>
