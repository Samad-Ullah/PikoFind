# PikoFind — Content Guide

How worlds, levels and objects are authored and validated. Data model detail: `PIKOFIND_MASTER_PLAN.md` §15. Validate all bundled content with **Zod** in dev.

## Worlds (MVP = 3)
1. **Piko's Playroom** (free) — colours, basic shapes, common toys, one-step instructions.
2. **Piko's Garden** (premium) — animals, plants, size, descriptive words, visual attention.
3. **Piko's Classroom** (premium) — positional vocabulary, school objects, memory, two-step instructions.

15 authored challenges per world → **45 total**. A play session = **5 challenges**. Randomize safe object positions and rotate instruction phrasing/distractors so replays feel fresh.

## Instruction types
- `single_target` — "Find the red ball."
- `attribute_target` — colour/size attribute, e.g. "Tap the small blue car."
- `position_target` — positional vocabulary, e.g. "Find the cat under the table."
- `sequence` — two-step, e.g. "Tap the apple, then tap the cup." (Classroom.)

## Object categories
`animal | toy | shape | food | school | nature`. Positions/dimensions are normalized `0..1`. Optional `hitboxPadding`, explicit `layer`, required `accessibilityLabelKey`.

## Reusable object library (≥30)
ball, car, teddy bear, blocks, star, circle, square, triangle, cat, dog, bird, butterfly, duck, flower, tree, apple, cup, pencil, book, bag, chair, ruler, box (extend as needed). Final art from Claude Design; author with placeholders until then.

## Rewards
1 star per correct answer, session max 5, never lost, never purchasable. Stickers awarded deterministically (first session / world milestone / several sessions) — no loot boxes, no FOMO, no streak pressure.

## Assistance
Per level: `highlightAfterAttempts` (gently animate the correct object) and `repeatAfterAttempts` (replay the instruction). After two misses, optionally reduce distractors. Never punish a wrong tap.

## Localization
All child-facing strings via keys (`instructionKey`, `titleKey`, `accessibilityLabelKey`, audio keys). MVP ships `en`; Spanish + Urdu packs later. Every key must resolve.

## Content-quality checklist (per challenge)
Short grammatical spoken instruction · target exists exactly once (unless intentional) · visually distinguishable · fair distractors · not hidden behind Piko/UI · large-enough hitbox · not reliant on a tiny colour difference · correct audio file exists · accessibility label exists · position words match layout · unambiguous two-step order · manually tested.

## Automated content-validation (dev script) must FAIL on
duplicate level ID · missing audio key · missing target object · unexpectedly duplicated target object ID · coordinates out of `0..1` bounds · premium world marked free · missing localization key.
