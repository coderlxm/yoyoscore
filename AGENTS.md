# Repository Guidelines

## Project Structure & Module Organization
YoYoScore is a Vue 3 + Vite PWA. Core logic lives in `src/`: route screens in `src/views/*.vue`, shareable widgets in `src/components/`, Pinia stores in `src/stores/`, helpers in `src/utils/`, and long-lived assets in `src/assets/`. Files under `public/` bypass bundling for icons and manifest tweaks. Service-worker behavior is split between `src/service-worker.js` and the PWA block inside `vite.config.js`.

## Build, Test, and Development Commands
Install deps with `pnpm install`. `pnpm dev` launches Vite with HMR; `pnpm build` emits the production bundle and updates the PWA manifest; `pnpm preview` serves that bundle to mimic deployment. Run `pnpm lint` before every commit; it uses ESLint’s Vue config and autofixes the common nits.

## Coding Style & Naming Conventions
Respect the repository ESLint rules: two-space indentation, script-setup syntax, no trailing semicolons. Vue files stay PascalCase for views (`HomeView.vue`) and lower camelCase for smaller components (`headerBar.vue`). Pinia stores expose camelCase composables like `useSettingStore`, and imports should favor the `@/` alias.

## Testing Guidelines
There is no dedicated test runner yet, so document manual verification in your PR description. At minimum confirm scoring flows, record export, and PWA install/offline behavior via `pnpm preview`. If you add logic that warrants coverage, co-locate Vitest specs beside the module (e.g., `result.spec.js`) and wire them into a new `pnpm test` script.

## Commit & Pull Request Guidelines
Commits follow the existing short, present-tense style (`routes update`, `use radash to replace native method`). Group related work and avoid formatting-only commits unless they unblock linting. PRs should explain the user impact, include reproduction and verification steps, link tickets when relevant, and attach screenshots or clips for UI changes. Flag cache or service-worker edits so reviewers can double-check the release plan.

## PWA & Service Worker Tips
When assets change, refresh the precache configuration in `vite.config.js` and update `src/service-worker.js` to purge stale entries. Test via Chrome DevTools’ offline mode and keep Excel export schemas aligned with any store changes.
