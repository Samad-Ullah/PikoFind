# CLAUDE.md — PikoFind

> Read this file, `docs/PIKOFIND_MASTER_PLAN.md`, and `docs/TASKS.md` **before modifying anything**.
> `docs/PIKOFIND_MASTER_PLAN.md` is the canonical source of truth. This file is the short, always-loaded summary.

## What PikoFind is
An **Android-first, offline, no-account** listening-and-finding game for **children aged 4–7**. A friendly parrot mascot (**Piko**) gives a spoken instruction; the child taps the correct object in a colourful landscape scene. Audio-first — a four-year-old must be able to play **without reading**.

## Hard constraints (never violate)
- **No backend, no cloud, no external API, no generative-AI API.** Everything runs and stays on-device.
- **No camera, no microphone, no location, no contacts** — do not add these permissions.
- **No analytics, no ads, no social/marketing SDK, no accounts, no user-generated content.**
- **No personal data about a child, ever** (no name, DOB, email, photo, voice recording, ad ID). SQLite holds only small structured progress/settings/entitlement data.
- **Landscape orientation only.** Baseline `1280 × 720`, 16:9. Object positions are normalized `0..1`, never fixed pixels.
- **Low-end Android (2 GB RAM, 720p) is a primary constraint** — respect the budgets in `docs/PERFORMANCE_BUDGET.md`.
- **Kind, never-shaming tone.** Wrong answers never say "Wrong", never deduct stars, never use a red cross/harsh sound. Piko says "Good try. Look again!"
- **Do not generate visual/image assets** — Claude Design owns those. Use clearly-labelled placeholders only where finals are unavailable.

## Stack (locked once initialized)
React Native + **Expo (SDK 57, development build — not permanent Expo Go)** + TypeScript (strict) + Expo Router. `expo-audio` (NOT `expo-av`), `expo-image`, `expo-sqlite`, `react-native-svg`, `react-native-reanimated` (simple transforms only), **Zustand** (runtime state only), **Zod** (validate bundled content in dev). Testing: Jest + RN Testing Library + Maestro. Google Play Billing (one-time unlock) added **only after the core game is stable** — not in the first gameplay milestone.

**Every new dependency** must be justified first: why it's needed, package size, whether it adds native code, whether it collects data, whether it supports the pinned Expo version. **No permission added without explicit approval.**

## Working rules (per master plan §29)
1. One clearly-defined task at a time; do not build the whole app in one request; **stop when the task is done and do not auto-advance to the next phase.**
2. Don't rewrite unrelated files. Preserve strict TypeScript. Validate all external/bundled data with Zod.
3. After each task: **type-check, lint, run relevant tests, report exactly which files changed, update `docs/TASKS.md`.**
4. Prefer simple code over abstraction; avoid premature optimization but respect the performance budgets.

## Structure
See master plan §14. Source under `src/` (`app/` routes, `components/`, `features/`, `content/`, `database/`, `theme/`, `store/`, `hooks/`, `services/`, `types/`, `utils/`). Docs under `docs/`. Assets under `assets/` (Claude Design output).

## Commands (once the project is initialized)
```bash
npm run start        # Expo dev server (dev build)
npm run android      # run on Android device / emulator
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # jest
```

## Current status
**Phase 0 — Documentation & repo setup.** Docs are in place. The Expo project has **not** been initialized and **no dependencies are installed yet** — awaiting approval before any install/scaffold. See `docs/TASKS.md`.
