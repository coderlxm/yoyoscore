export function detectPlatform({
  userAgent = '',
  platform = '',
  maxTouchPoints = 0,
  coarsePointer = false,
  finePointer = false
} = {}) {
  const isIPad = platform === 'MacIntel' && maxTouchPoints > 1
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || isIPad
  const isMobileUserAgent = /Android|Mobile|Tablet|iPad|iPhone|iPod/i.test(userAgent)
  const isTouchOnly = coarsePointer && !finePointer

  return {
    deviceType: isTouchOnly || isMobileUserAgent ? 'mobile' : 'desktop',
    systemOSType: isIOS ? 'ios' : ''
  }
}

export function getPlatformCapabilities() {
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const finePointer = window.matchMedia?.('(any-pointer: fine)').matches ?? false

  return detectPlatform({
    userAgent: navigator.userAgent,
    platform: navigator.userAgentData?.platform ?? navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
    coarsePointer,
    finePointer
  })
}
