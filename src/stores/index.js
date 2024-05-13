import { useRecordStore } from "./record";
import { useSettingStore } from "./setting";
import { useResultStore } from "./result";
import { useScoreStore } from "./score";

export const recordStore = useRecordStore()
export const settingStore = useSettingStore()
export const resultStore = useResultStore()
export const scoreStore = useScoreStore()