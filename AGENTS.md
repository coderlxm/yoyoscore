# Repository Guidelines

## Project Structure & Module Organization

YoYoScore is a Vue 3 single-page PWA built with Vite. Application code lives in `src/`: route-level screens are in `src/views/`, reusable UI in `src/components/`, Pinia stores in `src/stores/`, and routing in `src/router/`. Shared helpers belong in `src/utils/`; global styles and bundled media belong in `src/assets/`. Files in `public/` are copied as-is to the build. The custom Workbox entry is `src/service-worker.js`, and production output is generated in `dist/`.

## Build, Test, and Development Commands

Use Node.js 24 and the pnpm version pinned in `package.json`.

- `pnpm install --frozen-lockfile` installs the exact locked dependencies.
- `pnpm dev` starts the Vite development server with hot reload.
- `pnpm build` creates the production PWA bundle in `dist/`.
- `pnpm preview` serves the built bundle for final local checks.
- `pnpm lint` checks Vue and JavaScript files; `pnpm lint:fix` applies fixes.
- `pnpm test:run` runs the Vitest suite once.

## Coding Style & Naming Conventions

Write Vue 3 components with the Composition API and `<script setup>`. Use two-space indentation, ES modules, and the `@/` alias for imports from `src/`. Keep route views focused on composition, shared state in Pinia stores, and pure reusable logic in `src/utils/`. Follow existing naming where practical: store and utility modules use camelCase (for example, `exportToXlsx.js`); new Vue component filenames should use PascalCase. Prefer scoped component styles and reserve `src/assets/main.css` for global rules. Run `pnpm lint` before submitting changes; ESLint uses flat config with recommended JavaScript and essential Vue rules.

## Testing Guidelines

Vitest and Vue Test Utils provide automated coverage. Colocate tests as `*.spec.js` beside the module under test. Every change must pass `pnpm lint`, `pnpm test:run`, and `pnpm build`. Manually verify affected scoring, persistence, routing, Excel export, and offline/PWA behavior as relevant, using both narrow mobile and desktop layouts.

## Commit & Pull Request Guidelines

Use Conventional Commits in the form `<type>(optional-scope): <description>`, for example `feat(score): add match reset` or `fix(export): preserve sheet names`. Common types include `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, and `chore`. Husky runs commitlint on every commit message, so keep the subject concise and lowercase where practical. Keep commits focused. Pull requests should explain the user-visible change, list verification commands, link related issues, and include screenshots or recordings for UI changes. Call out PWA, storage, or deployment impacts explicitly.
