# PikoFind: Complete Product, Design and Implementation Plan

## 1. Product summary

**Product name:** PikoFind
**Tagline:** Listen, look and find!
**Platform:** Android first
**Target audience:** Children aged 4–7
**Primary language:** English
**Future languages:** Spanish and Urdu
**Application type:** Offline educational game
**Primary orientation:** Landscape
**Business model:** Free starter content with a one-time full-game purchase
**Advertising:** No advertising in the first release
**Accounts:** No accounts
**Backend:** No backend
**Internet requirement:** None after installation
**Personal-data collection:** None

PikoFind is an interactive listening and visual-search game. A friendly mascot gives the child a spoken instruction, and the child taps the correct object in a colourful scene.

Example instructions:

* Find the yellow star.
* Tap the small blue car.
* Find the cat under the table.
* Tap the apple, then tap the red cup.
* Put the green ball inside the basket.

The game should develop:

* Listening comprehension
* Visual attention
* Colour recognition
* Shape recognition
* Positional vocabulary
* Memory
* Following one-step and two-step instructions
* Basic English vocabulary

The product must be simple enough for a four-year-old to use without reading.

---

## 2. Primary product goal

The first release must prove that children enjoy repeatedly completing short listening-and-finding sessions.

A successful session should feel like:

```text
Hear instruction
      ↓
Look around the scene
      ↓
Tap the answer
      ↓
Receive cheerful feedback
      ↓
Earn a star or sticker
      ↓
Play the next challenge
```

The game must not feel like a worksheet or examination. It should feel like playing with a friendly character.

---

## 3. Core product principles

### 3.1 Audio first
Children should not need to read. Every important instruction must be spoken aloud. Written text can be included for parents and older children, but it must not be required to complete a level.

### 3.2 One clear action per screen
The child should always understand what to do next. Avoid: complex menus, small icons, multiple navigation bars, hidden gestures, text-heavy instructions, settings inside the child area, pop-ups, advertisements, external links.

### 3.3 Positive feedback
Wrong answers should not feel like failure. When a child taps incorrectly: do not deduct stars, do not use harsh sounds, do not show a large red cross, do not say "Wrong." Gently animate the tapped object. Let Piko say, "Good try. Look again!" After two unsuccessful attempts: slightly animate the correct object, repeat the instruction, optionally reduce the number of distractors.

### 3.4 Fast sessions
A normal session should contain approximately five challenges. A child should be able to complete a session without a long commitment.

### 3.5 Offline and private
All content, progress, sounds and illustrations should remain on the device. The application should not require: camera, microphone, contacts, location, user account, child's name, date of birth, email address, cloud storage, social login.

---

## 4. Target users

### Primary user
A child aged 4–7 who: can tap objects on a phone or tablet, is learning basic vocabulary, enjoys colourful characters, may not be able to read, may use a low-cost or older Android device.

### Secondary user
A parent or guardian who wants: safe screen time, offline educational content, no advertisements, no data collection, simple one-time pricing, progress that does not require an account, an application that works on an inexpensive phone.

---

## 5. MVP scope

### 5.1 Worlds

**World 1: Piko's Playroom** — Colours, basic shapes, common toys, one-step instructions.
Examples: Find the red ball. Tap the yellow star. Find the blue square. Tap the big teddy bear. Find the green car.

**World 2: Piko's Garden** — Animals, plants, size, simple descriptive words, visual attention.
Examples: Find the small butterfly. Tap the brown dog. Find the bird beside the tree. Tap the pink flower. Find the big yellow duck.

**World 3: Piko's Classroom** — Positional vocabulary, school objects, memory, two-step instructions.
Examples: Find the pencil under the book. Tap the bag beside the chair. First tap the apple, then tap the cup. Find the ruler inside the box. Tap the star above the board.

### 5.2 Content quantity
The MVP should include: three worlds; fifteen authored challenges per world; forty-five challenge definitions; five challenges per play session; randomized object positions where safe; several instruction variations; at least thirty reusable object illustrations; one sticker-reward collection; one mascot; approximately ten mascot poses or animation states. Randomized layouts should allow the same challenge content to feel different across multiple sessions.

### 5.3 Free and premium content
**Free version:** first world, ~fifteen challenges, basic sticker collection, all safety and accessibility settings.
**Full-game purchase:** suggested starting price **$2.99 one-time purchase**. Unlocks all three worlds, all challenges, full sticker collection, future minor content additions, Spanish language pack when available, Urdu language pack when available. The exact price can be adjusted before launch.

### 5.4 Features excluded from the MVP
Do not implement: advertisements, subscription, online accounts, cloud synchronization, social sharing, multiplayer, leaderboards, child profiles with names or photographs, camera features, microphone features, AI-generated levels, chatbot, notifications, daily streak pressure, loot boxes, random paid rewards, videos, 3D environments, physics engine, user-generated content, web dashboard.

---

## 6. Application flow

```text
Application launch → Short Piko animation → Home screen → Child selects Play →
World selection → World introduction → Five-challenge session →
Session-complete celebration → Sticker reward → Home, replay or next world
```

Parent flow:

```text
Home screen → Parent icon → Parent gate → Parent area
  ├── Sound settings
  ├── Language
  ├── Purchase full game
  ├── Restore purchase
  ├── Reset progress
  ├── Privacy policy
  └── About and support
```

---

## 7. Required screens

1. **Splash** — logo + essential assets only, 1–2s max, static background + one simple mascot movement, no video.
2. **First-launch parent introduction** — for the parent: ages 4–7, offline, no account, no personal info, audio is important, first world free, additional worlds unlock from parent area. One button: **Start PikoFind**. Do not repeatedly show.
3. **Home** — Piko mascot, large Play button (largest element), sticker-book button, parent-area button, sound button, current star count. No bottom navigation bar.
4. **World selection** — three large illustrated cards (Playroom, Garden, Classroom). Locked worlds stay visible with a small lock, no aggressive purchase messaging, redirect to parent gate before a purchase.
5. **World introduction** — Piko introduces the world with audio; Start / Repeat-audio / Back buttons.
6. **Game screen** — full-screen scene, Piko instruction bubble, repeat-instruction button, five-step progress indicator, sound toggle, large interactive objects. No big-number scores, no early-world timers, no ads, no purchase buttons, no parent settings, no text-heavy instructions.
7. **Correct-answer feedback** — object short animation, Piko celebrates, gentle success sound, award one star, auto-continue after a brief pause.
8. **Incorrect-answer feedback** — tapped object gently wiggles, soft neutral sound, "Good try. Look again!", instruction stays available, no star loss.
9. **Session complete** — stars earned, Piko celebrating, newly unlocked sticker, replay / next-world / home buttons. Avoid heavy confetti; reuse a small number of stars/shapes.
10. **Sticker book** — earned stickers, locked silhouettes, tap for small sound/animation, offline, no complex placement/editing in MVP.
11. **Parent gate** — press-and-hold parent icon 3s, then a simple adult verification (random multiplication or type a displayed sequence). Not something a four-year-old can solve.
12. **Parent area** — music on/off, voice on/off, sound-effect level, language, purchase full game, restore purchase, privacy policy, support, reset progress (second confirmation required), application version.

Additional design deliverables: full-game purchase screen and reset-progress confirmation.

---

## 8. Piko mascot

**Piko is a small, friendly parrot.** Teal body, yellow wings, coral-orange beak, large expressive eyes, rounded body shape, small wings and feet, no sharp/aggressive features. Personality: curious, patient, encouraging, playful, never judgmental, short sentences.

Required states: Idle, Speaking, Listening, Pointing, Celebrating, Thinking, Encouraging (after a wrong answer), Flying, Holding a star, Sleeping/waiting.

Avoid frame-by-frame animations with dozens of large images. Prefer static SVG poses, simple transform animations, two-to-four-frame sprite animations only where necessary.

---

## 9. Visual design system

### 9.1 Colour palette — Primary
| Purpose | Colour | Hex |
| --- | --- | --- |
| Sky blue | Primary interface | `#43C6E8` |
| Sunshine yellow | Rewards and highlights | `#FFD84D` |
| Coral | Important actions | `#FF7A6B` |
| Mint green | Success and nature | `#6FD6A8` |
| Playful purple | Premium and special elements | `#9B7EDE` |

### 9.1 Colour palette — Supporting
| Purpose | Colour | Hex |
| --- | --- | --- |
| Warm cream | Main background | `#FFF8E7` |
| Dark navy | Text and outlines | `#26324A` |
| Soft white | Cards | `#FFFFFF` |
| Light grey-blue | Disabled elements | `#D9E4EA` |

### 9.2 Colour rules
Do not use every colour equally on every screen. One dominant background colour. One main action colour. Reserve yellow for rewards/attention. Dark navy rather than pure black for text. Avoid neon. Avoid flashing colour changes. Strong contrast between objects and backgrounds. Do not rely only on colour to communicate correct/incorrect.

### 9.3 Typography — **Nunito** (SemiBold, Bold, ExtraBold)
Main buttons 26–32sp; instructions 24–30sp; parent-area text 16–20sp. Avoid thin weights and long uppercase. Short child-facing sentences. Include a system-font fallback.

### 9.4 Shapes and components
Use: large rounded buttons, rounded cards, thick outlines, soft static shadows, large touch areas, simple labelled icons in the parent area. Avoid: glassmorphism, blur, complex gradients, tiny icons, thin borders, realistic 3D, heavy drop shadows, large transparent overlays.

### 9.5 Touch targets
Child-facing targets ≥ ~64dp. Interactive objects may have invisible hitboxes slightly larger than the illustration. Keep objects away from screen edges, navigation gestures, other interactive objects and Piko's instruction bubble.

---

## 10. Orientation and responsive layout

Entire game uses **landscape**. Baseline `1280 × 720`, 16:9. Use normalized positions (`0`–`1`), safe margins, proportional scaling, letterbox rather than stretch. On tablets centre the scene with decorative margins. Test 16:9, 18:9 and tablet.

```typescript
{ x: 0.35, y: 0.62, width: 0.12, height: 0.18 }
```

---

## 11. Claude Design responsibilities
Claude Design owns visual planning and asset creation only — not technical architecture or app logic. Deliverables: brand assets (logo, icon, feature graphic, mascot, palette, typography spec, button/card components); designs for all screens listed in §7; three scene backgrounds (Playroom, Garden, Classroom) with clear placement space and **no permanently-drawn interactive objects**; reusable object assets (ball, car, teddy bear, blocks, star, circle, square, triangle, cat, dog, bird, butterfly, duck, flower, tree, apple, cup, pencil, book, bag, chair, ruler, box).

**Export rules.** Backgrounds: WebP, `1280 × 720`, generally < 250 KB, avoid unnecessary transparency, no 4K. Interactive objects: SVG (simple) or WebP (detailed), 128–256px source, transparent, tight bounding box, consistent outline/perspective. Mascot: SVG static poses, small WebP sprite sheet only when needed, no GIF/video/large Lottie. File naming: `piko_idle.svg`, `scene_playroom.webp`, `object_red_ball.svg`, `sticker_butterfly.svg`.

---

## 12. Technical stack

Core: React Native, Expo, TypeScript, Expo Router, Android-first. Use the current production-appropriate Expo SDK and lock compatible versions. As of July 2026, **Expo SDK 57** is the latest documented SDK; Expo recommends **development builds** (not permanent Expo Go) for store-bound apps.

Libraries: Expo Router (nav); `expo-audio` (NOT deprecated `expo-av`); `expo-image`; `expo-sqlite` (progress, settings, stickers, entitlement cache); `react-native-svg` (objects, icons, static mascot); `react-native-reanimated` (simple scale/rotate/translate/opacity/bounce/wiggle only); Zustand (runtime state only, persist important state in SQLite); Zod (validate bundled world/level definitions in dev). Testing: Jest, React Native Testing Library, Maestro (e2e), Android Studio Profiler, Play Console pre-launch reports. Purchases: one-time Google Play Billing, added only after the core game is stable, via a maintained RN billing library compatible with the chosen Expo/RN versions — NOT during the first gameplay milestone.

---

## 13. Technologies NOT permitted in the MVP
Firebase, Supabase, AWS, external API, generative AI API, cloud analytics, ad SDK, social SDK, camera library, microphone permission, location permission, WebView game engine, Unity, Unreal, Three.js, heavy physics engine, large animation framework, custom native code (unless required for Google Play Billing). Every new dependency needs a clear reason and prior approval.

---

## 14. Recommended project structure

```text
PikoFind/
├── CLAUDE.md
├── README.md
├── app.json
├── package.json
├── tsconfig.json
├── docs/
│   ├── PIKOFIND_MASTER_PLAN.md
│   ├── DESIGN_SYSTEM.md
│   ├── CONTENT_GUIDE.md
│   ├── PERFORMANCE_BUDGET.md
│   ├── PRIVACY.md
│   ├── PLAY_STORE_CHECKLIST.md
│   └── TASKS.md
├── assets/
│   ├── audio/{en,music,sfx}/
│   ├── fonts/  icons/  mascot/  objects/  scenes/  stickers/
├── src/
│   ├── app/            (_layout, index, onboarding, home, worlds, game/[worldId], results, stickers, parent/{gate,settings,purchase})
│   ├── components/     (KidButton, IconButton, PikoMascot, ProgressDots, AudioReplayButton, ResponsiveScene)
│   ├── features/       (audio, game, parentGate, progress, purchases, rewards, settings, worlds)
│   ├── content/        (worlds.ts, levels/{playroom,garden,classroom}.ts, localization/en.ts)
│   ├── database/       (database.ts, migrations.ts, repositories/)
│   ├── hooks/  services/  store/
│   ├── theme/          (colors.ts, spacing.ts, typography.ts, index.ts)
│   ├── types/  utils/
└── tests/              (unit/, components/, e2e/)
```

---

## 15. Game data model

```typescript
type World = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  sceneAsset: string;
  introductionAudioKey: string;
  order: number;
  isPremium: boolean;
  levelIds: string[];
};

type SceneObject = {
  id: string;
  assetKey: string;
  category: 'animal' | 'toy' | 'shape' | 'food' | 'school' | 'nature';
  color?: string;
  size?: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  hitboxPadding?: number;
  layer: number;
  accessibilityLabelKey: string;
};

type Level = {
  id: string;
  worldId: string;
  difficulty: 1 | 2 | 3;
  instructionKey: string;
  instructionAudioKey: string;
  instructionType: 'single_target' | 'attribute_target' | 'position_target' | 'sequence';
  objects: SceneObject[];
  targetObjectIds: string[];
  rewards: { stars: number; stickerId?: string };
  assistance: { highlightAfterAttempts: number; repeatAfterAttempts: number };
};

type GameSession = {
  id: string;
  worldId: string;
  levelIds: string[];
  currentLevelIndex: number;
  correctAnswers: number;
  totalAttempts: number;
  starsEarned: number;
  startedAt: number;
  completedAt?: number;
};
```

---

## 16. Game-state machine

```text
LOADING_LEVEL → PLAYING_INSTRUCTION → WAITING_FOR_TAP
  ├── CORRECT_FEEDBACK
  ├── INCORRECT_FEEDBACK
  └── ASSISTANCE
        ↓
NEXT_LEVEL → SESSION_COMPLETE
```

Must prevent: simultaneous multi-tap processing; audio playing over audio; double rewards; advancing during feedback animation; loading a level without valid content; incorrect progress after app resume.

---

## 17. Audio plan
Prefer a warm human voice over device TTS. Record world introductions, level instructions, correct-answer phrases, encouragement, parent intro where appropriate. Format: mono, M4A/AAC, ~48–64 kbps, trimmed, normalized, short. Loading: do not preload everything — load current instruction, optionally prepare next, release previous, keep only reused feedback sounds loaded. Music: at most one quiet non-vocal seamless loop per world, disableable, kept below voice; lower/stop during spoken instructions. All audio needs a clear commercial-use licence tracked in `docs/ASSET_LICENSES.md`.

---

## 18. Local database (SQLite — small structured data only)

```sql
settings(key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER NOT NULL)
world_progress(world_id TEXT PRIMARY KEY, completed_sessions INTEGER NOT NULL, earned_stars INTEGER NOT NULL, updated_at INTEGER NOT NULL)
level_progress(level_id TEXT PRIMARY KEY, completed_count INTEGER NOT NULL, best_attempt_count INTEGER, last_completed_at INTEGER)
unlocked_stickers(sticker_id TEXT PRIMARY KEY, unlocked_at INTEGER NOT NULL)
entitlements(product_id TEXT PRIMARY KEY, is_unlocked INTEGER NOT NULL, last_verified_at INTEGER)
```

Never store: child name, photograph, voice recording, email, contacts, location, advertising identifier.

---

## 19. Low-end Android performance plan
Design for 2 GB RAM, slower CPU, limited storage, 720p, older Android, slow storage.

**Budgets:** AAB < ~50 MB; installed < ~120 MB; cold start ≤ ~3s on low-end; scene load ≤ ~1s; 60 FPS target, never consistently < 30; max 2–4 simultaneously animated objects; prefer 8–12 interactive objects per scene; one large background image in memory; one active voice instruction. (Internal targets, not guarantees.)

**Rendering:** one static background; separate interactive objects; avoid nested transparent views, large shadows, blur, particles, full-screen animated gradients, multiple animation loops, full-scene re-render per tap; memoize objects; stable keys; separate active vs persisted state; do not keep hidden worlds mounted.

**Assets:** WebP backgrounds, SVG objects, no 4K/GIF/full-screen MP4/uncompressed WAV, only required font weights, remove unused assets before release.

**Startup:** load only settings, fonts, home mascot/images, basic audio settings — not all scenes/stickers/audio/purchase-info/level library.

**Memory cleanup on leaving a world:** stop music, unload instruction audio, clear session state, unmount scene, release temp image refs, don't retain previous scene components.

**Production:** release minification, R8 resource shrinking, test the AAB, memory profiling, pre-launch reports, verify 16 KB memory-page support (required for new apps/updates targeting Android 15+ on applicable 64-bit devices).

---

## 20. Testing-device matrix
Low-end (2 GB, 720p, Android 8–10, slow/full storage); mid-range (3–4 GB, Android 11–13); modern (6 GB+, current Android); tablet (low-cost, landscape, non-16:9). Do not rely entirely on emulators.

---

## 21. Accessibility and child usability
Audio replay always visible in gameplay; no reading required; large touch areas; no fast timer; no penalty for mistakes; no flashing; no sudden loud audio; music below voice; distinguishable shapes as well as colours; colour-blind-friendly distinctions where possible; pause on background; safe resume; mute mode; device accessibility font settings honoured in the parent area; keep critical controls out of system gesture areas.

---

## 22. Reward system
**Stars:** correct = 1, session max 5, no loss, no paid purchase. **Stickers:** after first completed session, world milestone, or several sessions — avoid excessive repeated play. **Rules:** deterministic; no loot boxes; no random paid rewards; no FOMO; no streak punishment; no purchase pressure.

---

## 23. Monetization plan
Free first world + one-time full unlock. Purchase screen only behind the parent gate; explain exactly what unlocks; normal Google Play UI; support restore; no repeated prompts; no in-gameplay price/promo; no fake countdowns; no "your child will be sad" messaging; no disguised purchase buttons. **No advertisements in v1** (parent trust, simplicity, less weight, less privacy complexity, avoids child-directed ad mistakes). If ads considered later, follow Google Play Families policy (non-personalized ads, eligible SDKs).

---

## 24. Privacy and child-safety requirements
Target-audience declared accurately in Play Console; comply with the Families policy. No login, personal info, behavioural ads, location, camera, microphone, UGC, chat, social, public profiles, external links outside the parent gate, hidden analytics, or child-facing purchase controls. Publish a simple privacy policy stating what is collected, local-only progress, no account, no photos/voice/location, how a parent resets progress, support contact, and that Google Play processes purchases. The Data Safety form must match real behaviour.

---

## 25. Android and Play Store requirements
Before submission: target the required Android API level; build an AAB; enable Play App Signing; complete target-audience declaration, content rating, Data Safety form; add privacy-policy URL; declare child-directed; verify all SDKs; test purchases in a testing track; run the pre-launch report. **From August 31, 2026**, new apps/updates must target **Android 16, API level 36** (except certain non-phone form factors) — configure and test for API 36. Newer personal Play Console accounts must complete Google Play's required closed-testing process before production access — verify inside the specific account.

---

## 26. Development phases

- **Phase 0 — Documentation & repo setup:** init Expo TS project, init Git, add CLAUDE.md + master plan + TASKS.md + conventions, linting/formatting, test framework, lock landscape orientation, configure app name + package id. *Done when:* blank app builds, Android dev build opens, type-check passes, lint passes, first commit exists.
- **Phase 1 — Design-system foundation:** colour/spacing/typography tokens, KidButton, IconButton, ResponsiveScene, safe-area handling, placeholder mascot, placeholder assets only where finals are unavailable. *Done when:* a component-gallery screen shows all components scaling on phone + tablet; no gameplay logic added.
- **Phase 2 — Application shell:** splash, parent intro, home, world selection, parent gate, parent settings, routing, audio settings, first-launch persistence. *Done when:* all shell screens navigable, parent area not accidentally openable, settings survive restart.
- **Phase 3 — Audio engine:** audio manager, no overlapping instructions, play/pause/replay/unload, music + voice volume, pause on background, resume. *Done when:* rapid tapping never overlaps voice, previous audio released, mute persists.
- **Phase 4 — Core game engine:** world/level loading, responsive placement, hitboxes, single-target logic, correct/incorrect logic, attempt tracking, assistance, five-challenge sessions, completion. *Done when:* one placeholder world plays, rewards can't duplicate, rapid tapping doesn't break state, works offline.
- **Phase 5 — Vertical slice:** one polished Playroom session with final assets (background, mascot, five challenges, sounds, feedback, result, one sticker). *Done when:* a child completes it without adult explanation, smooth on low-end reference, parents understand immediately. Do NOT build all content before validating this.
- **Phase 6 — Progress & rewards:** SQLite migrations, world progress, stars, sticker unlocks, sticker book, restoration, reset, DB error handling. *Done when:* progress survives restart, reset needs parent confirmation, migration tests pass.
- **Phase 7 — Complete content:** all 15 Playroom + Garden + Classroom challenges, position + selected two-step instructions, level validation, content checks. *Done when:* all 45 definitions load, targets in safe bounds, no unreasonable overlap, every instruction has audio.
- **Phase 8 — Purchase integration:** create product in Play Console, parent-only purchase screen, purchase flow, entitlement persistence, restore, cancelled/offline/reinstall tests. *Done when:* children can't open purchase, premium unlocks, failed purchases don't corrupt progress, restore works.
- **Phase 9 — Performance:** measure startup/RAM, profile scenes, remove unused deps, compress assets, drop unused font weights, reduce re-renders, test release build, low-storage, background/resume. *Done when:* budgets met/documented, no major frame drops, no scene-memory leak, size within budget.
- **Phase 10 — QA:** unit/component/e2e, manual child-usability, parent feedback, low-end + tablet + purchase + offline + airplane + interruption testing, accessibility review. *Done when:* no critical/high bugs, playable without reading, parent settings protected, crash-free closed-testing build.
- **Phase 11 — Play Store launch:** icon, feature graphic, screenshots, descriptions, privacy page, Data Safety, target-audience, content rating, internal + closed testing, pre-launch report, production. *Done when:* all Play Console requirements complete, AAB passes, listing accurate, privacy matches code.

---

## 27. Testing plan
**Unit:** level validation, target matching, sequence order, reward calc, assistance threshold, world locking, entitlement logic, DB repositories, settings defaults, progress reset. **Component:** KidButton, repeat button, progress indicator, parent gate, purchase screen, sticker book, responsive scene. **E2E:** first launch → parent intro → free world → complete a challenge → complete session → sticker → restart → progress persists → parent area → change a sound setting. **Manual:** rapid multi-tap, Home during instruction, lock/unlock, forced rotation, sound off mid-instruction, return from parent area, force-close mid-session, no internet, low storage, post-DB-update launch, edge taps, simultaneous two-object tap, twenty consecutive sessions, large accessibility text, low-volume speakers, cancel purchase, lose network during purchase, restore purchase.

---

## 28. Content-quality checklist
Every challenge: grammatically correct short spoken instruction; target exists exactly once (unless intentional); visually distinguishable; fair distractors; not hidden behind Piko/UI; large enough hitbox; not reliant on a tiny colour difference; correct audio file exists; accessibility label exists; position words match layout; unambiguous two-step order; manually tested. **Automated content-validation script fails when:** duplicate level ID; missing audio key; missing target object; unexpectedly duplicated target object ID; coordinates out of bounds; premium world marked free; missing localization key.

---

## 29. Claude Code working rules
1. Read `CLAUDE.md`, `PIKOFIND_MASTER_PLAN.md`, `TASKS.md` before working. 2. One task at a time. 3. Don't build the whole app in one request. 4. Don't generate visual assets. 5. Placeholder assets only when finals are unavailable. 6. No dependency without explaining why / size / native code / data collection / Expo-version support. 7. No permissions without explicit approval. 8. No backend. 9. No analytics. 10. No ads. 11. No camera/microphone. 12. Don't rewrite unrelated files. 13. Preserve strict TypeScript. 14. Validate all external data. 15. Type-check after each task. 16. Lint after each task. 17. Run relevant tests after each task. 18. Report exactly which files changed. 19. Update `TASKS.md`. 20. Stop when the requested task is complete. 21. Don't auto-proceed to the next phase. 22. Low-end Android performance is a primary constraint. 23. Prefer simple code over unnecessary abstraction. 24. Avoid premature optimization but respect budgets. 25. Never store personal information about a child.

---

## 34. Final MVP definition of done
Works fully offline; no reading required; three worlds; free world works without purchase; premium worlds behind the parent gate; 45 challenge definitions; professionally recorded understandable instructions; friendly correct/incorrect feedback; local progress; working sticker rewards; working restore purchase; no personal child info collected; no unnecessary permissions; acceptable performance on a real 2 GB device; AAB within budget; clean pre-launch report; privacy + Data Safety match code; one consistent design system; usable by a child without adult explanation once inside a world.
