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
      if (sumMode === 'add') {
        if (settingForm.value.audio === '1') keydownAudio.play()
        this.pointadd += 1
      } else {
        if (settingForm.value.audio === '1') keydownAudio.play()
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
