const state = {
  events: [],
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

const eventsGrid = document.querySelector("#eventsGrid");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const applyFiltersButton = document.querySelector("#applyFilters");
const clearFiltersButton = document.querySelector("#clearFilters");
const emptyClearButton = document.querySelector(".empty-clear");

async function init() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error(`Unable to load events.json (${response.status})`);
    state.events = await response.json();
    populateFilters();
    bindEvents();
    render();
  } catch (error) {
    eventsGrid.innerHTML = "";
    emptyState.hidden = false;
    emptyState.querySelector("h2").textContent = "Events could not be loaded.";
    emptyState.querySelector("p").textContent = "Run a local server from this folder, then open the local URL.";
    resultCount.textContent = error.message;
  }
}

function bindEvents() {
  applyFiltersButton.addEventListener("click", applyFilters);
  clearFiltersButton.addEventListener("click", clearAllFilters);
  emptyClearButton.addEventListener("click", clearAllFilters);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyFilters();
    }
  });
}

function applyFilters() {
  state.applied.search = searchInput.value.trim().toLowerCase();
  Object.entries(filterIds).forEach(([key, id]) => {
    state.applied[key] = document.querySelector(`#${id}`).value;
  });
  render();
}

function clearAllFilters() {
  searchInput.value = "";
  Object.values(filterIds).forEach((id) => {
    document.querySelector(`#${id}`).value = "";
  });
  state.applied = {
    search: "",
    region: "",
    mainCategory: "",
    quarter: "",
  };
  render();
}

function populateFilters() {
  Object.keys(filterIds).forEach((key) => {
    const options = getOptionsForKey(key);
    const select = document.querySelector(`#${filterIds[key]}`);
    select.innerHTML = `<option value="">All ${labelFor(key)}</option>`;
    options.forEach((option) => {
      select.appendChild(new Option(option, option));
    });
  });
}

function getOptionsForKey(key) {
  const values = new Set();
  state.events.forEach((event) => {
    if (event[key]) values.add(event[key]);
  });

  if (key === "quarter") {
    return [...values].sort();
  }

  return [...values].sort((a, b) => a.localeCompare(b));
}

function labelFor(key) {
  return {
    region: "regions",
    mainCategory: "categories",
    quarter: "quarters",
  }[key];
}

function render() {
  const matches = filteredEvents().sort(sortByDate);
  resultCount.textContent = `${matches.length} matching ${matches.length === 1 ? "event" : "events"}`;
  eventsGrid.innerHTML = matches.map(eventCard).join("");
  emptyState.hidden = matches.length > 0;
}

function filteredEvents() {
  return state.events.filter((event) => {
    const passesSearch = !state.applied.search || searchText(event).includes(state.applied.search);
    const passesRegion = !state.applied.region || event.region === state.applied.region;
    const passesCategory = !state.applied.mainCategory || event.mainCategory === state.applied.mainCategory;
    const passesQuarter = !state.applied.quarter || event.quarter === state.applied.quarter;
    return passesSearch && passesRegion && passesCategory && passesQuarter;
  });
}

function searchText(event) {
  return searchableFields.map((key) => event[key] || "").join(" ").toLowerCase();
}

function sortByDate(a, b) {
  return a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name);
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
