import { defineStore } from "pinia";
import { useSettingStore } from "./setting";
import type { ScoreDisplayProps, GameRecord } from '@/types/domain'

interface ResultState {
  activeNames: string[]
}

export const useResultStore = defineStore('result', {
  state: (): ResultState => ({
    activeNames: []
  }),
  actions: {
    dealScoreDisplay(props: ScoreDisplayProps, item: GameRecord): string {
      if (useSettingStore().settingForm.sort === '1') {
        if (props.scoreMode === 1) {
          return item.sumScore ? ((item.sumScore / props.results[0].sumScore) * 100).toFixed(2) : new Number(0).toFixed(2)
        } else if (props.scoreMode === 0) {
          return item.sumScore ? `${item.pointadd}-${item.pointmin}=${item.sumScore}` : new Number(0).toFixed(2)
        } else {
          return item.sumScore ? `${((item.sumScore / props.results[0].sumScore) * 100).toFixed(2)}(${item.pointadd}-${item.pointmin}=${item.sumScore})` : new Number(0).toFixed(2)
        }
      } else {
        if (props.scoreMode === 1) {
          return item.sumScore ? ((item.sumScore / props.results[props.results.length - 1].sumScore) * 100).toFixed(2) : new Number(0).toFixed(2)
        } else if (props.scoreMode === 0) {
          return item.sumScore ? `${item.pointadd}-${item.pointmin}=${item.sumScore}` : new Number(0).toFixed(2)
        } else {
          return item.sumScore ? `${((item.sumScore / props.results[props.results.length - 1].sumScore) * 100).toFixed(2)}(${item.pointadd}-${item.pointmin}=${item.sumScore})` : new Number(0).toFixed(2)
        }
      }
    }
  },
  persist: true
})
