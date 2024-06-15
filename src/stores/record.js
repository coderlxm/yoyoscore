import { defineStore } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { group, sort } from 'radash'
export const useRecordStore = defineStore('record', {
  state: () => ({
    activeNames: ['score', 'name', 'game'],
    recordedGames: [],
    game: '',
    name: '',
    tips: ''
  }),
  getters: {
    gamesList: (state) => [...new Set(state.recordedGames.map(item => item.game))].filter((item) => item !== ''),
    recordGroupedAndRanked: (state) => {
      const value = group(state.recordedGames, (item) => item.game)
      Object.keys(value).forEach((game) => {
        value[game] = sort(value[game], (g) => g.sumScore, useSettingStore().settingForm.sort === '1')
      })
      return value
    }
  },
  persist: true
})