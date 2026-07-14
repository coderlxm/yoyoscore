import { defineStore } from "pinia";
import { useSettingStore } from "@/stores/setting";
import { group, sort } from 'radash'
import type { GameRecord, GroupedRecords } from '@/types/domain'

interface RecordState {
  activeNames: string[]
  recordedGames: GameRecord[]
  game: string
  name: string
  tips: string
}

export const useRecordStore = defineStore('record', {
  state: (): RecordState => ({
    activeNames: ['score', 'name', 'game'],
    recordedGames: [],
    game: '',
    name: '',
    tips: ''
  }),
  getters: {
    gamesList: (state): string[] => [...new Set(state.recordedGames.map(item => item.game))].filter((item) => item !== ''),
    recordGroupedAndRanked: (state): GroupedRecords => {
      const value = group(state.recordedGames, (item) => item.game) as GroupedRecords
      Object.keys(value).forEach((game) => {
        value[game] = sort(value[game], (g) => g.sumScore, useSettingStore().settingForm.sort === '1')
      })
      return value
    }
  },
  persist: true
})
