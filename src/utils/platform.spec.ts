import { describe, expect, it } from 'vitest'

import { detectPlatform } from './platform'

describe('platform capability detection', () => {
  it('recognizes an iPad using a desktop-style user agent', () => {
    expect(detectPlatform({
      platform: 'MacIntel',
      maxTouchPoints: 5,
      coarsePointer: true
    })).toEqual({
      deviceType: 'mobile',
      systemOSType: 'ios'
    })
  })

  it('keeps keyboard support for hybrid devices with a fine pointer', () => {
    expect(detectPlatform({
      platform: 'Win32',
      coarsePointer: true,
      finePointer: true
    }).deviceType).toBe('desktop')
  })
})