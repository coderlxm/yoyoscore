import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useScoreStore } from './score'
import { useSettingStore } from './setting'

describe('score store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      value: vi.fn()
    })
  })

  it('adds, subtracts, and resets the score', async () => {
    const settings = useSettingStore()
    const score = useScoreStore()
    settings.settingForm.audio = '2'
    settings.settingForm.vibrate = '2'

    await score.sum('add')
    await score.sum()

    expect(score.pointadd).toBe(1)
    expect(score.pointmin).toBe(1)
    expect(score.computedScore).toBe(0)

    score.pressToZero()
    expect(score.pointadd).toBe(0)
    expect(score.pointmin).toBe(0)
  })
})
