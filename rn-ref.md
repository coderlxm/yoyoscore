# React Native Migration Outline

## 1. Foundation & Tooling
- Audit current Vue/PWA functionality, PWA-specific behaviors, and platform APIs (vibration, audio, offline). Document feature parity requirements and platform gaps.
- Choose React Native stack: Expo (managed workflow) or bare React Native. For YoYoScore, Expo offers easier asset handling, audio, and OTA updates; note constraints (native module support) before committing.
- Establish project skeleton (`npx create-expo-app` or `npx react-native init`) and set up TypeScript, ESLint + Prettier, absolute import aliases, and state management (Redux Toolkit, Zustand, or Recoil). Mirror linting conventions where practical (two-space indents, semi rules).

## 2. Core Architecture Mapping
- Map Vue router views (`src/views/*.vue`) to React Navigation screens. Define primary navigation stack/tab configuration, preserving Home, Result, Record, Setting flows.
- Replace Pinia store patterns with selected state library. Define slices/modules for scoring, settings, and persistent storage; plan hydration using `AsyncStorage` or Expo SecureStore.
- Translate shared components (`src/components/`) into React Native function components. Identify reusable UI primitives and decide whether to lean on Expo Router, NativeBase, or custom UI kit.

## 3. Feature Parity Implementation
- Scoring logic: Port `src/stores/score.js` actions (increment, decrement, reset, vibration/audio triggers) into hooks or store actions. Use Expo AV for audio playback and `Vibration` API for haptics; confirm responsiveness without preload lag.
- Settings and persistence: Recreate forms with React Hook Form or controlled components. Ensure persisted options (audio, vibration, color theme, button order) sync with state layer and storage.
- Timer/clock: Implement `useEffect` + `setInterval` hooks for stopwatch behavior; handle lifecycle via `useFocusEffect` to pause timers on navigation.
- Offline/record export: Assess replacements for current PWA offline flows. For record export, evaluate RN share sheet, CSV generation, or deep-link to email/cloud. If offline-first is required, integrate `expo-sqlite` or `realm`.

## 4. Platform Services & Assets
- Audio: Preload assets using Expo Asset or `Audio.Sound.createAsync`. Verify iOS/Android permissions and silent mode behavior.
- Icons: Replace Iconify with `@expo/vector-icons` or `react-native-svg`. Map existing icon usages to supported packs.
- Styling: Choose styling approach—StyleSheet, Tailwind-in-RN (NativeWind), or UI library. Recreate theme colors (`primaryColor`) and responsive spacing.
- PWA-specific functionality (service worker, manifest) has no direct RN equivalent; instead plan for OTA updates (Expo Updates) and analytics integration.

## 5. Platform Testing & QA
- Define device/test matrix (iOS/Android phones, tablets). Establish manual QA checklist covering scoring flow, settings persistence, offline behavior, audio/vibration.
- Configure automated checks: TypeScript, ESLint, unit tests with Jest + React Native Testing Library; optional E2E with Detox/Appium.
- Plan beta distribution via Expo Go/TestFlight/Play Internal Testing. Document release process and versioning alignment.

## 6. Transition Strategy
- Run RN project in parallel with existing PWA until feature parity is achieved. Sync data requirements or provide migration path for exported records.
- Prioritize incremental milestones: (1) Core scoring screen, (2) Settings + persistence, (3) Record/result flows, (4) Offline/export capabilities, (5) Polish & deployment.
- Communicate cutover plan, including user messaging about platform changes and support timelines for the legacy PWA.
