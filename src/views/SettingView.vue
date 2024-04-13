<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingStore } from "@/stores/setting";
const router = useRouter()
const store = useSettingStore()
const back = () => {
  router.push({ name: 'home' })
}
// const triggerMode = ref('1')
// const audioSw = ref('1')
// const vibSw = ref('2')
// const vibMethod = ref('2')

const onSubmit = (values) => {
  store.$patch(values)
}
</script>
<template>
  <van-form ref="formRef" class="mt-5" colon label-width="33vw" @submit="onSubmit">
    <div class="item-border mb-10">
      <div class="ml-4 mb-2">除+、-按钮外的按钮触发方式</div>
      <van-field name="trigger" label="按钮触发方式">
        <template #input>
          <van-radio-group v-model="store.$state.settingForm.trigger" direction="horizontal">
            <van-radio name="1">长按</van-radio>
            <van-radio name="2">短按</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
    <div class="item-border mb-10">
      <div class="ml-4 mb-2">+、-按钮的音效开关</div>
      <van-field name="audio" label="音效开关">
        <template #input>
          <van-radio-group v-model="store.$state.settingForm.audio" direction="horizontal">
            <van-radio name="1">开启</van-radio>
            <van-radio name="2">关闭</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
    <div class="item-border mb-10">
      <div class="ml-4 mb-2">是否开启震动（暂未支持）</div>
      <van-field name="vibrate" label="震动开关">
        <template #input>
          <van-radio-group v-model="store.$state.settingForm.vibrate" direction="horizontal">
            <van-radio name="1">开启</van-radio>
            <van-radio name="2">关闭</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-if="store.$state.settingForm.vibrate === '1'" name="vibMethod" label="震动方式">
        <template #input>
          <van-radio-group v-model="store.$state.settingForm.vibMethod" direction="horizontal">
            <van-radio name="1">长震动</van-radio>
            <van-radio name="2">短震动</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
    <div style="margin: 16px;" class="grid gap-5">
      <van-button round block type="primary" native-type="submit">
        保存设置
      </van-button>
      <van-button @click="back" round block plain type="primary">
        返回
      </van-button>
    </div>
  </van-form>
</template>

<style>
.item-border {
  border-bottom: 1px solid #ebedf0;
}
</style>
