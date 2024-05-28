<script setup>
import { ref, reactive, watchEffect, computed } from "vue";
import { useRouter } from "vue-router";
// import { recordStore, resultStore, settingStore } from "@/stores";
import { useRecordStore } from "@/stores/record";
import { useResultStore } from "@/stores/result";
import { useSettingStore } from "@/stores/setting";
import { showConfirmDialog } from 'vant';
import { Icon } from '@iconify/vue';
import exportResults from "@/utils/exportToXlsx";
import resultTable from "@/components/resultTable.vue"
const router = useRouter()
const recordStore = useRecordStore()
const settingStore = useSettingStore()
const resultStore = useResultStore()
const isEditMode = ref(false)
// 默认为1 总分模式1 计数模式0
const scoreMode = ref(1)

const del = (item) => {
  const itemAtIndex = recordStore.recordedGames.findIndex((record) => item === record)
  if (itemAtIndex > -1) {
    recordStore.recordedGames.splice(itemAtIndex, 1)
  }
}

const delGame = (item) => {
  showConfirmDialog({
    title: `确认要删除比赛${item[0].game}吗？`,
    theme: 'round-button',
    confirmButtonColor: settingStore.primaryColor,
    cancelButtonColor: settingStore.darkTheme === 'dark' ? '#111' : '#fff',
  })
    .then(() => {
      // 下面这个方法是错的,有数组数组索引偏移的问题，可以通过逆序迭代解决，或者使用filter
      // this following method is wrong, it will cause index of array mismatch
      // recordStore.recordedGames.forEach((record, index) => {
      //   if (item[0].game === record.game) {
      //     recordStore.recordedGames.splice(index, 1)
      //   }
      // })
      recordStore.recordedGames = recordStore.recordedGames.filter((record) => item[0].game !== record.game)
      if (recordStore.recordedGames.length === 0) isEditMode.value = false
    })
    .catch(() => {
      // on cancel
    });
}
const delAllGames = () => {
  showConfirmDialog({
    title: `确认要删除全部比赛吗？`,
    theme: 'round-button',
    message: '（注：不可恢复，请谨慎操作！）',
    confirmButtonColor: settingStore.primaryColor,
    cancelButtonColor: settingStore.darkTheme === 'dark' ? '#111' : '#fff',
  })
    .then(() => {
      recordStore.recordedGames = []
    })
    .catch(() => {
      // on cancel
    });
}
const isNotEmptyResults = computed(() => {
  return Object.keys(recordStore.recordGroupedAndRanked).length
})

const showBottom = ref(false)
const contsObj = reactive({})
const viewTips = (value) => {
  Object.assign(contsObj, value)
  showBottom.value = true
}
const isFolded = ref(false)
const unfoldAllGames = () => {
  isFolded.value = !isFolded.value
  resultStore.activeNames = isFolded.value ? Object.keys(recordStore.recordGroupedAndRanked) : [];
}
watchEffect(() => {
  if (resultStore.activeNames.length === Object.keys(recordStore.recordGroupedAndRanked).length) isFolded.value = true
  if (resultStore.activeNames.length === 0) isFolded.value = false
  // console.log(resultStore.activeNames);
  if (settingStore.darkTheme === 'dark') {
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
  <div v-show="!settingStore.isFullScreen" class="grid grid-template gap-3 mb-3.5 w-full mt-7">
    <van-button :disabled="!isNotEmptyResults" class="flex-1" @click="scoreMode === 0 ? scoreMode = 1 : scoreMode = 0"
      size="small" :color="settingStore.primaryColor">
      <div class="flex items-center gap-1">
        <Icon class="font-size-4.5" icon="teenyicons:toggle-solid" />切换分数显示模式
      </div>
    </van-button>
    <!-- <van-button plain class="flex-1" @click="" size="small" :color="settingStore.primaryColor">添加比赛</van-button> -->
    <van-button plain :disabled="!isNotEmptyResults" class="flex-1" @click="isEditMode = !isEditMode" size="small"
      :color="settingStore.primaryColor">
      <div class="flex items-center gap-1">
        <Icon icon="uil:edit" class="font-size-5" />
        {{
          isEditMode ? '退出编辑' : '编辑'
        }}
      </div>
    </van-button>
    <van-button plain :disabled="!isNotEmptyResults" class="flex-1" @click="unfoldAllGames" size="small"
      :color="settingStore.primaryColor">
      <div class="flex items-center gap-1">
        <Icon class="font-size-5" v-if="isFolded" icon="hugeicons:unfold-less" />
        <Icon class="font-size-5" v-else icon="hugeicons:unfold-more" />{{ isFolded ? '折叠' : '展开' }}全部比赛
      </div>
    </van-button>
    <van-button :disabled="!isNotEmptyResults" class="flex-1" @click="delAllGames" size="small"
      :color="settingStore.primaryColor">
      <div class="flex items-center gap-1">
        <Icon class="font-size-5" icon="material-symbols:delete" />删除全部比赛
      </div>
    </van-button>
  </div>
  <div
    :class="{ 'flex': true, 'flex-col': true, 'justify-center': !isNotEmptyResults, 'mt-6': settingStore.isFullScreen }"
    :style="{ 'height': settingStore.isFullScreen ? '89vh' : '66vh', 'overflow-y': 'auto' }">
    <van-collapse v-show="isNotEmptyResults" v-model="resultStore.activeNames">
      <van-collapse-item :name="key" v-for="(item, key) in recordStore.recordGroupedAndRanked" :key="key">
        <template #title>
          <div class="flex justify-between items-center">
            <div :style="{ color: settingStore.primaryColor }"
              :class="['pr-2', 'flex', 'flex-1', 'justify-between', 'font-700', 'font-size-4']">
              <div>比赛名称</div>
              <div>{{ key }}</div>
            </div>
            <div class="mt--1" v-if="isEditMode"><van-button @click.stop="delGame(item)" size="mini"
                :color="settingStore.primaryColor">删除</van-button></div>
          </div>
        </template>
        <result-table @viewTips="viewTips" @del="del" :scoreMode="scoreMode" :isEditMode="isEditMode"
          :results="item"></result-table>
      </van-collapse-item>
    </van-collapse>
    <van-empty v-show="!isNotEmptyResults" description="暂无成绩，你可以开始记录">
    </van-empty>
  </div>
  <div v-show="!settingStore.isFullScreen" class="grid gap-4 mt-4">
    <van-button :disabled="!isNotEmptyResults" @click="exportResults" round block :color="settingStore.primaryColor">
      <div class="flex items-center gap-1">
        <Icon class="font-size-5" icon="entypo:export" />
        导出比赛成绩为Excel表格
      </div>
    </van-button>
    <van-button :color="settingStore.primaryColor" @click="router.push({ name: 'home' })" round block plain>
      <div class="flex items-center gap-1">
        <Icon class="font-size-5" icon="mingcute:back-fill" />
        返回
      </div>
    </van-button>
  </div>
  <van-popup round v-model:show="showBottom" position="bottom" :style="{ height: '18%' }">
    <div class="p-6">
      <div :style="{ color: settingStore.primaryColor }" :class="['font-bold']">
        <div class="font-size-5 flex items-center gap-2">
          <Icon icon="material-symbols:info" />选手{{ contsObj.name }}的备注信息
        </div>
        <p class="lh-3vh font-400">{{ contsObj.tips }}</p>
      </div>
    </div>
  </van-popup>
</template>
<style scoped>
:root {
  --cancel-button-color: black;
  /* 默认颜色 */
}

.grid-template {
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
}

.van-dialog__cancel {
  color: var(--cancel-button-color) !important;
  /* 示例颜色 */
}

.van-popup--center {
  width: 100%;
}
</style>