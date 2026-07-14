import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [VantResolver()]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      srcDir: 'src',
      filename: 'service-worker.ts',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      manifest: {
        name: 'YoYoScore',
        short_name: 'YoYoScore',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f01654',
        icons: [
          {
            src: 'YoYoScoreNew.webp', // 相对于 public 目录
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'YoYoScoreNew.webp', // 相对于 public 目录
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      }
    })
  ],
  build: {
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
