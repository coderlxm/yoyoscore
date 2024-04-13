<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingStore } from "@/stores/setting";
const router = useRouter()
const store = useSettingStore()
const back = () => {
  router.push({ name: 'home' })
}
const triggerMode = ref(1)
const audioSw = ref('1')
const vibSw = ref('2')
const vibMethod = ref('2')
triggerMode.value = store.$state.settingForm.trigger
audioSw.value = store.$state.settingForm.audio
vibSw.value = store.$state.settingForm.vibrate
vibMethod.value = store.$state.settingForm.vibMethod
const onSubmit = (values) => {
  store.$patch({ settingForm: values })
  router.push({ name: 'home' })
}
</script>
<template>
  <van-form ref="formRef" class="mt-10" colon label-width="33vw" @submit="onSubmit">
    <div class="item-border mb-10">
      <div class="ml-4 mb-2">除+、-按钮外的按钮触发方式</div>
      <van-field name="trigger" label="按钮触发方式">
        <template #input>
          <van-radio-group v-model="triggerMode" direction="horizontal">
            <van-radio checked-color="#f01654" :name="1">长按</van-radio>
            <van-radio checked-color="#f01654" :name="0">短按</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
    <div class="item-border mb-10">
      <div class="ml-4 mb-2">+、-按钮的音效开关</div>
      <van-field name="audio" label="音效开关">
        <template #input>
          <van-radio-group v-model="audioSw" direction="horizontal">
            <van-radio checked-color="#f01654" name="1">开启</van-radio>
            <van-radio checked-color="#f01654" name="2">关闭</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
    <div class="item-border mb-10">
      <div class="ml-4 mb-2">是否开启震动（请切换全屏使用）</div>
      <van-field name="vibrate" label="震动开关">
        <template #input>
          <van-radio-group v-model="vibSw" direction="horizontal">
            <van-radio checked-color="#f01654" name="1">开启</van-radio>
            <van-radio checked-color="#f01654" name="2">关闭</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-if="vibSw === '1'" name="vibMethod" label="震动方式">
        <template #input>
          <van-radio-group v-model="vibMethod" direction="horizontal">
            <van-radio checked-color="#f01654" name="1">长震动</van-radio>
            <van-radio checked-color="#f01654" name="2">短震动</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
    <div style="margin: 16px;" class="grid gap-5">
      <van-button color="#f01654" round block type="primary" native-type="submit">
        保存设置
      </van-button>
      <van-button color="#f01654" @click="back" round block plain type="primary">
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
