import { defineStore } from "pinia";
export const useSettingStore = defineStore('setting', {
  state: () => ({
    settingForm: {
      audio: '1',
      trigger: 1,
      vibrate: '1',
      vibMethod: '2',
      sort: '1'
    },
    primaryColor: '#f01654',
    darkTheme: 'light',
    btnOrder: {
      orderTop: 1,
      orderMedium: 3,
      orderBottom: 2
    }
  }),
  actions: {
    changeBtnOrder() {
      const [top, medium, bottom] = Object.values(this.btnOrder)
      if (top == 1 && medium == 3 && bottom == 2) {
        this.btnOrder = {
          orderTop: 1,
          orderMedium: 2,
          orderBottom: 3
        }
      } else if (top == 1 && medium == 2 && bottom == 3) {
        this.btnOrder = {
          orderTop: 2,
          orderMedium: 1,
          orderBottom: 3
        }
      } else {
        this.btnOrder = {
          orderTop: 1,
          orderMedium: 3,
          orderBottom: 2
        }
      }
    }
  },
  persist: true
})