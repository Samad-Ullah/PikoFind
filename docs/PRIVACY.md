# PikoFind — Privacy & Child-Safety Design

PikoFind targets children and must be declared accurately in Play Console under Google Play's **Families** policy. Detail: `PIKOFIND_MASTER_PLAN.md` §§24–25.

## Privacy by design
- **No login, no account, no personal information.**
- **No location, no camera, no microphone** — these permissions are never requested.
- **No behavioural advertising, no ads at all in v1.**
- **No user-generated content, no chat, no social features, no public profiles.**
- **No external links outside the parent gate.**
- **No hidden analytics.**
- **No child-facing purchase controls** — purchases live only behind the parent gate.

## Data stored (locally only, in SQLite)
Settings, world/level progress, unlocked stickers, entitlement cache. **Never stored:** child name, photograph, voice recording, email, contacts, location, advertising identifier.

## Parent gate
Press-and-hold the parent icon (~3s) → an adult verification task (random multiplication or type a shown sequence) that a 4-year-old cannot solve. Gates access to purchases, external links and destructive settings (e.g. Reset Progress, which needs a second confirmation).

## Privacy policy (public page required before launch)
Must state: what is collected; that progress is stored locally; that no account is required; that no photos, voice or location are collected; how a parent resets local progress; support contact; that Google Play processes purchases. The Play Console **Data Safety** form must match real app behaviour exactly.

## Release declarations
Target-audience declaration (child-directed), content-rating questionnaire, Data Safety form, privacy-policy URL, verified SDK list. Keep this document and the store declarations in sync with the actual code.
