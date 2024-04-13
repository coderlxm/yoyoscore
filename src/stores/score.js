// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSettingStore } from "./setting";
import keyDownAudio from '@/assets/sounds/typing.mp3'
import { storeToRefs } from 'pinia';
export const useScoreStore = defineStore('score', {
  state: () => ({
    pointadd: 0,
    pointmin: 0,
    cont: { name: '', score: 0, rank: 0 },
    contInfo: []
  }),
  getters: {
    computedScore: (state) => state.pointadd - state.pointmin
  },
  actions: {
    sum(sumMode) {
      const keydownAudio = new Audio(keyDownAudio)
      const { settingForm } = storeToRefs(useSettingStore())
      if (settingForm.value.audio === '1') keydownAudio.play()
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
