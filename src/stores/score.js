// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSettingStore } from "./setting";
import keyDownAudio from '@/assets/sounds/typing.mp3'
import { storeToRefs } from 'pinia';
export const useScoreStore = defineStore('score', {
  state: () => ({
    pointadd: 0,
    pointmin: 0,
    keyDownAudio: null,
    cont: { name: '', score: 0, rank: 0 },
    contInfo: []
  }),
  getters: {
    computedScore: (state) => state.pointadd - state.pointmin
  },
  actions: {
    preloadAudio() {
      // 在 Store 初始化时预加载音效
      this.keyDownAudio = new Audio(keyDownAudio);
      this.keyDownAudio.load(); // 预加载音效数据
    },
    async sum(sumMode) {
      const { settingForm } = storeToRefs(useSettingStore())
      // console.log(this.keyDownAudio.play());
      if (this.keyDownAudio && settingForm.value.audio === '1') {
        try {
          this.keyDownAudio.currentTime = 0
          await this.keyDownAudio.play()
        } catch (error) {
          console.error(error)
        }
      }
      if (settingForm.value.vibrate === '1' && settingForm.value.vibMethod === '1') {
        navigator.vibrate(200)
      } else if (settingForm.value.vibrate === '1' && settingForm.value.vibMethod === '2') {
        navigator.vibrate(25)
      }
      if (sumMode === 'add') {
        this.pointadd += 1
      } else {
        this.pointmin += 1
      }
    },
    pressToZero() {
      this.pointadd = 0
      this.pointmin = 0
    }
  },
  // getters: {
  //   sum: () => {
  //     return this.pointadd - this.pointmin
  //   }
  // },
  persist: true
})
