import { defineStore } from "pinia";
import { useSettingStore } from "./setting";
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
      let value = state.recordedGames.reduce((groups, record) => {
        if (!groups[record.game]) {
          groups[record.game] = [];
        }
        groups[record.game].push(record);
        return groups;
      }, {});
      Object.keys(value).forEach(game => {
        value[game].sort((a, b) => {
          // 确保每个对象都有 sumScore 字段，如果没有，则尝试使用 score 字段
          const scoreA = 'sumScore' in a ? a.sumScore : a.score;
          const scoreB = 'sumScore' in b ? b.sumScore : b.score;
          if (useSettingStore().settingForm.sort === '1') {
            return scoreB - scoreA
          } else if (useSettingStore().settingForm.sort === '0') {
            return scoreA - scoreB
          }
        });
      });
      return value
    }
  },
  persist: true
})