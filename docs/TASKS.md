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
- [ ] Splash · Parent introduction · Home · World selection · Parent gate · Parent settings
- [ ] Routing (Expo Router) · audio settings · first-launch persistence
- **Done when:** all shell screens navigable, parent area not accidentally openable, settings survive restart.

## Phase 3 — Audio engine
- [ ] Audio manager (no overlapping instructions; play/pause/replay/unload; music + voice volume; pause on background; resume)
- **Done when:** rapid tapping never overlaps voice, previous audio released, mute persists after restart.

## Phase 4 — Core game engine
- [ ] World/level loading · responsive placement · hitboxes · single-target logic · correct/incorrect logic · attempt tracking · assistance · five-challenge sessions · completion
- **Done when:** one placeholder world plays offline, rewards can't duplicate, rapid tapping doesn't break state.

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
