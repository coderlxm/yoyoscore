import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { useSettingStore } from './setting'

const values = new Map()
const storage = {
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  removeItem: (key) => values.delete(key),
  setItem: (key, value) => values.set(key, String(value))
}

describe('persisted Pinia state', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: storage
    })
    localStorage.clear()
  })

  it('hydrates existing setting data without changing the store id', () => {
    localStorage.setItem('setting', JSON.stringify({
      darkTheme: 'dark',
      settingForm: {
        audio: '2',
        trigger: 0,
        vibrate: '2',
        vibMethod: '2',
        sort: '0',
        keyboard: false
      }
    }))

    const pinia = createPinia().use(piniaPluginPersistedstate)
    createApp({}).use(pinia)
    const settings = useSettingStore(pinia)

    expect(settings.$id).toBe('setting')
    expect(settings.darkTheme).toBe('dark')
    expect(settings.settingForm.sort).toBe('0')
  })
})
