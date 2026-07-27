# PikoFind — Design System

Implementation reference for `src/theme/`. Canonical rationale lives in `PIKOFIND_MASTER_PLAN.md` §§8–10. Claude Design owns final visuals; this file is what the code implements.

## Colour tokens
| Token | Purpose | Hex |
| --- | --- | --- |
| `skyBlue` | Primary interface | `#43C6E8` |
| `sunshineYellow` | Rewards & highlights | `#FFD84D` |
| `coral` | Important actions | `#FF7A6B` |
| `mintGreen` | Success & nature | `#6FD6A8` |
| `playfulPurple` | Premium & special | `#9B7EDE` |
| `warmCream` | Main background | `#FFF8E7` |
| `darkNavy` | Text & outlines | `#26324A` |
| `softWhite` | Cards | `#FFFFFF` |
| `greyBlue` | Disabled | `#D9E4EA` |

**Rules:** one dominant background + one main action colour per screen; yellow reserved for rewards/attention; `darkNavy` for text (never pure black); no neon; no flashing; strong object/background contrast; **never rely on colour alone** to signal correct/incorrect (also use shape/animation).

## Typography — Nunito
Weights only: SemiBold, Bold, ExtraBold (+ system fallback). Scale: main buttons **26–32sp**, instructions **24–30sp**, parent-area **16–20sp**. No thin weights, no long uppercase, short child-facing sentences.

## Shape & component rules
Large rounded buttons, rounded cards, thick outlines, soft **static** shadows, large touch areas, labelled icons in the parent area. **Avoid:** glassmorphism, blur, complex gradients, tiny icons, thin borders, realistic 3D, heavy drop shadows, large transparent overlays.

## Touch targets
Child-facing targets **≥ ~64dp**. Interactive objects may use invisible hitboxes slightly larger than the visible art (`hitboxPadding`). Keep objects clear of screen edges, system gesture areas, other objects, and Piko's instruction bubble.

## Layout
Landscape only. Baseline `1280 × 720` (16:9). Normalized `0..1` positions/dimensions, safe margins, proportional scaling, letterbox (never stretch). Tablets: centre the scene with decorative margins. Test 16:9, 18:9, tablet.

## Core components (Phase 1)
- `KidButton` — large rounded primary action (coral default), pressed state, optional icon, big hit area.
- `IconButton` — round icon button (sound toggle, repeat audio, back), labelled in parent area.
- `ProgressDots` — five-step session progress.
- `ResponsiveScene` — maintains 16:9 aspect, maps `0..1` object coords to on-screen positions, letterboxes.
- `PikoMascot` — placeholder mascot with pose prop (`idle | speaking | pointing | celebrating | encouraging | …`).

## Mascot poses (final art from Claude Design)
Idle, Speaking, Listening, Pointing, Celebrating, Thinking, Encouraging, Flying, Holding a star, Sleeping/waiting. Prefer static SVG + simple transform animation over frame-by-frame.
