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

## Expanded research release — 19 October 2026

- Added 68 more organizer-announced events, bringing 2027 to 120 and the full dataset to 350.
- Original 282 event objects (230 for 2026, 52 from the first 2027 release) are unchanged.
- Unique IDs and slugs; no duplicate name/start-date/city tuples.
- All new event dates, month/quarter values, URLs, fields and arrays pass `node qa/validate-events.mjs`.
- Full source-linked list: `data/2027-events.md`. Month-only/TBA announcements, conflicts and recurring candidates: `data/2027-watchlist.md`.
- DigiMarCon series and AffPapa Madrid were held for conflicting organizer dates. Other unannounced editions were not extrapolated from 2026.
- 12 local browser assertions passed: 120 defaults; both Conversion editions; 16 Gaming + Europe events; 13 Q4 events; new cross-month badge (`APR / MAY`, `28 - 1`); 230-event archive; return to 120; external link security; no desktop overflow; zero widget console errors; 320px and 390px iframe layouts with 120 cards and zero overflow.
- App Growth category remains five exact-date events; expanded research adds Gaming, iGaming, AdTech, Affiliate, Digital Marketing, Retail and Tech coverage within the existing eight categories.
# Niche conference update — 19 October 2026

- 121 dated events + 2 organizer-announced 2027 editions awaiting dates; 353 total including the archive.
- Added Brand & AI Safety Summit Singapore (18 March), Unlocked Singapore (TBA), and Programmatic & Beyond Athens (TBA).
- TBA editions render after dated events under a separate heading with 2027 / TBA badges. No month, day or quarter is invented.
- Data validation and JavaScript syntax checks passed; all 350 earlier records preserved exactly.
- Eight local browser assertions passed: initial count/order, TBA search, exclusion from a specific quarter, Enter + Q1 dated search, Programmatic + Europe chips, 230-event archive, Clear preserving year, and search matching both TBA editions.
- Both 320 px and 390 px iframe previews passed with 123 cards and zero overflowing elements. No browser console errors.
- Publication status is recorded separately after the deployment check.

