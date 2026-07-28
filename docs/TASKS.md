# PikoFind — Task Tracker

Working agreement: **one task at a time**, type-check + lint + relevant tests after each, report changed files, update this file, then **stop** (no auto-advance to the next phase). Full detail per phase lives in `PIKOFIND_MASTER_PLAN.md` §26.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 0 — Documentation & repository setup
- [x] Write `CLAUDE.md`
- [x] Write `docs/PIKOFIND_MASTER_PLAN.md` (canonical plan)
- [x] Write `docs/TASKS.md`
- [x] Write supporting docs (DESIGN_SYSTEM, CONTENT_GUIDE, PERFORMANCE_BUDGET, PRIVACY, PLAY_STORE_CHECKLIST, ASSET_LICENSES)
- [x] Initialize Expo + TypeScript project — **Expo SDK 57.0.8**, RN 0.86, React 19.2, expo-router 57, in `/root/PikoFind/app` (WSL master)
- [x] Initialize Git repository + `.gitignore` (scaffold ran `git init` + "Initial commit"; branch `master`)
- [x] Add ESLint config (`eslint.config.js`, flat config + `eslint-config-expo`)
- [ ] Add Prettier config (optional — deferred; not required by expo lint)
- [ ] Add Jest + React Native Testing Library (deferred to when first testable logic exists)
- [x] Lock landscape orientation in `app.json`
- [x] Configure app name (`PikoFind`) + Android package (`com.pikofind.app`) + iOS bundle id
- [x] Strict TypeScript (already enabled by template; `@/*` → `src/*` alias present) + `expo-env.d.ts` added (fixes CSS-import types)
- [x] Add `typecheck` npm script; `npx tsc --noEmit` → clean (exit 0)
- [ ] Commit the PikoFind configuration + docs (scaffold's "Initial commit" is the bare template; a config commit follows)
- **Done when:** blank app builds, Android dev build opens, type-check passes, lint passes, first commit exists.
- **Note:** demo template screens (`src/app/index,explore`, `src/components/*`) + demo-only deps (`@expo/ui`, `expo-glass-effect`) are kept for now and get replaced/removed in Phase 1 (glass-effect conflicts with the "no glassmorphism" rule).

## Phase 1 — Design-system foundation
- [x] Colour tokens (`src/theme/colors.ts`) — palette + semantic aliases
- [x] Spacing tokens (`src/theme/spacing.ts`) — spacing/radius/border/touchTarget + cross-platform shadow
- [x] Typography tokens (`src/theme/typography.ts`) — sizes/weights/roles; system fallback (Nunito files = small follow-up)
- [x] `KidButton` (variants + play size + chunky press-lip), `IconButton` (round, always labelled)
- [x] `ResponsiveScene` (16:9 letterbox) + `SceneItem` (normalized 0..1 placement) + safe-area
- [x] `ProgressDots`
- [x] Placeholder `PikoMascot` (react-native-svg, 10 poses via transforms)
- [x] SVG icon set (`src/components/icons.tsx`) + temporary component-gallery screen (`src/app/index.tsx`)
- [x] Removed the Expo demo cluster; root `_layout.tsx` → simple Stack
- [x] Verified: `tsc --noEmit` clean · `eslint .` clean (0 warnings)
- [ ] Confirm rendering/scaling on the phone (needs device run — headless can't verify visuals)
- **Added dep:** `react-native-svg@15.15.4` (plan-core: mascot/objects/icons; native but bundled in Expo Go, SDK-57 matched, no permissions, no data).
- **Done when:** gallery shows all components scaling correctly on phone + tablet; no gameplay logic added.

## Phase 2 — Application shell
Slice 1 (navigation + gate) — DONE:
- [x] Splash (`index.tsx`) → Home → World selection → World intro (`world/[worldId].tsx`)
- [x] Parent gate (`parent/gate.tsx`, multiplication barrier) → Parent settings (`parent/settings.tsx`)
- [x] Routing (Expo Router, typed routes) + settings store (`store/useSettings.ts`, zustand, in-memory)
- [x] Worlds content list (`content/worlds.ts`; playroom free, garden/classroom premium → gate)
- [x] Gallery moved to `/gallery` (dev screen; temporarily reachable via Home "Stickers")
- [x] Verified: tsc + eslint clean, android export bundles
- [~] Audio settings: toggles wired to the store; actual audio engine is Phase 3
Slice 2 (persistence + onboarding) — DONE:
- [x] First-launch **parent introduction** (`onboarding.tsx`); splash routes to it once, then remembers via an `onboarded` flag
- [x] SQLite (`src/db/database.ts` + `settings.ts`, expo-sqlite) — `settings` key/value table
- [x] Settings store hydrates from + writes through to SQLite (sound/music/voice/effects survive restart); root layout hydrates on launch
- [x] Verified: tsc + eslint clean, android export bundles
- **Done when:** all shell screens navigable ✓, parent area not accidentally openable ✓, settings survive restart ✓ — **Phase 2 COMPLETE**.
- **Added deps:** `zustand` (runtime state), `expo-sqlite` (local persistence; native but Expo-Go-bundled, no data leaves device).
Remaining polish (not blocking Phase 2):
- [ ] Replace Home "Stickers" temp `/gallery` link once the sticker book exists (Phase 6)
- [ ] `expo-sqlite` web stub if web is ever targeted (Android-first, so deferred)
- [ ] Device-verify rendering/scaling (S24)

## Phase 3 — Audio engine — DONE (engine), 2026-07-28
- [x] Audio manager (`src/features/audio/AudioManager.ts`, singleton `audio`) — expo-audio, framework-free so game code can call it directly; `init()` wired into root `_layout` after settings hydrate
- [x] No overlapping instructions — single reused voice player; a new `playVoice` `.replace()`s the source (old clip stops), so rapid tapping never overlaps; `playVoice` returns a promise that resolves on finish / interruption / disabled / missing-asset (never hangs)
- [x] play / replay / stop / unload (`teardown` releases every native player)
- [x] Music channel — one quiet loop per world (`playMusic`/`stopMusic`), ducks under voice (0.35 → 0.12) and restores
- [x] Feedback sfx kept loaded (correct/wrong/tap/star/sticker), one player per key
- [x] Volume + mute obey persisted settings (soundOn master + music/voice/effects); a store subscription reconciles live when a parent toggles a switch
- [x] Pause on background + resume (AppState listener; remembers whether voice was mid-play), `setAudioModeAsync` respects the silent switch, no background playback, ducks other apps
- [x] Graceful **missing-asset** handling — registry (`src/features/audio/sources.ts`) is empty until recordings exist; unknown key = silent no-op + one dev warning, so game flow builds/awaits before audio is recorded
- [x] Verified: tsc + eslint clean, android export bundles
- **Added dep:** `expo-audio` (~57.0.3; core audio-first module, SDK-57 matched, playback needs no permission, no data leaves device; master-plan replacement for deprecated expo-av).
- [ ] Device-verify on S24 once first recordings land: rapid-tap = no voice overlap; mute persists after restart; Home/lock/return resumes cleanly. (Headless can't verify audible behaviour.)
- **Done when:** rapid tapping never overlaps voice, previous audio released, mute persists after restart. *(Engine complete; audible verification pending real recordings + device.)*

## Phase 4 — Core game engine — DONE, 2026-07-28
- [x] Content model (`src/content/types.ts`: Level, SceneObject, AssistanceRule) + placeholder Playroom session (`src/content/levels/playroom.ts`, 5 challenges) + `getLevels(worldId)`
- [x] Game-state machine (`src/game/useGameSession.ts`, zustand): loading→instruction→waiting→correct/incorrect→(waiting+assistance)→next→complete. Pure (no audio/timers) so it's testable
- [x] Guards: a tap is honoured only in `waiting` and immediately leaves it → **no double-processing / no double-reward** on rapid taps; stars added once on the correct transition
- [x] Responsive placement + hitboxes: `SceneObjectView` (labelled coloured shape, generous `hitSlop`) inside `SceneItem` (normalized 0..1), objects sized wide
- [x] Single-target logic + attempt tracking + assistance (highlight correct + auto-repeat instruction after 2 wrong)
- [x] Kind feedback (§3.3): wrong tap → object wiggles + Piko "encouraging" + soft sound + "Good try" voice; **no penalty, no red cross, no star loss**
- [x] Game screen (`src/app/game/[worldId].tsx`): scene, Piko instruction bubble, replay button, 5-dot progress, sound toggle, leave-game; drives audio via the Phase-3 engine
- [x] Session completion → results (`src/app/results.tsx`): Piko celebrates, stars earned, Play again / Home
- [x] Wired world intro Start → game; intro + instruction voices play through the audio engine (silent until recordings exist)
- [x] Verified: tsc + eslint clean, android export bundles
- [ ] Device-verify on S24: taps register, hitboxes fair, layout fits 1280×720 landscape, feedback timing feels right (headless can't verify visuals/taps)
- **Note:** stars are in-session only; persisting stars/stickers to SQLite is Phase 6. Premium worlds have no levels yet (Phase 7) — the game screen shows a friendly "coming soon".
- **Done when:** one placeholder world plays offline ✓, rewards can't duplicate ✓, rapid tapping doesn't break state ✓ — **engine complete; device pass pending.**

## Phase 5 — Vertical slice
- [ ] One polished Playroom session with final assets (background, mascot, 5 challenges, sounds, feedback, result, 1 sticker)
- **Done when:** a child completes it without adult explanation; smooth on low-end reference; parents get it immediately.

## Phase 6 — Progress & rewards
- [ ] SQLite migrations · world progress · stars · sticker unlocks · sticker book · restoration · reset (parent-confirmed) · DB error handling
- **Done when:** progress survives restart, reset needs confirmation, migration tests pass.

## Phase 7 — Complete content
- [ ] All 15 Playroom + Garden + Classroom challenges · position + selected two-step instructions · level validation · content checks
- **Done when:** all 45 definitions load, targets in safe bounds, no unreasonable overlap, every instruction has audio.

## Phase 8 — Purchase integration
- [ ] Play Console product · parent-only purchase screen · purchase flow · entitlement persistence · restore · cancelled/offline/reinstall tests
- **Done when:** children can't open purchase, premium unlocks, failed purchases don't corrupt progress, restore works.

## Phase 9 — Performance
- [ ] Measure startup/RAM · profile scenes · remove unused deps · compress assets · drop unused font weights · reduce re-renders · release build · low-storage · background/resume
- **Done when:** budgets met/documented, no major frame drops, no scene-memory leak, size within budget.

## Phase 10 — QA
- [ ] Unit/component/e2e · manual child-usability · parent feedback · low-end + tablet + purchase + offline + airplane + interruption testing · accessibility review
- **Done when:** no critical/high bugs, playable without reading, parent settings protected, crash-free closed-testing build.

## Phase 11 — Play Store launch
- [ ] Icon · feature graphic · screenshots · descriptions · privacy page · Data Safety · target-audience · content rating · internal + closed testing · pre-launch report · production
- **Done when:** all Play Console requirements complete, AAB passes, listing accurate, privacy matches code.

---

## Proposed first five implementation tasks (after repo review + approval)
1. Initialize the Expo SDK 57 + TypeScript (strict) dev-build project; lock landscape; set app name + package id.
2. Add tooling: ESLint + Prettier + Jest + RN Testing Library; wire `typecheck`/`lint`/`test` scripts; init Git + `.gitignore`; first commit.
3. Phase 1 theme tokens: `colors.ts`, `spacing.ts`, `typography.ts` (+ index), from the master-plan palette.
4. Phase 1 core components: `KidButton`, `IconButton`, `ProgressDots`, `ResponsiveScene`, placeholder `PikoMascot`.
5. Phase 1 component-gallery screen to visually verify components scale on phone + tablet in landscape.
