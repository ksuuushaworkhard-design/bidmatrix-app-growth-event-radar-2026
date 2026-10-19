# Event Radar 2027 release checks

Checked 19 October 2026 against the local release preview in the Codex Chromium browser.

## Data

- 52 events with exact organizer-announced 2027 dates, across all eight existing categories.
- 230 original 2026 records match the previous published JSON objects exactly.
- 282 total records; unique IDs, unique 2027 slugs, valid ISO dates, chronological ranges, correct months/quarters, HTTPS links, nonempty tags and provenance fields.
- All 52 source links are recorded in `data/2027-sources.md`.
- `node --check script.js`, `node qa/validate-events.mjs` and `git diff --check` passed.

## Browser checks

21 assertions passed:

- Initial view renders 52 events with 2027 selected.
- Search waits for Apply; MAU returns one correct event.
- Enter applies a replacement query for d3con.
- Clear resets the 2027 view.
- Gaming + Europe returns six events.
- App Growth + Gaming + Europe returns eight events (OR within category; AND with region).
- Dropdowns wait for Apply; Europe + Gaming + Q3 returns two events.
- Year selection waits for Apply; 2026 renders all 230 archived events.
- An unmatched search shows the empty state; its Clear button restores the current year.
- Archive Clear preserves 2026.
- Cross-month dates retain `APR / MAY` plus `30 - 1`.
- Returning to 2027 restores 52 events.
- All Visit Website links use a new tab and `noopener noreferrer`.
- Desktop has no horizontal overflow.
- Embedded 320px and 390px layouts each render 52 cards with no horizontal overflow or overflowing form/card elements.

Main widget browser console: no errors observed. The responsive QA page renders the actual app inside same-origin iframes; this checks narrow embed widths rather than emulating a specific physical phone. Existing Oswald/Roboto styling, turquoise accents and compact date badges are preserved.

## Scope

This is the first verified 2027 calendar, not a claim that all recurring conferences have announced their dates. Q4 and APAC coverage is currently limited. Month-only and TBA announcements are excluded from the dated list. No live Wix embed was available for a host-page integration test.
