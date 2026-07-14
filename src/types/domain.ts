export type SortDirection = '0' | '1'

export type ScoreMode = 0 | 1
export type Theme = 'light' | 'dark'

export type AudioSetting = '1' | '2'
export type VibrateSetting = '1' | '2'
export type VibMethodSetting = '1' | '2'

export interface SettingForm {
  audio: AudioSetting
  trigger: 0 | 1
  vibrate: VibrateSetting
  vibMethod: VibMethodSetting
  sort: SortDirection
  keyboard: boolean
}

export interface BtnOrder {
  orderTop: number
  orderMedium: number
  orderBottom: number
}

export interface ScoreContent {
  name: string
  score: number
  rank: number
}

export interface GameRecord {
  game: string
  name: string
  pointadd: number
  pointmin: number
  sumScore: number
  tips: string
}

export type GroupedRecords = Record<string, GameRecord[]>

export interface ScoreDisplayProps {
  scoreMode: ScoreMode | 'full'
  results: GameRecord[]
  isEditMode?: boolean
}

export type ScoreFormatter = (props: ScoreDisplayProps, item: GameRecord) => string

export interface LongPressOptions {
  onLongPress?: (event: Event) => void
  onShortPress?: (event: Event) => void
  enabled: boolean
  duration?: number
}

export interface PlatformCapabilities {
  deviceType: 'mobile' | 'desktop'
  systemOSType: 'ios' | ''
}
