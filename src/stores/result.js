import { defineStore } from "pinia";

export const useResultStore = defineStore('result', {
  state: () => ({
    activeNames: [],
  }),
  actions: {
    dealScoreDisplay(props, item) {
      if (props.scoreMode === 1) {
        return item.sumScore ? ((item.sumScore / props.results[0].sumScore) * 100).toFixed(2) : new Number(0).toFixed(2)
      } else {
        return item.sumScore ? `${item.pointadd}-${item.pointmin}=${item.sumScore}` : new Number(0).toFixed(2)
      }
    }
  },
  persist: true
})