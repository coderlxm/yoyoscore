<script setup>
import { useResultStore } from "@/stores/result";
import { useSettingStore } from "@/stores/setting";
import { toRefs } from "vue";
const props = defineProps(['results', 'isEditMode', 'scoreMode'])
const { results, isEditMode } = toRefs(props)
const emit = defineEmits(['del', 'toast', 'viewTips'])
const settingStore = useSettingStore()
const store = useResultStore()
const delRecord = (item) => {
  emit('del', item)
}
const repeatName = (item) => {
  console.log(item);
  return results.value.filter(result => result.name && (result.name.trim() === item.name.trim())).length > 1
}
const viewTips = (item) => {
  emit('viewTips', item)
}
</script>
<template>
  <table :class="['w-full']" :style="{ color: settingStore.primaryColor }">
    <thead>
      <tr class="w-full flex justify-between">
        <th class="w-24vw">选手姓名</th>
        <th class="w-24vw">得分</th>
        <th class="w-8vw">排名</th>
        <th class="w-8vw" v-if="!isEditMode">备注</th>
        <th class="w-8vw" v-if="isEditMode"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in results" :key="item.game" class="w-full flex items-center justify-between">
        <td class="w-24vw text-center">
          <div class="flex items-center justify-center gap-1">
            <van-tag v-if="repeatName(item)" plain :color="settingStore.primaryColor">重名</van-tag>
            <span>{{ item.name ? item.name : '--' }}</span>
          </div>
        </td>
        <td class="w-24vw text-center">
          <span>{{ store.dealScoreDisplay(props, item) }}</span>
        </td>
        <td class="w-8vw text-center">{{ settingStore.settingForm.sort === '1' ? index + 1 : results.length -
          index
          }}
        </td>
        <td class="w-8vw text-center" v-if="!isEditMode">
          <van-button size="mini" @click="viewTips(item)" v-if="item.tips"
            :color="settingStore.primaryColor">查看</van-button>
          <span v-else>--</span>
        </td>
        <td class="w-8vw text-center" v-if="isEditMode">
          <van-button @click="delRecord(item)" :color="settingStore.primaryColor" size="mini">删除</van-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>