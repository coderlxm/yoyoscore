<script setup>
import { useResultStore } from "@/stores/result";
const props = defineProps(['results', 'isEditMode', 'scoreMode'])
const emit = defineEmits(['del'])
const store = useResultStore()
const delRecord = (item) => {
  emit('del', item)
}
</script>
<template>
  <table class="w-full color-#f01654">
    <thead>
      <tr class="w-full flex justify-between">
        <th class="w-24vw">选手姓名</th>
        <th class="w-24vw">得分</th>
        <th class="w-24vw">排名</th>
        <th class="w-8vw" v-if="isEditMode"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in props.results" :key="item.game" class="w-full flex items-center justify-between">
        <td class="w-24vw text-center">{{ item.name ? item.name : '--' }}</td>
        <td class="w-24vw text-center">
          <!-- <span>{{ props.scoreMode === 1 ? ((item.sumScore / props.results[0].sumScore) * 100).toFixed(2) :
            `${item.pointadd}-${item.pointmin}`
            }}</span> -->
          <span>{{ store.dealScoreDisplay(props, item) }}</span>
        </td>
        <td class="w-24vw text-center">{{ index + 1 }}</td>
        <td class="w-8vw text-center" v-if="props.isEditMode">
          <van-button @click="delRecord(item)" color="#f01654" size="mini">删除</van-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>