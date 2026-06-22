const state = {
  events: [],
  quickFilters: [],
  applied: {
    search: "",
    region: "",
    mainCategory: "",
    quarter: "",
  },
};

const filterIds = {
  region: "regionFilter",
  mainCategory: "mainCategoryFilter",
  quarter: "quarterFilter",
};

const searchableFields = [
  "name",
  "city",
  "country",
  "region",
  "mainCategory",
  "bestFor",
  "shortDescription",
];

const elements = {
  eventsGrid: document.querySelector("#eventsGrid"),
  emptyState: document.querySelector("#emptyState"),
  resultCount: document.querySelector("#resultCount"),
  searchInput: document.querySelector("#searchInput"),
  applyButton: document.querySelector("#applyFilters"),
  clearButton: document.querySelector("#clearFilters"),
  emptyClearButton: document.querySelector(".empty-clear"),
  chips: [...document.querySelectorAll(".chip")],
};

async function init() {
  try {
    assertRequiredElements();
    const response = await fetch("events.json");
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
  render();
}

function clearAllFilters() {
  elements.searchInput.value = "";
  Object.values(filterIds).forEach((id) => {
    const select = document.querySelector(`#${id}`);
    if (select) select.value = "";
  });

  state.quickFilters = [];
  state.applied = {
    search: "",
    region: "",
    mainCategory: "",
    quarter: "",
  };

  syncChips();
  render();
}

function populateFilters() {
  Object.entries(filterIds).forEach(([key, id]) => {
    const select = document.querySelector(`#${id}`);
    if (!select) return;

    select.innerHTML = `<option value="">All ${labelFor(key)}</option>`;
    getOptionsForKey(key).forEach((option) => {
      select.appendChild(new Option(option, option));
    });
  });
}

function getOptionsForKey(key) {
  const values = new Set();
  state.events.forEach((event) => {
    if (event[key]) values.add(event[key]);
  });

  if (key === "quarter") return [...values].sort();
  return [...values].sort((a, b) => a.localeCompare(b));
}

function labelFor(key) {
  return {
    region: "regions",
    mainCategory: "categories",
    quarter: "quarters",
  }[key] || key;
}

function render() {
  const matches = filteredEvents().sort(sortByDate);
  elements.resultCount.textContent = `${matches.length} matching ${matches.length === 1 ? "event" : "events"}`;
  elements.eventsGrid.innerHTML = matches.map(eventCard).join("");
  elements.emptyState.hidden = matches.length > 0;
}

function filteredEvents() {
  return state.events.filter((event) => {
    const passesQuickFilters = eventMatchesQuickFilters(event);
    const passesSearch = !state.applied.search || searchText(event).includes(state.applied.search);
    const passesRegion = !state.applied.region || event.region === state.applied.region;
    const passesCategory = !state.applied.mainCategory || event.mainCategory === state.applied.mainCategory;
    const passesQuarter = !state.applied.quarter || event.quarter === state.applied.quarter;
    return passesQuickFilters && passesSearch && passesRegion && passesCategory && passesQuarter;
  });
}

function eventMatchesQuickFilters(event) {
  if (!state.quickFilters.length) return true;

  const groupedFilters = state.quickFilters.reduce((groups, filter) => {
    if (!groups[filter.type]) groups[filter.type] = [];
    groups[filter.type].push(filter);
    return groups;
  }, {});

  return Object.values(groupedFilters).every((filters) => (
    filters.some((filter) => eventMatchesFilter(event, filter.field, filter.value))
  ));
}

function eventMatchesFilter(event, key, value) {
  const eventValue = event[key];
  return Array.isArray(eventValue) ? eventValue.includes(value) : eventValue === value;
}

function searchText(event) {
  return searchableFields.map((key) => event[key] || "").join(" ").toLowerCase();
}

function sortByDate(a, b) {
  return a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name);
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
  });
}

function eventCard(event) {
  const location = [event.city, event.country].filter(Boolean).join(", ") || event.country || "Location TBA";
  const website = event.website
    ? `<a class="event-link" href="${escapeAttribute(event.website)}" target="_blank" rel="noopener noreferrer">Visit Website</a>`
    : `<span class="event-link" aria-disabled="true">Website TBA</span>`;

  return `
    <article class="event-card">
      <div class="card-header">
        <div>
          <h2>${escapeHtml(event.name)}</h2>
          <p class="location">${escapeHtml(location)} · ${escapeHtml(event.region || "Region TBA")}</p>
          <p class="category">${escapeHtml(event.mainCategory || "Category TBA")}</p>
        </div>
        <div class="date-badge">
          <span>${escapeHtml(event.month || "Date")}</span>
          ${escapeHtml(formatDateRange(event))}
        </div>
      </div>
      <p class="description">${escapeHtml(event.shortDescription || "No description available yet.")}</p>
      <p class="best-for"><strong>Best For:</strong> ${escapeHtml(event.bestFor || "Growth and partnership teams")}</p>
      ${website}
    </article>
  `;
}

function formatDateRange(event) {
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);
  if (!start && !end) return "TBA";
  if (!end || start === end) return start;
  return `${start} - ${end}`;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
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
