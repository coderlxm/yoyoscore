/// <reference lib="WebWorker" />

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

// 使用 Workbox 注入的预缓存清单。
precacheAndRoute(self.__WB_MANIFEST)

// 确保所有客户端立即受控。
clientsClaim()

// 使用 NetworkFirst 策略确保 index.html 文件总是最新。
registerRoute(
  ({ request }) => request.mode === 'navigate' || request.destination === 'document',
  new NetworkFirst({
    cacheName: 'html-cache',
    networkTimeoutSeconds: 0,
    plugins: []
  })
)

// 使用 CacheFirst 策略缓存其他静态资源。
registerRoute(
  ({ request }) =>
    request.destination === 'script'
    || request.destination === 'style'
    || request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-cache',
    plugins: []
  })
)
