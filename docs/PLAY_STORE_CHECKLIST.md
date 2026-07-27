# PikoFind — Play Store Launch Checklist

Detail: `PIKOFIND_MASTER_PLAN.md` §§25, 26 (Phase 11). Verify account-specific requirements inside the actual Play Console account.

## Build & signing
- [ ] Target the required Android API level — **from 2026-08-31, new apps/updates must target Android 16 (API 36)** (except certain non-phone form factors). Configure & test for API 36.
- [ ] Build an **Android App Bundle (AAB)**, within the ~50 MB budget
- [ ] Enable **Play App Signing**
- [ ] Release minification + R8 resource shrinking enabled
- [ ] Verify **16 KB memory-page** support on applicable 64-bit devices

## Declarations
- [ ] Target-audience declaration — **child-directed (ages 4–7)**, Families policy
- [ ] Content-rating questionnaire
- [ ] **Data Safety** form — must match real behaviour (no data collected)
- [ ] Privacy-policy URL (public page)
- [ ] Verify every SDK/dependency used

## Purchases
- [ ] Create the one-time full-unlock product in Play Console
- [ ] Test purchase in a testing track
- [ ] Test restore purchase, cancelled purchase, offline-after-purchase, reinstall-and-restore

## Testing & release
- [ ] Internal testing track
- [ ] Closed testing (**newer personal accounts must complete Google Play's required closed-testing process before production access** — confirm in the account)
- [ ] Play Console **pre-launch report** — no critical issues
- [ ] Crash-free build validated on the low-end reference device

## Store listing
- [ ] App icon
- [ ] Feature graphic
- [ ] Screenshots (landscape)
- [ ] Short description + full description (accurately represent gameplay)
- [ ] Listing matches privacy declarations and actual behaviour

## Final gate
- [ ] Everything in `PIKOFIND_MASTER_PLAN.md` §34 (MVP definition of done) satisfied
