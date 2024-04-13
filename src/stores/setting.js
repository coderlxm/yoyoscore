import { defineStore } from "pinia";
export const useSettingStore = defineStore('setting', {
  state: () => ({
    settingForm: {
      audio: '1',
      trigger: 1,
      vibrate: '1',
      vibMethod: '2'
    }
  }),
  persist: true
})