// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', {
  state: () => ({
    pointadd: 0,
    pointmin: 0,
    cont: { name: '', score: 0, rank: 0 },
    contInfo: []
  }),
  actions: {
    sum(sumMode) {
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
