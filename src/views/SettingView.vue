<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingStore } from "@/stores/setting";
import { Icon } from '@iconify/vue';
const router = useRouter()
const store = useSettingStore()
const back = () => {
  router.push({ name: 'home' })
}
const triggerMode = ref(1)
const audioSw = ref('1')
const keyboardSw = ref(true)
const vibSw = ref('2')
const vibMethod = ref('2')
const sortBy = ref('1')
triggerMode.value = store.settingForm.trigger
audioSw.value = store.settingForm.audio
sortBy.value = store.settingForm.sort
vibSw.value = store.settingForm.vibrate
vibMethod.value = store.settingForm.vibMethod
keyboardSw.value = store.settingForm.keyboard
const onSubmit = (values) => {
  store.$patch({ settingForm: values })
  router.push({ name: 'home' })
}
// const isSupportVib = ref(true)
// if (!('vibrate' in navigator)) isSupportVib.value = false
</script>
<template>
  <van-form ref="formRef" class="mt-13" colon label-width="35vw" @submit="onSubmit">
    <div class="item-border mb-8">
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
    <div class="item-border mb-8">
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
    <div class="item-border mb-8">
      <div class="ml-4 mb-2">是否开启震动</div>
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
    <div class="item-border mb-8">
      <div class="ml-4 mb-2">成绩排序方式</div>
      <van-field name="sort" label="按照成绩">
        <template #input>
          <van-radio-group direction="horizontal" v-model="sortBy">
            <van-radio checked-color="#f01654" name="0">升序</van-radio>
            <van-radio checked-color="#f01654" name="1">降序</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </div>
    <div class="item-border mb-8">
      <div class="ml-4 mb-2">是否开启键盘触发(仅支持非移动端设备)</div>
      <van-field name="keyboard" label="使用键盘的 +、- 控制">
        <template #input>
          <!-- <van-radio-group :disabled="store.deviceType === 'mobile'" direction="horizontal" v-model="keyboardSw">
            <van-radio checked-color="#f01654" name="0">开启</van-radio>
            <van-radio checked-color="#f01654" name="1">关闭</van-radio>
          </van-radio-group> -->
          <van-switch :disabled="store.deviceType === 'mobile'" v-model="keyboardSw" active-color="#f01654"
            inactive-color="#dcdee0" />
        </template>
      </van-field>
    </div>
    <div class="grid gap-5">
      <van-button color="#f01654" round block type="primary" native-type="submit">
        <div class="flex items-center gap-1">
          <Icon class="font-size-5" icon="material-symbols:save" />
          保存设置
        </div>
      </van-button>
      <van-button color="#f01654" @click="back" round block plain type="primary">
        <div class="flex items-center gap-1">
          <Icon class="font-size-5" icon="mingcute:back-fill" />
          返回
        </div>
      </van-button>
    </div>
    <!-- <div class="flex flex-col items-end gap-2 color-#f01654 mt-5">
      <div>I don't want to win by making compromises to myself, I've always wanted to win on my own terms.</div>
      <div> --- Kerian Cooper</div>
    </div> -->
  </van-form>
</template>

<style>
.item-border {
  border-bottom: 1px solid #ebedf0;
}
</style>
