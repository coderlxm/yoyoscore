# Repository Guidelines

## Project Structure & Module Organization

YoYoScore is a Vue 3 single-page PWA built with Vite. Application code lives in `src/`: route-level screens are in `src/views/`, reusable UI in `src/components/`, Pinia stores in `src/stores/`, and routing in `src/router/`. Shared helpers belong in `src/utils/`; global styles and bundled media belong in `src/assets/`. Files in `public/` are copied as-is to the build. The custom Workbox entry is `src/service-worker.js`, and production output is generated in `dist/`.

## Build, Test, and Development Commands

Use Node.js 24 and the pnpm version pinned in `package.json`.

- `pnpm install --frozen-lockfile` installs the exact locked dependencies.
- `pnpm dev` starts the Vite development server with hot reload.
- `pnpm build` creates the production PWA bundle in `dist/`.
- `pnpm preview` serves the built bundle for final local checks.
- `pnpm lint` checks Vue, JavaScript, and TypeScript files; `pnpm lint:fix` applies fixes.
- `pnpm typecheck` runs `vue-tsc` against the app `tsconfig.app.json` (strict mode).
- `pnpm test:run` runs the Vitest suite once.

## Coding Style & Naming Conventions

New source code is written in TypeScript. Vue 3 components use the Composition API with `<script setup lang="ts">`. Use two-space indentation, ES modules, and the `@/` alias for imports from `src/`. Keep route views focused on composition, shared state in Pinia stores, and pure reusable logic in `src/utils/`. Follow existing naming where practical: store and utility modules use camelCase (for example, `exportToXlsx.ts`); new Vue component filenames should use PascalCase. Prefer scoped component styles and reserve `src/assets/main.css` for global rules.

Domain types are centralised in `src/types/domain.ts` and browser/PWA type augmentation lives in `src/types/pwa.d.ts`. Reuse these definitions instead of introducing inline `any`; when boundary types from third-party libraries are imprecise, narrow with `unknown` and an explicit cast at the adaptation layer only. Do not prefer `as any`; targeted single-line assertions are acceptable only with a short comment explaining the third-party limitation and removal condition.

Run `pnpm lint` and `pnpm typecheck` before submitting changes; ESLint uses flat config with recommended JavaScript, essential Vue, and `typescript-eslint` rules. The service worker is checked separately with `tsconfig.worker.json` so its Web Worker globals do not leak into the browser app; do not add new JavaScript under `src/`.

## Testing Guidelines

Vitest and Vue Test Utils provide automated coverage. Colocate tests as `*.spec.ts` beside the module under test. Every change must pass `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, and `pnpm build`. Manually verify affected scoring, persistence, routing, Excel export, and offline/PWA behavior as relevant, using both narrow mobile and desktop layouts.

## Commit & Pull Request Guidelines

Use Conventional Commits in the form `<type>(optional-scope): <description>`, for example `feat(score): add match reset` or `fix(export): preserve sheet names`. Common types include `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, and `chore`. Husky runs commitlint on every commit message, so keep the subject concise and lowercase where practical. Keep commits focused. Pull requests should explain the user-visible change, list verification commands, link related issues, and include screenshots or recordings for UI changes. Call out PWA, storage, or deployment impacts explicitly.
