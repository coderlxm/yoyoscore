import { defineStore } from "pinia";

export const useResultStore = defineStore('result', {
  state: () => ({
    activeNames: [],
  }),
  persist: true
})