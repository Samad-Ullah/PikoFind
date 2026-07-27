# AGENTS.md — PikoFind

**Read [`CLAUDE.md`](CLAUDE.md), [`docs/PIKOFIND_MASTER_PLAN.md`](docs/PIKOFIND_MASTER_PLAN.md) and [`docs/TASKS.md`](docs/TASKS.md) before writing any code.** `CLAUDE.md` holds the hard constraints and stack; the master plan is the canonical source of truth.

This is an **Expo SDK 57** project — read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before using an API. Prefer `expo-audio` (not `expo-av`).

Key non-negotiables (see `CLAUDE.md` for the full list): Android-first, offline, no backend/cloud/API, no camera/mic/location, no analytics/ads/accounts, no personal child data, landscape only, low-end Android is a primary constraint, kind never-shaming tone. One task at a time; type-check + lint + tests after each; update `docs/TASKS.md`; then stop.
