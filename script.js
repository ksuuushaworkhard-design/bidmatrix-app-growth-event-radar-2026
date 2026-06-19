const state = {
  events: [],
  quickFilters: [],
  filters: {
    region: "",
    country: "",
    mainCategory: "",
    verticalTags: "",
    audienceTags: "",
    goalTags: "",
    month: "",
    quarter: "",
    status: "",
  },
  search: "",
  sort: "soonest",
};

const filterIds = {
  region: "regionFilter",
  country: "countryFilter",
  mainCategory: "mainCategoryFilter",
  verticalTags: "verticalTagsFilter",
  audienceTags: "audienceTagsFilter",
  goalTags: "goalTagsFilter",
  month: "monthFilter",
  quarter: "quarterFilter",
  status: "statusFilter",
};

const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const searchableFields = [
  "name",
  "country",
  "city",
  "region",
  "mainCategory",
  "bestFor",
  "shortDescription",
];

const eventsGrid = document.querySelector("#eventsGrid");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const clearFiltersButton = document.querySelector("#clearFilters");
const emptyClearButton = document.querySelector(".empty-clear");
const chips = [...document.querySelectorAll(".chip")];

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
  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    render();
  });

  sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  Object.entries(filterIds).forEach(([key, id]) => {
    document.querySelector(`#${id}`).addEventListener("change", (event) => {
      state.filters[key] = event.target.value;
      syncChips();
      render();
    });
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const type = chip.dataset.filterType;
      const field = chip.dataset.filterField || type;
      const value = chip.dataset.filterValue;
      const index = state.quickFilters.findIndex((filter) => (
        filter.type === type && filter.field === field && filter.value === value
      ));
      if (index >= 0) {
        state.quickFilters.splice(index, 1);
      } else {
        state.quickFilters.push({ type, field, value });
      }
      syncChips();
      render();
    });
  });

  clearFiltersButton.addEventListener("click", clearAllFilters);
  emptyClearButton.addEventListener("click", clearAllFilters);
}

function clearAllFilters() {
    state.search = "";
    state.sort = "soonest";
    state.quickFilters = [];
    searchInput.value = "";
    sortSelect.value = "soonest";
    Object.keys(state.filters).forEach((key) => {
      state.filters[key] = "";
      document.querySelector(`#${filterIds[key]}`).value = "";
    });
    syncChips();
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
    const value = event[key];
    if (Array.isArray(value)) {
      value.forEach((item) => item && values.add(item));
    } else if (value) {
      values.add(value);
    }
  });

  const sorted = [...values].sort((a, b) => a.localeCompare(b));
  if (key === "month") {
    return sorted.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
  }
  if (key === "quarter") {
    return sorted.sort();
  }
  return sorted;
}

function labelFor(key) {
  return {
    region: "regions",
    country: "countries",
    mainCategory: "categories",
    verticalTags: "vertical tags",
    audienceTags: "audiences",
    goalTags: "goals",
    month: "months",
    quarter: "quarters",
    status: "statuses",
  }[key];
}

function render() {
  const matches = filteredEvents().sort(sortEvents);
  resultCount.textContent = `${matches.length} matching ${matches.length === 1 ? "event" : "events"}`;
  eventsGrid.innerHTML = matches.map(eventCard).join("");
  emptyState.hidden = matches.length > 0;
}

function filteredEvents() {
  return state.events.filter((event) => {
    const passesSearch = !state.search || searchText(event).includes(state.search);
    const passesQuickFilters = eventMatchesQuickFilters(event);
    const passesFilters = Object.entries(state.filters).every(([key, value]) => {
      if (!value) return true;
      const eventValue = event[key];
      return Array.isArray(eventValue) ? eventValue.includes(value) : eventValue === value;
    });
    return passesSearch && passesQuickFilters && passesFilters;
  });
}

function eventMatchesQuickFilters(event) {
  if (!state.quickFilters.length) return true;

  const groupedFilters = state.quickFilters.reduce((groups, filter) => {
    if (!groups[filter.type]) groups[filter.type] = [];
    groups[filter.type].push(filter);
    return groups;
  }, {});

  return Object.values(groupedFilters).every((filters) => {
    return filters.some((filter) => (
      eventMatchesFilter(event, filter.field, filter.value)
    ));
  });
}

function eventMatchesFilter(event, key, value) {
  const eventValue = event[key];
  return Array.isArray(eventValue) ? eventValue.includes(value) : eventValue === value;
}

function searchText(event) {
  const fieldText = searchableFields.map((key) => event[key] || "").join(" ");
  const tagText = [
    ...event.verticalTags,
    ...event.audienceTags,
    ...event.goalTags,
  ].join(" ");
  return `${fieldText} ${tagText}`.toLowerCase();
}

function sortEvents(a, b) {
  if (state.sort === "az") {
    return a.name.localeCompare(b.name);
  }
  if (state.sort === "region") {
    return a.region.localeCompare(b.region) || a.startDate.localeCompare(b.startDate);
  }
  return a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name);
}

function syncChips() {
  chips.forEach((chip) => {
    chip.classList.toggle(
      "is-active",
      state.quickFilters.some((filter) => (
        filter.type === chip.dataset.filterType
        && filter.field === (chip.dataset.filterField || chip.dataset.filterType)
        && filter.value === chip.dataset.filterValue
      ))
    );
    chip.setAttribute("aria-pressed", chip.classList.contains("is-active") ? "true" : "false");
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
      ${tagBlock("Vertical", event.verticalTags)}
      ${tagBlock("Audience", event.audienceTags)}
      ${tagBlock("Goal", event.goalTags)}
      <p class="description">${escapeHtml(event.shortDescription || "No description available yet.")}</p>
      <p class="best-for"><strong>Best For:</strong> ${escapeHtml(event.bestFor || "Growth and partnership teams")}</p>
      ${website}
    </article>
  `;
}

function tagBlock(label, tags) {
  if (!tags.length) return "";
  const visibleTags = tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  const hiddenCount = tags.length > 3 ? `<span class="tag">+${tags.length - 3} more</span>` : "";
  return `
    <div>
      <span class="meta-label">${label}</span>
      <div class="tag-group">${visibleTags}${hiddenCount}</div>
    </div>
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
