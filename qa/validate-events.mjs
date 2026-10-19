import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const events = JSON.parse(readFileSync(new URL('../events.json', import.meta.url)));
const current = events.filter(event => event.startDate.startsWith('2027-'));
assert.equal(new Set(events.map(event => event.id)).size, events.length, 'Unique IDs across years');
assert.equal(new Set(current.map(event => event.slug)).size, current.length, 'Unique 2027 slugs');
assert.ok(current.length > 0, '2027 calendar is populated');
for (const event of current) {
  for (const key of ['name', 'country', 'region', 'mainCategory', 'shortDescription', 'bestFor', 'sourceUrl', 'verifiedOn']) {
    assert.ok(event[key], `${event.id}: ${key} is present`);
  }
  for (const key of ['startDate', 'endDate']) {
    assert.match(event[key], /^2027-\d{2}-\d{2}$/, `${event.id}: ${key} belongs to 2027`);
    assert.equal(new Date(`${event[key]}T00:00:00Z`).toISOString().slice(0, 10), event[key], 'Calendar date is valid');
  }
  assert.ok(event.endDate >= event.startDate, `${event.id}: chronological date range`);
  const month = Number(event.startDate.slice(5, 7));
  assert.equal(event.quarter, `Q${Math.ceil(month / 3)}`, `${event.id}: correct quarter`);
  assert.equal(event.month, new Date(`${event.startDate}T00:00:00Z`).toLocaleDateString('en', {month: 'long', timeZone: 'UTC'}));
  assert.equal(event.dateStatus, 'Announced');
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
console.log(`PASS: ${current.length} dated 2027 records; ${events.length} records total; dates, IDs, fields, links and tags valid.`);
