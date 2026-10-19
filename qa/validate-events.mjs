import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const events = JSON.parse(readFileSync(new URL('../events.json', import.meta.url)));
const current = events.filter(event => String(event.year || event.startDate.slice(0, 4)) === '2027');
const pending = current.filter(event => event.dateStatus === 'TBA');
const watchlist = current.filter(event => event.dateStatus === 'Watchlist');
const dated = current.filter(event => event.dateStatus === 'Announced');
assert.equal(new Set(events.map(event => event.id)).size, events.length, 'Unique IDs across years');
assert.equal(new Set(current.map(event => event.slug)).size, current.length, 'Unique 2027 slugs');
assert.ok(current.length > 0, '2027 calendar is populated');
for (const event of current) {
  for (const key of ['name', 'country', 'region', 'mainCategory', 'shortDescription', 'bestFor', 'sourceUrl', 'verifiedOn']) {
    assert.ok(event[key], `${event.id}: ${key} is present`);
  }
  if (['TBA', 'Watchlist'].includes(event.dateStatus)) {
    assert.equal(event.year, 2027, 'Undated events have an explicit edition year');
    for (const key of ['startDate', 'endDate', 'month', 'quarter']) assert.equal(event[key], '', `${event.id}: no fabricated ${key}`);
    if (event.dateStatus === 'Watchlist') {
      assert.equal(event.status, 'Watching');
      assert.ok(!event.name.includes('2027'), `${event.id}: unannounced edition is not claimed in the title`);
      assert.ok(event.locationStatus, `${event.id}: last-published location is disclosed`);
    }
  } else {
    for (const key of ['startDate', 'endDate']) {
      assert.match(event[key], /^2027-\d{2}-\d{2}$/, `${event.id}: ${key} belongs to 2027`);
      assert.equal(new Date(`${event[key]}T00:00:00Z`).toISOString().slice(0, 10), event[key], 'Calendar date is valid');
    }
    assert.ok(event.endDate >= event.startDate, `${event.id}: chronological date range`);
    const month = Number(event.startDate.slice(5, 7));
    assert.equal(event.quarter, `Q${Math.ceil(month / 3)}`, `${event.id}: correct quarter`);
    assert.equal(event.month, new Date(`${event.startDate}T00:00:00Z`).toLocaleDateString('en', {month: 'long', timeZone: 'UTC'}));
    assert.equal(event.dateStatus, 'Announced');
  }
  assert.match(event.verifiedOn, /^\d{4}-\d{2}-\d{2}$/);
  for (const key of ['website', 'sourceUrl']) assert.equal(new URL(event[key]).protocol, 'https:', `${event.id}: HTTPS ${key}`);
  for (const key of ['verticalTags', 'audienceTags', 'goalTags']) assert.ok(Array.isArray(event[key]) && event[key].length, `${event.id}: ${key}`);
}
// Representative dates that changed materially from the old calendar.
for (const [name, start, city] of [
  ['MAU Vegas 2027', '2027-05-04', 'Las Vegas'],
  ['Lead Generation World 2027', '2027-02-17', 'Chula Vista (San Diego Bay)'],
  ['SBC Summit Europe 2027', '2027-04-19', 'Amsterdam'],
  ['Social Media Marketing World 2027', '2027-04-01', 'Anaheim'],
]) {
  const event = current.find(event => event.name === name);
  assert.equal(event?.startDate, start);
  assert.equal(event?.city, city);
}
assert.ok(dated.some(event => event.name === 'Brand & AI Safety Summit Singapore 2027' && event.startDate === '2027-03-18'));
assert.ok(pending.some(event => event.name === 'Gamesforum Hamburg 2027'));
assert.ok(watchlist.some(event => event.name === 'Growth Phestival'));
const duplicateKeys = current.map(event => `${event.name.toLowerCase()}|${event.startDate}|${event.city.toLowerCase()}`);
assert.equal(new Set(duplicateKeys).size, current.length, 'No duplicate name/date/city listings');
assert.equal(dated.length + pending.length + watchlist.length, current.length, 'Every 2027 listing has a recognized date status');
console.log(`PASS: ${dated.length} dated + ${pending.length} TBA + ${watchlist.length} watchlist; ${events.length} total; dates, IDs, fields, links and tags valid.`);
