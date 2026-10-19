# App Growth Event Radar 2027

BidMatrix's static event finder for mobile growth, gaming, iGaming, affiliate marketing, adtech and digital commerce. The widget opens on **2027**, with **121 events with organizer-announced dates and 2 announced editions awaiting dates**, checked on **19 October 2026**. The original **230 events from 2026** remain available in the Year selector.

Live URL: https://ksuuushaworkhard-design.github.io/bidmatrix-app-growth-event-radar-2026/

The URL deliberately stays the same so existing Wix iframes continue working. HTML, CSS and JavaScript only; no backend or build step.

## Behavior

- Year defaults to 2027. Select 2026 to browse the archive, then Apply.
- Search, Year, Region, Category and Quarter apply when clicking Apply or pressing Enter in search.
- Quick chips update immediately, with OR within a chip type and AND between chip types.
- Clear filters resets search, chips and the three dropdown filters within the currently applied year.
- Dated events sort by start date, then name. Announced editions awaiting exact dates appear in a separate Dates to be announced block with a 2027 / TBA badge. They match search, chips, region and category; a specific quarter excludes them.
- Date badges show the month once and numeric days: `JANUARY / 18 - 20`; cross-month events use `APR / MAY / 30 - 1`.
- Visit Website opens the organizer's site in a new tab with `noopener noreferrer`.
- The design retains Oswald + Roboto, dark panels and turquoise `#09CAB6` accents.

## Files

- `index.html`: search form and metadata
- `styles.css`: responsive widget styles
- `script.js`: filtering and card rendering
- `events.json`: 2026 archive plus dated and explicitly undated 2027 entries
- `data/2027-events.md`: complete 2027 list with new entries marked
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
