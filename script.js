const DEFAULT_YEAR = "2027";

const state = {
  events: [],
  quickFilters: [],
  applied: {
    year: DEFAULT_YEAR,
    search: "",
    region: "",
    mainCategory: "",
    quarter: "",
    dateStatus: "",
  },
};

const filterIds = {
  year: "yearFilter",
  region: "regionFilter",
  mainCategory: "mainCategoryFilter",
  quarter: "quarterFilter",
  dateStatus: "dateStatusFilter",
};

const searchableFields = [
  "name",
  "city",
  "country",
  "region",
  "mainCategory",
  "bestFor",
  "shortDescription",
  "verticalTags",
  "audienceTags",
  "goalTags",
];

const elements = {
  eventsGrid: document.querySelector("#eventsGrid"),
  emptyState: document.querySelector("#emptyState"),
  resultCount: document.querySelector("#resultCount"),
  dataNote: document.querySelector("#dataNote"),
  activeFilters: document.querySelector("#activeFilters"),
  searchInput: document.querySelector("#searchInput"),
  applyButton: document.querySelector("#applyFilters"),
  clearButton: document.querySelector("#clearFilters"),
  emptyClearButton: document.querySelector(".empty-clear"),
  chips: [...document.querySelectorAll(".chip")],
};

async function init() {
  try {
    assertRequiredElements();
    const response = await fetch("events.json?v=2027-20261019-r4");
    if (!response.ok) throw new Error(`Unable to load events.json (${response.status})`);
    state.events = await response.json();
    populateFilters();
    bindEvents();
    render();
  } catch (error) {
    showLoadError(error);
  }
}

function assertRequiredElements() {
  const required = ["eventsGrid", "emptyState", "resultCount", "searchInput", "applyButton", "clearButton"];
  const missing = required.filter((key) => !elements[key]);
  const missingFilters = Object.values(filterIds).filter((id) => !document.querySelector(`#${id}`));

  if (missing.length || missingFilters.length) {
    throw new Error(`Missing widget element(s): ${[...missing, ...missingFilters].join(", ")}`);
  }
}

function showLoadError(error) {
  if (elements.eventsGrid) elements.eventsGrid.innerHTML = "";
  if (elements.emptyState) {
    elements.emptyState.hidden = false;
    const title = elements.emptyState.querySelector("h2");
    const text = elements.emptyState.querySelector("p");
    if (title) title.textContent = "Events could not be loaded.";
    if (text) text.textContent = "Refresh the page or run a local server from this folder.";
  }
  if (elements.resultCount) elements.resultCount.textContent = error.message;
  console.error(error);
}

function bindEvents() {
  document.querySelector("#yearFilter").addEventListener("change", (event) => {
    populateFilters(event.target.value);
  });
  Object.entries(filterIds).filter(([key]) => key !== "year").forEach(([, id]) => {
    document.querySelector(`#${id}`).addEventListener("change", updateFacetCounts);
  });
  elements.applyButton.addEventListener("click", applyFilters);
  elements.clearButton.addEventListener("click", clearAllFilters);
  elements.emptyClearButton?.addEventListener("click", clearAllFilters);

  elements.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyFilters();
    }
  });

  elements.chips.forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      toggleChip(chip);
      render();
    });
  });
}

function toggleChip(chip) {
  const type = chip.dataset.filterType;
  const field = chip.dataset.filterField || type;
  const value = chip.dataset.filterValue;
  if (!type || !field || !value) return;

  // A chip and a dropdown select the same dimension, so a chip replaces
  // an applied dropdown constraint instead of creating a contradiction.
  const dropdownKey = type === "category" ? "mainCategory" : type === "region" ? "region" : "";
  if (dropdownKey) {
    state.applied[dropdownKey] = "";
    document.querySelector(`#${filterIds[dropdownKey]}`).value = "";
  }

  const index = state.quickFilters.findIndex((filter) => (
    filter.type === type && filter.field === field && filter.value === value
  ));

  if (index >= 0) {
    state.quickFilters.splice(index, 1);
  } else {
    state.quickFilters.push({ type, field, value });
  }

  syncChips();
}

function applyFilters() {
  state.applied.search = elements.searchInput.value.trim().toLowerCase();
  Object.entries(filterIds).forEach(([key, id]) => {
    const select = document.querySelector(`#${id}`);
    state.applied[key] = select ? select.value : "";
  });
  state.quickFilters = state.quickFilters.filter((filter) => (
    !(filter.type === "category" && state.applied.mainCategory)
    && !(filter.type === "region" && state.applied.region)
    && state.events.some((event) => eventYear(event) === state.applied.year && eventMatchesFilter(event, filter.field, filter.value))
  ));
  syncChips();
  render();
}

function clearAllFilters() {
  elements.searchInput.value = "";
  Object.entries(filterIds).forEach(([key, id]) => {
    const select = document.querySelector(`#${id}`);
    if (select) select.value = key === "year" ? state.applied.year : "";
  });

  state.quickFilters = [];
  state.applied = {
    year: state.applied.year,
    search: "",
    region: "",
    mainCategory: "",
    quarter: "",
    dateStatus: "",
  };

  populateFilters();
  syncChips();
  render();
}

function populateFilters(year = state.applied.year) {
  Object.entries(filterIds).forEach(([key, id]) => {
    const select = document.querySelector(`#${id}`);
    if (!select) return;

    const previous = select.value;
    select.innerHTML = key === "year" ? "" : `<option value="">All ${labelFor(key)}</option>`;
    getOptionsForKey(key, year).forEach((option) => {
      const count = state.events.filter((event) => eventYear(event) === year && eventMatchesFilter(event, key, option)).length;
      select.appendChild(new Option(key === "year" ? option : `${optionLabel(key, option)} (${count})`, option));
    });
    select.value = key === "year" ? year : getOptionsForKey(key, year).includes(previous) ? previous : "";
  });
  updateFacetCounts();
}

function updateFacetCounts() {
  const year = document.querySelector("#yearFilter").value;
  Object.entries(filterIds).filter(([key]) => key !== "year").forEach(([key, id]) => {
    const select = document.querySelector(`#${id}`);
    [...select.options].filter((option) => option.value).forEach((option) => {
      const count = facetCount(key, option.value, year);
      option.textContent = `${optionLabel(key, option.value)} (${count})`;
      option.disabled = count === 0;
    });
  });
}

function facetCount(key, value, year) {
  const draft = Object.fromEntries(Object.entries(filterIds).map(([field, id]) => [field, document.querySelector(`#${id}`).value]));
  const quickFilters = state.quickFilters.filter((filter) => (
    !(filter.type === "category" && (key === "mainCategory" || draft.mainCategory))
    && !(filter.type === "region" && (key === "region" || draft.region))
  ));
  return state.events.filter((event) => (
    eventYear(event) === year
    && eventMatchesFilter(event, key, value)
    && Object.entries(draft).every(([field, selected]) => field === "year" || field === key || !selected || eventMatchesFilter(event, field, selected))
    && (!state.applied.search || searchText(event).includes(state.applied.search))
    && eventMatchesQuickFilters(event, quickFilters)
  )).length;
}

function getOptionsForKey(key, year = state.applied.year) {
  if (key === "year") return [...new Set(state.events.map(eventYear))].sort().reverse();
  const values = new Set();
  state.events.filter((event) => eventYear(event) === year).forEach((event) => {
    const options = key === "mainCategory" ? eventCategories(event) : [key === "dateStatus" ? eventDateStatus(event) : event[key]];
    options.filter(Boolean).forEach((value) => values.add(value));
  });

  if (key === "quarter") return [...values].sort();
  return [...values].sort((a, b) => a.localeCompare(b));
}

function labelFor(key) {
  return {
    region: "regions",
    mainCategory: "categories",
    quarter: "quarters",
    dateStatus: "statuses",
  }[key] || key;
}

function optionLabel(key, value) {
  if (key !== "dateStatus") return value;
  return { Announced: "Dates announced", TBA: "Dates pending", Watchlist: "Series to watch", Archive: "Archive" }[value] || value;
}

function eventDateStatus(event) {
  return event.dateStatus || "Archive";
}

function eventCategories(event) {
  const categories = new Set([event.mainCategory, ...(event.relatedCategories || [])]);
  const tags = event.verticalTags || [];
  if (tags.includes("App Growth") || (event.mainCategory === "Gaming" && tags.includes("Mobile Gaming"))) categories.add("Mobile / App Growth");
  if (tags.includes("AdTech") || tags.includes("Programmatic")) categories.add("AdTech / Programmatic");
  if (tags.includes("Affiliate")) categories.add("Affiliate / Performance");
  if (tags.includes("iGaming")) categories.add("iGaming / Betting");
  if (tags.includes("Gaming")) categories.add("Gaming");
  return [...categories].filter(Boolean);
}

function render() {
  const matches = filteredEvents().sort(sortByDate);
  const watchedCount = matches.filter((event) => eventDateStatus(event) === "Watchlist").length;
  const announcedCount = matches.length - watchedCount;
  elements.resultCount.textContent = announcedCount === 0 && watchedCount > 0
    ? `${watchedCount} matching series to watch · ${state.applied.year}`
    : `${announcedCount} matching ${announcedCount === 1 ? "event" : "events"}${watchedCount ? ` + ${watchedCount} series to watch` : ""} · ${state.applied.year}`;
  if (elements.dataNote) {
    const yearEvents = state.events.filter((event) => eventYear(event) === state.applied.year);
    const checkedDates = yearEvents.map((event) => event.verifiedOn).filter(Boolean).sort();
    const allVerified = yearEvents.length > 0 && checkedDates.length === yearEvents.length;
    const checked = allVerified
      ? parseEventDate(checkedDates[0]).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "";
    const pendingCount = yearEvents.filter((event) => event.dateStatus === "TBA").length;
    const watchCount = yearEvents.filter((event) => event.dateStatus === "Watchlist").length;
    elements.dataNote.textContent = allVerified
      ? `${yearEvents.length - pendingCount - watchCount} dated · ${pendingCount} dates pending${watchCount ? ` · ${watchCount} series awaiting a 2027 announcement` : ""} · Sources checked ${checked}.`
      : `${state.applied.year} archive · Original event listings.`;
  }
  const dated = matches.filter((event) => !["TBA", "Watchlist"].includes(event.dateStatus));
  const pending = matches.filter((event) => event.dateStatus === "TBA");
  const watchlist = matches.filter((event) => event.dateStatus === "Watchlist");
  const pendingHeading = pending.length
    ? `<div class="pending-heading"><h2>Dates pending</h2><p>These ${escapeHtml(state.applied.year)} editions are announced. Exact dates are pending or under review.</p></div>`
    : "";
  const watchHeading = watchlist.length
    ? `<div class="pending-heading watch-heading"><h2>Series to watch for ${escapeHtml(state.applied.year)}</h2><p>The next edition has not been announced. Locations refer to the last published edition.</p></div>`
    : "";
  elements.eventsGrid.innerHTML = dated.map(eventCard).join("") + pendingHeading + pending.map(eventCard).join("") + watchHeading + watchlist.map(eventCard).join("");
  elements.emptyState.hidden = matches.length > 0;
  renderActiveFilters();
  syncChips();
  updateFacetCounts();
  if (!matches.length) {
    elements.emptyState.querySelector("p").textContent = "No listings match this combination. Clear filters to see all events, or remove the quarter to include events awaiting dates.";
  }
}

function renderActiveFilters() {
  if (!elements.activeFilters) return;
  const labels = [];
  if (state.applied.search) labels.push(`Search: ${state.applied.search}`);
  for (const key of ["region", "mainCategory", "quarter", "dateStatus"]) {
    if (state.applied[key]) labels.push(optionLabel(key, state.applied[key]));
  }
  state.quickFilters.forEach((filter) => labels.push(filter.value));
  elements.activeFilters.textContent = labels.length ? `Active filters: ${labels.join(" · ")}` : "";
  elements.activeFilters.hidden = !labels.length;
}

function filteredEvents() {
  return state.events.filter((event) => {
    const passesYear = eventYear(event) === state.applied.year;
    const passesQuickFilters = eventMatchesQuickFilters(event);
    const passesSearch = !state.applied.search || searchText(event).includes(state.applied.search);
    const passesRegion = !state.applied.region || event.region === state.applied.region;
    const passesCategory = !state.applied.mainCategory || eventCategories(event).includes(state.applied.mainCategory);
    const passesQuarter = !state.applied.quarter || event.quarter === state.applied.quarter;
    const passesStatus = !state.applied.dateStatus || eventDateStatus(event) === state.applied.dateStatus;
    return passesYear && passesQuickFilters && passesSearch && passesRegion && passesCategory && passesQuarter && passesStatus;
  });
}

function eventYear(event) {
  return String(event.year || event.startDate.slice(0, 4));
}

function eventMatchesQuickFilters(event, quickFilters = state.quickFilters) {
  if (!quickFilters.length) return true;

  const groupedFilters = quickFilters.reduce((groups, filter) => {
    if (!groups[filter.type]) groups[filter.type] = [];
    groups[filter.type].push(filter);
    return groups;
  }, {});

  return Object.values(groupedFilters).every((filters) => (
    filters.some((filter) => eventMatchesFilter(event, filter.field, filter.value))
  ));
}

function eventMatchesFilter(event, key, value) {
  if (key === "mainCategory") return eventCategories(event).includes(value);
  if (key === "dateStatus") return eventDateStatus(event) === value;
  const eventValue = event[key];
  return Array.isArray(eventValue) ? eventValue.includes(value) : eventValue === value;
}

function searchText(event) {
  return searchableFields.map((key) => event[key] || "").join(" ").toLowerCase();
}

function sortByDate(a, b) {
  return (a.startDate || "9999").localeCompare(b.startDate || "9999") || a.name.localeCompare(b.name);
}

function syncChips() {
  elements.chips.forEach((chip) => {
    const isActive = state.quickFilters.some((filter) => (
      filter.type === chip.dataset.filterType
      && filter.field === (chip.dataset.filterField || chip.dataset.filterType)
      && filter.value === chip.dataset.filterValue
    ));

    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", isActive ? "true" : "false");
    const count = state.events.filter((event) => eventYear(event) === state.applied.year && eventMatchesFilter(event, chip.dataset.filterField || chip.dataset.filterType, chip.dataset.filterValue)).length;
    chip.disabled = !count;
    chip.title = `${count} listings in ${state.applied.year}`;
  });
}

function eventCard(event) {
  const watching = event.dateStatus === "Watchlist";
  const location = [event.city, event.country].filter(Boolean).join(", ") || event.country || "Location TBA";
  const website = event.website
    ? `<a class="event-link" href="${escapeAttribute(event.website)}" target="_blank" rel="noopener noreferrer">Visit Website</a>`
    : `<span class="event-link" aria-disabled="true">Website TBA</span>`;

  return `
    <article class="event-card${watching ? " is-watchlist" : ""}" data-event-id="${escapeAttribute(event.id)}" data-date-status="${escapeAttribute(eventDateStatus(event))}">
      <div class="card-header">
        <div>
          <h2>${escapeHtml(event.name)}</h2>
          <p class="location">${watching ? "Last published: " : ""}${escapeHtml(location)} · ${escapeHtml(event.region || "Region TBA")}</p>
          <p class="category">${escapeHtml(eventCategories(event).join(" · ") || "Category TBA")}</p>
        </div>
        <div class="date-badge">
          <span>${escapeHtml(formatMonthLabel(event))}</span>
          ${escapeHtml(formatDateRange(event))}
        </div>
      </div>
      <p class="description">${escapeHtml(event.shortDescription || "No description available yet.")}</p>
      ${watching ? `<p class="date-note">${escapeHtml(eventYear(event))} edition not announced.${event.lastEdition ? ` Latest verified edition: ${escapeHtml(event.lastEdition)}.` : ""}</p>` : event.announcedWindow ? `<p class="date-note">${escapeHtml(event.announcedWindow)} · Exact dates pending.</p>` : ""}
      ${event.dateNote ? `<p class="date-note">${escapeHtml(event.dateNote)}</p>` : ""}
      <p class="best-for"><strong>Best For:</strong> ${escapeHtml(event.bestFor || "Growth and partnership teams")}</p>
      ${event.accessNote ? `<p class="access-note">${escapeHtml(event.accessNote)}</p>` : ""}
      ${website}
      ${event.sourceUrl && event.verifiedOn ? `<p class="source-note"><a href="${escapeAttribute(event.sourceUrl)}" target="_blank" rel="noopener noreferrer">Source checked ${escapeHtml(parseEventDate(event.verifiedOn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }))}</a>${event.format ? ` · ${escapeHtml(event.format)}` : ""}</p>` : ""}
    </article>
  `;
}

function formatDateRange(event) {
  if (event.dateStatus === "Watchlist") return "Not announced";
  const start = formatDay(event.startDate);
  const end = formatDay(event.endDate);
  if (!start && !end) return "TBA";
  if (!end || start === end) return start;
  return `${start} - ${end}`;
}

function formatMonthLabel(event) {
  if (["TBA", "Watchlist"].includes(event.dateStatus)) return eventYear(event);
  const start = parseEventDate(event.startDate);
  const end = parseEventDate(event.endDate);
  if (!start) return event.month || "Date";
  if (!end || start.getMonth() === end.getMonth()) {
    return event.month || start.toLocaleDateString("en", { month: "long" });
  }
  return `${formatShortMonth(start)} / ${formatShortMonth(end)}`;
}

function formatDay(dateString) {
  const date = parseEventDate(dateString);
  return date ? String(date.getDate()) : (dateString || "");
}

function formatShortMonth(date) {
  return date.toLocaleDateString("en", { month: "short" });
}

function parseEventDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "" : date;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

init();
