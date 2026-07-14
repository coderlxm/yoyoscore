import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useRecordStore } from './record'
import { useSettingStore } from './setting'
import type { GameRecord } from '@/types/domain'

const records: GameRecord[] = [
  { game: 'Final', name: 'A', sumScore: 5, pointadd: 5, pointmin: 0, tips: '' },
  { game: 'Final', name: 'B', sumScore: 10, pointadd: 10, pointmin: 0, tips: '' },
  { game: 'Qualifier', name: 'C', sumScore: 3, pointadd: 3, pointmin: 0, tips: '' }
]

describe('record store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('groups games and sorts scores in both configured directions', () => {
    const settings = useSettingStore()
    const record = useRecordStore()
    record.recordedGames = records

    settings.settingForm.sort = '1'
    expect(record.recordGroupedAndRanked.Final.map(({ name }) => name)).toEqual(['B', 'A'])

    settings.settingForm.sort = '0'
    expect(record.recordGroupedAndRanked.Final.map(({ name }) => name)).toEqual(['A', 'B'])
    expect(record.gamesList).toEqual(['Final', 'Qualifier'])
  })
})