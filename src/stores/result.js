import { defineStore } from "pinia";
import { useSettingStore } from "./setting";
export const useResultStore = defineStore('result', {
  state: () => ({
    activeNames: []
  }),
  actions: {
    dealScoreDisplay(props, item) {
      // console.log(useSettingStore().settingForm);
      if (useSettingStore().settingForm.sort === '1') {
        if (props.scoreMode === 1) {
          return item.sumScore ? ((item.sumScore / props.results[0].sumScore) * 100).toFixed(2) : new Number(0).toFixed(2)
        } else if (props.scoreMode === 0) {
          return item.sumScore ? `${item.pointadd}-${item.pointmin}=${item.sumScore}` : new Number(0).toFixed(2)
        } else {
          return item.sumScore ? `${((item.sumScore / props.results[0].sumScore) * 100).toFixed(2)}(${item.pointadd}-${item.pointmin}=${item.sumScore})` : new Number(0).toFixed(2)
        }
      } else if (useSettingStore().settingForm.sort === '0') {
        if (props.scoreMode === 1) {
          return item.sumScore ? ((item.sumScore / props.results[props.results.length - 1].sumScore) * 100).toFixed(2) : new Number(0).toFixed(2)
        } else if (props.scoreMode === 0) {
          return item.sumScore ? `${item.pointadd}-${item.pointmin}=${item.sumScore}` : new Number(0).toFixed(2)
        } else {
          return item.sumScore ? `${((item.sumScore / props.results[props.results.length - 1].sumScore) * 100).toFixed(2)}(${item.pointadd}-${item.pointmin}=${item.sumScore})` : new Number(0).toFixed(2)
        }
      }
      // if (props.scoreMode === 1) {
      //   return item.sumScore ? ((item.sumScore / props.results[0].sumScore) * 100).toFixed(2) : new Number(0).toFixed(2)
      // } else {
      //   return item.sumScore ? `${item.pointadd}-${item.pointmin}=${item.sumScore}` : new Number(0).toFixed(2)
      // }
    }
  },
  persist: true
})