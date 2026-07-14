export {}

declare global {
  interface NavigatorUAData {
    readonly platform: string
    readonly mobile: boolean
    readonly brands: ReadonlyArray<{ brand: string; version: string }>
  }

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  }

  interface Navigator {
    readonly userAgentData?: NavigatorUAData
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}
