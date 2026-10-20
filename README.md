# App Growth Event Radar 2027

BidMatrix's static event finder for mobile growth, gaming, iGaming, affiliate marketing, adtech and digital commerce. The widget opens on **2027**, with **191 announced events (161 dated, 30 awaiting exact dates), plus 21 unannounced series to watch**, checked on **20 October 2026**. The Year selector also contains **228 historical 2026 listings**, whose date audit is partial.

Live URL: https://ksuuushaworkhard-design.github.io/bidmatrix-app-growth-event-radar-2026/

The URL deliberately stays the same so existing Wix iframes continue working. HTML, CSS and JavaScript only; no backend or build step.

## Behavior

- Year defaults to 2027. Select 2026 to browse the archive, then Apply.
- Search, Year, Region, Category and Quarter apply when clicking Apply or pressing Enter in search.
- Quick chips update immediately, with OR within a chip type and AND between chip types. Region/category chips replace the corresponding applied dropdown; choosing that dropdown replaces chips in the same dimension.
- Clear filters resets search, chips and the dropdown filters within the currently applied year.
- Dated events sort by start date, then name. Announced editions awaiting dates and unannounced series appear in separate sections. A specific quarter excludes both undated groups.
- Date badges show the month once and numeric days: `JANUARY / 18 - 20`; cross-month events use `APR / MAY / 30 - 1`.
- Visit Website opens the organizer's site in a new tab with `noopener noreferrer`.
- The design retains Oswald + Roboto, dark panels and turquoise `#09CAB6` accents.

## Files

- `index.html`: search form and metadata
- `styles.css`: responsive widget styles
- `script.js`: filtering and card rendering
- `events.json`: 2026 archive plus dated and explicitly undated 2027 entries
- `data/2027-events.md`: complete current list, separated by announcement status
- `data/2027-coverage-audit.md`: category/region coverage and filtering rules
- `data/2027-coverage-expansion.md`: 90 new listings and their sources
- `data/2027-watchlist.md`: month-only/TBA announcements, conflicting sources and recurring candidates
- `data/2027-sources.md`: organizer source register, date conventions and known pending announcements
- `qa/validate-events.mjs`: data validation
- `qa/2027-report.md`: release verification

## Local preview and checks

```sh
python3 -m http.server 8080 --bind 127.0.0.1
node --check script.js
node qa/validate-events.mjs
```

Open http://localhost:8080. Loading the HTML directly as a file will not allow the JSON fetch.

## Updating the calendar

Verify exact dates, edition and location on the organizer's own site. Do not advance old dates by one year. Keep recurring events without exact dates out of the dated calendar until the organizer announces them.

Add each event with a unique `E27-...` ID and slug. Preserve the existing fields and array tags. Use ISO `YYYY-MM-DD` dates, derive month and quarter from the start date, and add:

```json
{
  "dateStatus": "Announced",
  "sourceUrl": "https://organizer.example/event-2027/",
  "verifiedOn": "2026-10-19"
}
```

Keep the source register in sync. Categories, tags, descriptions and Best For are editorial summaries, not claims about confirmed speakers or attendees. Re-run validation and browser checks; update asset/data version strings when publishing.

## Embed in Wix

Use an Embed / website iframe with the existing URL, width 100%, and a height suitable for the event list (for example 1200px).

```html
<iframe
  src="https://ksuuushaworkhard-design.github.io/bidmatrix-app-growth-event-radar-2026/"
  title="BidMatrix App Growth Event Radar"
  width="100%"
  height="1200"
  style="border:0"
  loading="lazy"
></iframe>
```

Undated 2027 editions use an explicit `year: 2027`, `dateStatus: "TBA"` and empty startDate, endDate, month and quarter. Include them only when the organizer announces the 2027 edition; keep unannounced recurring series in the watchlist.

## Discovery and evidence

Category membership can overlap: mobile gaming events are also discoverable under Mobile / App Growth, while explicitly tagged affiliate/adtech events appear under those categories. Category counts are not additive. Filter options are year-specific, counts reflect other constraints, and zero-result options are disabled. Applied constraints are shown in an active-filter summary.

Unannounced recurring series use `dateStatus: "Watchlist"`, `status: "Watching"`, an explicit planning `year: 2027`, empty date/month/quarter fields, and a title without a claimed 2027 edition. Cards disclose that the edition is unannounced and location is from the last published edition. They are counted separately from announced events. Source links and checked dates are displayed on sourced cards; format and access restrictions are shown when documented.

## Verification — 20 October 2026

The current 2027 dataset contains 161 dated events, 30 announced editions awaiting exact dates, and 21 separately labelled unannounced series. App Growth Summit Paris 2027 is held in `data/verification-quarantine.json` because its page currently returns 404 and it is absent from the current organizer calendar. `data/2027-verification.json` records the reviewed facts and sources for every published 2027 entry.

All 325 original distinct website/source URLs across both years were checked for response, redirects and destination. HTTP 403/405 anti-bot responses and client TLS/timeouts are recorded separately from 404s and wrong destinations; they do not themselves prove an event is fake or cancelled. Browser/web retrieval was used where needed for 2027 sources.

The 2026 historical date audit remains partial. The archive is labelled accordingly; known cancellations, wrong dates, stale statuses and unrelated/generic links were corrected. IRCE + RetailX and the dated Mumbai mobile marketing listing are held for lack of an adequate current official source. The quarantine is preserved for later review, not treated as proof those events never existed.

Descriptions, categories, audience/goal tags and Best For are editorial summaries of the organizer material, not promises about attendance, access or business results. Sources were checked on the stated day; organizers can subsequently change details. See `data/verification-report-2026-10-20.md`.
