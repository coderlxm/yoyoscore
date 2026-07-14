import { beforeEach, describe, expect, it } from 'vitest'

import router from './index'

describe('router access guard', () => {
  beforeEach(async () => {
    sessionStorage.clear()
    await router.replace({ name: 'start' })
  })

  it('redirects new users to the start page', async () => {
    await router.push({ name: 'home' })
    expect(router.currentRoute.value.name).toBe('start')
  })

  it('allows registered users to enter the app', async () => {
    sessionStorage.setItem('isRegUser', 'true')
    await router.push({ name: 'home' })
    expect(router.currentRoute.value.name).toBe('home')
  })
})