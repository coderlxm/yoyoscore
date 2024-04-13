import { defineStore } from "pinia";
export const useSettingStore = defineStore('setting', {
  state: () => ({
    settingForm: {
      audio: '1',
      trigger: 1,
      vibrate: '1',
      vibMethod: '2'
    },
    primaryColor: '#f01654',
    darkTheme: 'light'
  }),
  persist: true
})