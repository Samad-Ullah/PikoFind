# PikoFind — Performance Budget

Primary constraint: run well on a **2 GB RAM, 720p, older Android** phone with slow storage. Targets are internal quality goals, not guarantees. Detail: `PIKOFIND_MASTER_PLAN.md` §19.

## Budgets
| Measurement | Target |
| --- | ---: |
| Android App Bundle (AAB) | < ~50 MB |
| Installed app | < ~120 MB |
| Cold start (low-end) | ≤ ~3 s |
| Scene load after selection | ≤ ~1 s |
| Gameplay frame rate | 60 FPS target, never consistently < 30 |
| Simultaneously animated objects | 2–4 max |
| Interactive objects per scene | prefer 8–12 |
| Large background images in memory | 1 at a time |
| Active voice instruction | 1 at a time |

## Rendering rules
One static background; interactive objects rendered separately and **memoized** with stable keys; no full-scene re-render per tap; separate active-session state from persisted state. Avoid nested transparent views, large box shadows, blur views, continuous particles, full-screen animated gradients, multiple animation loops. Don't keep hidden worlds mounted.

## Asset rules
WebP backgrounds (≤ ~250 KB, no 4K); SVG interactive objects; no GIF, no full-screen MP4, no uncompressed WAV in production; only bundled required font weights; remove unused assets before release.

## Startup rules
Load only: settings, fonts, home-screen mascot/images, basic audio settings. Do NOT load all scenes, all stickers, all audio, purchase info before needed, or the entire level library into React state.

## Memory cleanup when leaving a world
Stop world music · unload instruction audio · clear active-session state · unmount the scene · release temp image refs · don't retain previous scene components.

## Production checks
Release minification + R8 resource shrinking · test the AAB (not just a dev build) · Android Studio memory profiling · Play Console pre-launch reports · verify **16 KB memory-page** support (required for new apps/updates targeting Android 15+ on applicable 64-bit devices).

## Device matrix
Low-end (2 GB / 720p / Android 8–10 / slow-full storage) · mid-range (3–4 GB / Android 11–13) · modern (6 GB+ / current) · low-cost tablet (landscape, non-16:9). Don't rely only on emulators.
