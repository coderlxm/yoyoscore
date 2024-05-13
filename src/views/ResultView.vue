<script setup>
import { ref, reactive, watchEffect, computed } from "vue";
import { useRouter } from "vue-router";
import { recordStore, resultStore, settingStore } from "@/stores";
import { showConfirmDialog } from 'vant';
import { Icon } from '@iconify/vue';
import exportResults from "@/utils/exportToXlsx";
import resultTable from "@/components/resultTable.vue"
const router = useRouter()
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
      // 下面这个方法是错的,有数组数组索引偏移的问题
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
const isNotEmptyResults = computed(() => {
  return Object.keys(recordStore.recordGroupedAndRanked).length
})

const showBottom = ref(false)
const contsObj = reactive({})
const viewTips = (value) => {
  Object.assign(contsObj, value)
  showBottom.value = true
}
watchEffect(() => {
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
  <div class="flex gap-3 mb-5 w-full mt-7">
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
  </div>
  <div :class="{ 'flex': true, 'flex-col': true, 'justify-center': !isNotEmptyResults }"
    style="height: 68vh;overflow-y: auto;">
    <van-collapse v-show="isNotEmptyResults" v-model="resultStore.activeNames">
      <van-collapse-item :name="key" v-for="(item, key) in recordStore.recordGroupedAndRanked" :key="key">
        <template #title>
          <div class="flex justify-between items-center">
            <div
              :class="['pr-2', 'flex', 'flex-1', 'justify-between', 'font-700', 'font-size-4', `color-${settingStore.primaryColor}`]">
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
      <!-- <van-collapse-item title="选手姓名" name="2">
      <van-cell-group inset>
        <van-field v-model="store.name" label="请输入" placeholder="选手姓名" />
      </van-cell-group>
    </van-collapse-item> -->
    </van-collapse>
    <van-empty v-show="!isNotEmptyResults" description="暂无成绩，你可以开始记录">
    </van-empty>
  </div>
  <div class="grid gap-4 mt-4">
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
      <div :class="[`color-${settingStore.primaryColor}`, 'font-bold']">
        <div class="font-size-5 flex items-center gap-2">
          <Icon icon="material-symbols:info" />选手{{ contsObj.name }}的备注信息
        </div>
        <p class="lh-3vh font-400">{{ contsObj.tips }}</p>
      </div>
    </div>
  </van-popup>
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

.van-popup--center {
  width: 100%;
}
</style>