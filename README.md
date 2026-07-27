# PikoFind

**Listen, look and find!** — an offline, Android-first listening-and-finding game for children aged 4–7.

Piko the parrot gives a spoken instruction ("Find the yellow star") and the child taps the right object in a colourful scene. Audio-first, no reading required, no accounts, no ads, no data collection — everything stays on the device.

## Status
🚧 **Phase 0 — Documentation & repository setup.** The planning docs are written; the Expo app has not been scaffolded yet. See [`docs/TASKS.md`](docs/TASKS.md).

## Documentation
- [`docs/PIKOFIND_MASTER_PLAN.md`](docs/PIKOFIND_MASTER_PLAN.md) — canonical product, design & implementation plan
- [`docs/TASKS.md`](docs/TASKS.md) — phase-by-phase task tracker
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — colours, typography, spacing, components
- [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) — worlds, levels, data model, content checklist
- [`docs/PERFORMANCE_BUDGET.md`](docs/PERFORMANCE_BUDGET.md) — low-end Android targets
- [`docs/PRIVACY.md`](docs/PRIVACY.md) — privacy & child-safety design
- [`docs/PLAY_STORE_CHECKLIST.md`](docs/PLAY_STORE_CHECKLIST.md) — launch requirements
- [`CLAUDE.md`](CLAUDE.md) — short always-on brief + hard constraints

## Tech stack
React Native · Expo SDK 57 (development build) · TypeScript (strict) · Expo Router · expo-audio · expo-image · expo-sqlite · react-native-svg · react-native-reanimated · Zustand · Zod.

## Getting started
> Commands become available once the Expo project is initialized (Phase 0, step 2).
```bash
npm install
npm run start      # Expo dev server
npm run android    # run on a connected Android device
```

## Principles
Offline · private · audio-first · one clear action per screen · positive feedback · fast ~5-challenge sessions · smooth on a 2 GB Android phone.
