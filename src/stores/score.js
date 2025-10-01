// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSettingStore } from './setting'
import keyDownAudio from '@/assets/sounds/typing.mp3'
import { storeToRefs } from 'pinia'

let audioContext = null
let audioBuffer = null
let preloadPromise = null
const isClient = typeof window !== 'undefined'
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
    async ensureAudioContext() {
      if (!isClient) return null
      if (audioContext) return audioContext
      const ContextCtor = window.AudioContext || window.webkitAudioContext
      if (!ContextCtor) return null
      audioContext = new ContextCtor()
      return audioContext
    },
    async preloadAudio() {
      if (!isClient) return
      if (audioBuffer) return
      if (preloadPromise) {
        await preloadPromise
        return
      }
      const context = await this.ensureAudioContext()
      if (!context) return
      preloadPromise = fetch(keyDownAudio)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => new Promise((resolve, reject) => {
          context.decodeAudioData(arrayBuffer, resolve, reject)
        }))
        .then((decodedBuffer) => {
          audioBuffer = decodedBuffer
        })
        .catch((error) => {
          console.error('[score] Failed to preload audio', error)
        })
        .finally(() => {
          preloadPromise = null
        })
      await preloadPromise
    },
    async playAudio() {
      const context = await this.ensureAudioContext()
      if (!context) return
      if (!audioBuffer) await this.preloadAudio()
      if (!audioBuffer) return
      if (context.state === 'suspended') {
        try {
          await context.resume()
        } catch (error) {
          console.error('[score] Failed to resume audio context', error)
          return
        }
      }
      const source = context.createBufferSource()
      source.buffer = audioBuffer
      source.connect(context.destination)
      source.start(0)
    },
    async sum(sumMode) {
      const { settingForm } = storeToRefs(useSettingStore())
      // console.log(this.keyDownAudio.play());
      if (settingForm.value.audio === '1') {
        try {
          await this.playAudio()
        } catch (error) {
          console.error('[score] Failed to play audio', error)
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
