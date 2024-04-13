import { defineStore } from "pinia";
export const useRecordStore = defineStore('record', {
  state: () => ({
    activeNames: ['1', '2', '3'],
    recordedGames: [],
    game: '',
    name: ''
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
          return scoreB - scoreA;
        });
      });
      return value
    }
  },
  persist: true
})