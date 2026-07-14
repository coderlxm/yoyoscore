import type { Directive } from 'vue'
import type { LongPressOptions } from '@/types/domain'

interface LongPressElement extends HTMLElement {
  _longPressHandlers?: {
    start: (e: Event) => void
    cancel: (e: Event) => void
    clearTimer: () => void
  }
}

const method: Directive<LongPressElement, LongPressOptions> = {
  mounted(el, binding) {
    let pressTimer: ReturnType<typeof setTimeout> | null = null

    const clearTimer = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    const start = (e: Event) => {
      if (e.type === 'click' && (e as MouseEvent).button !== 0) {
        return
      }

      if (binding.value.enabled) {
        if (pressTimer === null) {
          pressTimer = setTimeout(() => {
            handler(e)
          }, binding.value.duration || 1000)
        }
      }
    }

    const cancel = (e: Event) => {
      clearTimer()

      if (!binding.value.enabled && binding.value.onShortPress) {
        e.stopPropagation()
        e.preventDefault()
        binding.value.onShortPress(e)
      }
    }

    const handler = (e: Event) => {
      if (binding.value.onLongPress) {
        binding.value.onLongPress(e)
      }
    }

    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('mouseup', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)

    el._longPressHandlers = { start, cancel, clearTimer }
  },

  unmounted(el) {
    if (el._longPressHandlers) {
      el._longPressHandlers.clearTimer()
      el.removeEventListener('mousedown', el._longPressHandlers.start)
      el.removeEventListener('touchstart', el._longPressHandlers.start)
      el.removeEventListener('mouseup', el._longPressHandlers.cancel)
      el.removeEventListener('touchend', el._longPressHandlers.cancel)
      el.removeEventListener('touchcancel', el._longPressHandlers.cancel)
    }
  }
}

export default method
