import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { VitePWA } from 'vite-plugin-pwa';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'], // 静态资源列表
      manifest: {
        name: 'YoYoScore',
        short_name: 'YoYoScore',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4DBA87',
        icons: [
          {
            src: 'YoYoScore.webp', // 相对于 public 目录
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'YoYoScore.webp', // 相对于 public 目录
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
