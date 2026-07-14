import { defineStore } from "pinia";
import { getPlatformCapabilities } from '@/utils/platform'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settingForm: {
      audio: '1',
      trigger: 1,
      vibrate: '1',
      vibMethod: '2',
      sort: '1',
      keyboard: true
    },
    primaryColor: '#f01654',
    darkTheme: 'light',
    btnOrder: {
      orderTop: 1,
      orderMedium: 3,
      orderBottom: 2
    },
    deviceType: '',
    systemOSType: '',
    isFullScreen: !!document.fullscreenElement,
    deferredPrompt: null
  }),
  actions: {
    updateFullScreenStatus() {
      this.isFullScreen = !!document.fullscreenElement;
    },
    setupFullScreenListener() {
      // 设置监听器，当全屏状态改变时更新状态
      document.addEventListener('fullscreenchange', this.updateFullScreenStatus);
    },
    removeFullScreenListener() {
      // 移除监听器
      document.removeEventListener('fullscreenchange', this.updateFullScreenStatus);
    },
    async promptInstall() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        this.deferredPrompt = null;
      }
    },
    platformPre() {
      const { deviceType, systemOSType } = getPlatformCapabilities()
      this.deviceType = deviceType
      this.systemOSType = systemOSType
      this.settingForm.keyboard = deviceType === 'desktop'
    },
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
