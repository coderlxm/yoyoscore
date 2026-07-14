import { defineStore } from 'pinia'
import { useSettingStore } from "./setting";
import { storeToRefs } from 'pinia';
import keyDownAudio from '@/assets/sounds/typing.mp3'
import type { ScoreContent } from '@/types/domain'

interface ScoreState {
  pointadd: number
  pointmin: number
  keyDownAudio: HTMLAudioElement | null
  cont: ScoreContent
  contInfo: ScoreContent[]
}

export const useScoreStore = defineStore('score', {
  state: (): ScoreState => ({
    pointadd: 0,
    pointmin: 0,
    keyDownAudio: null,
    cont: { name: '', score: 0, rank: 0 },
    contInfo: []
  }),
  getters: {
    computedScore: (state): number => state.pointadd - state.pointmin
  },
  actions: {
    preloadAudio() {
      this.keyDownAudio = new Audio(keyDownAudio);
      this.keyDownAudio.preload = 'auto';
      this.keyDownAudio.load();
    },
    async sum(sumMode?: 'add') {
      const { settingForm } = storeToRefs(useSettingStore())
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
  persist: true
})
