<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useResultStore } from "@/stores/result";
import { useRecordStore } from "@/stores/record";
import resultTable from "@/components/resultTable.vue"
import { showConfirmDialog } from 'vant';
import { useSettingStore } from "@/stores/setting";
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

const delGame = (item) => {
  showConfirmDialog({
    title: `确认要删除比赛${item[0].game}吗？`,
    theme: 'round-button',
    confirmButtonColor: '#f01654',
    cancelButtonColor: useSettingStore().darkTheme === 'dark' ? '#111' : '#fff',
  })
    .then(() => {
      // 下面这个方法是错的,有数组数组索引偏移的问题
      // recordStore.recordedGames.forEach((record, index) => {
      //   if (item[0].game === record.game) {
      //     recordStore.recordedGames.splice(index, 1)
      //   }
      // })
      recordStore.recordedGames = recordStore.recordedGames.filter((record) => item[0].game !== record.game)
    })
    .catch(() => {
      // on cancel
    });
}
watchEffect(() => {
  if (useSettingStore().darkTheme === 'dark') {
    document.documentElement.style.setProperty(
      '--cancel-button-color', '#fff'
    );
  } else {
    document.documentElement.style.setProperty(
      '--cancel-button-color', 'black')
  }
})
</script>
<template>
  <div class="flex gap-3 mb-5 w-full mt-8">
    <van-button class="flex-1" @click="toggleScoreMode" size="small" plain color="#f01654">切换分数显示模式</van-button>
    <van-button class="flex-1" @click="edit" size="small" color="#f01654">{{ isEditMode ? '退出编辑' : '编辑' }}</van-button>
  </div>
  <van-collapse v-model="store.$state.activeNames">
    <van-collapse-item :name="key" v-for="(item, key) in recordStore.recordGroupedAndRanked" :key="key">
      <template #title>
        <div class="flex justify-between items-center">
          <div class="pr-2 flex flex-1 justify-between font-700 font-size-4 color-#f01654">
            <div>比赛名称</div>
            <div>{{ key }}</div>
          </div>
          <div class="mt--1" v-if="isEditMode"><van-button @click.stop="delGame(item)" size="mini"
              color="#f01654">删除</van-button></div>
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
<style>
:root {
  --cancel-button-color: black;
  /* 默认颜色 */
}

.van-dialog__cancel {
  color: var(--cancel-button-color) !important;
  /* 示例颜色 */
}
</style>