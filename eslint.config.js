import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default defineConfig([
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  tseslint.config({
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  }),
  {
    files: ['src/**/*.{ts,vue}'],
    ignores: ['src/service-worker.ts'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'no-undef': 'off'
    }
  },
  {
    files: ['src/service-worker.ts'],
    languageOptions: {
      globals: globals.serviceworker
    },
    rules: {
      'no-undef': 'off'
    }
  },
  {
    files: ['*.config.js'],
    languageOptions: {
      globals: globals.node
    }
  }
])
