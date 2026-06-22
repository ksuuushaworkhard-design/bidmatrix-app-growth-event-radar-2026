# App Growth Event Radar 2026

Static BidMatrix widget for finding 2026 mobile growth, adtech, gaming, iGaming, affiliate and marketing events. It is designed to be embedded into a Wix landing page by iframe, so the interface starts directly with a compact event search form instead of a standalone hero or lead form.

The app uses plain HTML, CSS and JavaScript. There is no backend and no build step.

## Files

- `index.html` - page structure and product copy
- `styles.css` - BidMatrix dark/tech visual style
- `script.js` - search, filters, sorting and card rendering
- `events.json` - local event database exported from the `Public Events` sheet

## Widget Behavior

- Search runs across event names, city, country, region, category, best-for text and descriptions.
- Filters are intentionally minimal for MVP: Region, Category and Quarter.
- Search and filters update results only after clicking Apply or pressing Enter in the search input.
- Active controls use AND logic.
- Clear filters resets the search form and shows all events again.
- Visit Website links open in a new tab with `noopener noreferrer`.

## Run Locally

Because the app loads `events.json`, use a simple local server from this folder:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Static hosts such as Netlify, Vercel and GitHub Pages will serve the JSON file normally.

## Update events.json

1. Update the `Public Events` sheet in `BidMatrix_App_Growth_Event_Radar_2026_CLEAN_READY_FOR_CODING.xlsx`.
2. Export the sheet to JSON with the same field names used in `events.json`.
3. Keep tag fields as arrays:
   - `verticalTags`
   - `audienceTags`
   - `goalTags`
4. Keep dates in `YYYY-MM-DD` format for correct sorting.

Expected event object shape:

```json
{
  "id": "E26-001",
  "slug": "lead-generation-world-2026",
  "status": "Past",
  "name": "Lead Generation World 2026",
  "startDate": "2026-01-04",
  "endDate": "2026-01-06",
  "month": "January",
  "quarter": "Q1",
  "region": "North America",
  "country": "USA",
  "city": "San Diego",
  "mainCategory": "Affiliate / Performance",
  "verticalTags": ["Lead Generation", "Affiliate", "Performance Marketing"],
  "audienceTags": ["Affiliates", "Advertisers"],
  "goalTags": ["Lead generation", "Networking"],
  "bestFor": "Lead buyers, lead sellers, performance marketers",
  "shortDescription": "Lead generation event for lead buyers, networks, publishers and performance marketers.",
  "website": "https://www.leadgenerationworld.com/"
}
```

## Deploy to Netlify

1. Create a new Netlify site.
2. Choose manual deploy or connect a Git repo.
3. Set the publish directory to the project folder containing `index.html`.
4. No build command is required.
5. Deploy and test the live URL.

## Embed in Wix

1. Deploy the app to Netlify, Vercel or GitHub Pages.
2. In Wix, add an Embed element.
3. Choose iframe / embed a site.
4. Paste the hosted app URL.
5. Set the iframe width to `100%` and choose a height that fits the event list, for example `900px` to `1200px`.

Example iframe:

```html
<iframe
  src="https://your-event-radar-url.netlify.app"
  width="100%"
  height="900"
  style="border:0; border-radius:16px;"
  loading="lazy"
></iframe>
```
