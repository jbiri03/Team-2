const events = [
  { id: "impact-ai", title: "AI for Impact Hackathon", organizer: "Sample organizer · preview content", topic: "AI & data", category: ["AI", "Social impact"], date: "2026-10-17", location: "Austin, TX", format: "In-person", cost: "Free", mark: "AI", art: "art-ai", label: "BUILD FOR GOOD", beginner: true, student: "required", undergraduate: "yes", outsideUniversity: "yes", international: "unknown", age: { min: 18, max: null }, geography: "US only", invitation: "open", teamMin: 1, teamMax: 4, solo: "yes", teamFormation: "either", allMembersRegister: "yes", description: "A sample event listing for a weekend of building practical AI tools for community challenges. All details are illustrative." },
  { id: "climate-sprint", title: "Climate Tech Build Sprint", organizer: "Sample organizer · preview content", topic: "Climate", category: ["Climate"], date: "2026-10-24", location: "Online", format: "Virtual", cost: "Free", mark: "↗", art: "art-climate", label: "BUILD A GREENER FUTURE", beginner: true, student: "not-required", undergraduate: "yes", outsideUniversity: "yes", international: "yes", age: { min: null, max: null }, geography: "Worldwide", invitation: "open", teamMin: 1, teamMax: 5, solo: "yes", teamFormation: "either", allMembersRegister: "no", description: "A sample virtual sprint focused on ideas for climate resilience, energy, and sustainability. All details are illustrative." },
  { id: "civic-makers", title: "Civic Makers Weekend", organizer: "Sample organizer · preview content", topic: "Social impact", category: ["Social impact"], date: "2026-11-06", location: "Chicago, IL", format: "Hybrid", cost: "Not confirmed", mark: "C", art: "art-civic", label: "MAKE AN IMPACT", beginner: true, student: "required", undergraduate: "yes", outsideUniversity: "no", international: "unknown", age: { min: 18, max: null }, geography: "Illinois, US", invitation: "unknown", teamMin: 2, teamMax: 4, solo: "no", teamFormation: "bring-team", allMembersRegister: "yes", description: "A sample civic technology weekend bringing builders together to prototype tools for local communities. All details are illustrative." },
  { id: "open-source", title: "Open Source Launchpad", organizer: "Sample organizer · preview content", topic: "Web development", category: ["Web3"], date: "2026-11-14", location: "Online", format: "Virtual", cost: "Free", mark: "</>", art: "art-dev", label: "SHIP SOMETHING OPEN", beginner: true, student: "not-required", undergraduate: "yes", outsideUniversity: "yes", international: "yes", age: { min: null, max: null }, geography: "Worldwide", invitation: "open", teamMin: 1, teamMax: 5, solo: "yes", teamFormation: "organizer-match", allMembersRegister: "yes", description: "A sample event for first-time and experienced contributors to build in the open. All details are illustrative." },
  { id: "health-hacks", title: "Health Futures Hackathon", organizer: "Sample organizer · preview content", topic: "Health", category: ["Health", "AI"], date: "2026-11-21", location: "Boston, MA", format: "In-person", cost: "Paid", mark: "+", art: "art-health", label: "REIMAGINE WELLBEING", beginner: false, student: "required", undergraduate: "unknown", outsideUniversity: "yes", international: "unknown", age: { min: 18, max: 30 }, geography: "US only", invitation: "invite", teamMin: 2, teamMax: 4, solo: "no", teamFormation: "bring-team", allMembersRegister: "unknown", description: "A sample health innovation event focused on technology for better care and wellbeing. All details are illustrative." },
  { id: "data-day", title: "Data for Everyone Challenge", organizer: "Sample organizer · preview content", topic: "AI & data", category: ["AI", "Social impact"], date: "2026-12-05", location: "Online", format: "Virtual", cost: "Free", mark: "D", art: "art-web", label: "TURN DATA INTO IDEAS", beginner: true, student: "not-required", undergraduate: "yes", outsideUniversity: "yes", international: "yes", age: { min: 16, max: null }, geography: "Worldwide", invitation: "open", teamMin: 1, teamMax: 4, solo: "yes", teamFormation: "either", allMembersRegister: "yes", description: "A sample online data challenge exploring accessible, responsible uses of data. All details are illustrative." },
  { id: "web3-lab", title: "Web3 Open Build", organizer: "Sample organizer · preview content", topic: "Web3", category: ["Web3"], date: "2026-12-12", location: "New York, NY", format: "In-person", cost: "Not confirmed", mark: "◇", art: "art-web", label: "BUILD THE NEXT WEB", beginner: false, student: "unknown", undergraduate: "unknown", outsideUniversity: "unknown", international: "unknown", age: null, geography: "Needs confirmation", invitation: "unknown", teamMin: null, teamMax: null, solo: "unknown", teamFormation: "unknown", allMembersRegister: "unknown", description: "A sample gathering to experiment with decentralized applications and open protocols. All details are illustrative." },
  { id: "green-city", title: "Greener Cities Hack Day", organizer: "Sample organizer · preview content", topic: "Climate", category: ["Climate", "Social impact"], date: "2027-01-09", location: "Online", format: "Virtual", cost: "Free", mark: "G", art: "art-climate", label: "IDEAS FOR BETTER CITIES", beginner: true, student: "not-required", undergraduate: "yes", outsideUniversity: "yes", international: "unknown", age: { min: null, max: null }, geography: "US and Canada", invitation: "open", teamMin: 1, teamMax: 6, solo: "yes", teamFormation: "either", allMembersRegister: "yes", description: "A sample one-day event for ideas that can make cities more sustainable and livable. All details are illustrative." },
  { id: "student-build", title: "First Build Student Jam", organizer: "Sample organizer · preview content", topic: "Beginner-friendly", category: ["AI", "Health"], date: "2027-01-23", location: "Seattle, WA", format: "Hybrid", cost: "Free", mark: "✦", art: "art-ai", label: "NO EXPERIENCE NEEDED", beginner: true, student: "required", undergraduate: "yes", outsideUniversity: "yes", international: "yes", age: { min: 16, max: 25 }, geography: "US only", invitation: "open", teamMin: 1, teamMax: 4, solo: "yes", teamFormation: "organizer-match", allMembersRegister: "yes", description: "A sample beginner-friendly event designed for curious students and first-time hackers. All details are illustrative." }
];

const saved = new Set(JSON.parse(localStorage.getItem("hackscout-saved") || "[]"));
let activeCategory = "All";
let savedOnly = false;
let visibleCount = 6;
let showMoreCategories = false;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function formatDate(iso, options = { month: "short", day: "numeric" }) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", options);
}
function updateSavedCount() {
  $("#saved-count").textContent = saved.size;
  localStorage.setItem("hackscout-saved", JSON.stringify([...saved]));
}
function eligibilityMatches(event) {
  const student = $("#student-filter").value;
  const undergraduate = $("#undergrad-filter").value;
  const outsideUniversity = $("#outside-school-filter").value;
  const international = $("#international-filter").value;
  const ageRule = $("#age-filter").value;
  const myAge = $("#my-age-filter").value === "" ? null : Number($("#my-age-filter").value);
  const geography = $("#geography-filter").value.trim().toLowerCase();
  const invitation = $("#invitation-filter").value;
  const teamSize = $("#team-size-filter").value === "" ? null : Number($("#team-size-filter").value);
  const participation = $("#participation-filter").value;
  const teamFormation = $("#team-formation-filter").value;
  const membersRegister = $("#members-register-filter").value;
  const triState = (selected, actual) => !selected || actual === selected;

  if (myAge !== null && (!Number.isInteger(myAge) || myAge < 1 || myAge > 120)) return false;
  if (!triState(student, event.student)) return false;
  if (!triState(undergraduate, event.undergraduate)) return false;
  if (!triState(outsideUniversity, event.outsideUniversity)) return false;
  if (!triState(international, event.international)) return false;
  if (!triState(invitation, event.invitation)) return false;
  if (!triState(teamFormation, event.teamFormation)) return false;
  if (!triState(membersRegister, event.allMembersRegister)) return false;
  if (ageRule === "unknown" && event.age !== null) return false;
  if (ageRule === "none" && (!event.age || event.age.min !== null || event.age.max !== null)) return false;
  if (ageRule === "restricted" && (!event.age || (event.age.min === null && event.age.max === null))) return false;
  if (myAge !== null && (!event.age || (event.age.min !== null && myAge < event.age.min) || (event.age.max !== null && myAge > event.age.max))) return false;
  if (geography && !event.geography.toLowerCase().includes(geography) && !/worldwide|global/i.test(event.geography)) return false;
  if (teamSize !== null && (event.teamMin === null || event.teamMax === null || teamSize < event.teamMin || teamSize > event.teamMax)) return false;
  if (participation === "solo" && event.solo !== "yes") return false;
  if (participation === "team" && (event.solo !== "no" || event.teamMin === null || event.teamMin < 2)) return false;
  return true;
}
function getFilteredEvents() {
  const keyword = $("#keyword-input").value.trim().toLowerCase();
  const location = $("#location-input").value.trim().toLowerCase();
  const format = $("#format-filter").value;
  const cost = $("#cost-filter").value;
  const withinDays = Number($("#when-filter").value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result = events.filter((event) => {
    const haystack = `${event.title} ${event.organizer} ${event.topic} ${event.location} ${event.format} ${event.cost} ${event.category.join(" ")}`.toLowerCase();
    const eventDate = new Date(`${event.date}T00:00:00`);
    const daysUntil = (eventDate - today) / 86400000;
    const categoryMatches = activeCategory === "All" ||
      (activeCategory === "Beginner" ? event.beginner : event.category.some((category) => category.toLowerCase() === activeCategory.toLowerCase()));
    const locationMatches = !location || event.location.toLowerCase().includes(location) ||
      (["online", "virtual", "remote"].some((word) => location.includes(word)) && event.format === "Virtual");
    return haystack.includes(keyword) && locationMatches && categoryMatches &&
      (!format || event.format === format) && (!cost || event.cost === cost) &&
      (!withinDays || (daysUntil >= 0 && daysUntil <= withinDays)) && (!savedOnly || saved.has(event.id)) &&
      eligibilityMatches(event);
  });
  const sort = $("#sort-select").value;
  result.sort((a, b) => sort === "name" ? a.title.localeCompare(b.title) : sort === "latest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  return result;
}
function renderEvents() {
  const filtered = getFilteredEvents();
  const grid = $("#event-grid");
  const shown = filtered.slice(0, visibleCount);
  grid.innerHTML = shown.map((event) => `
    <article class="event-card">
      <div class="card-art ${event.art}">
        <span class="art-stamp">${escapeHtml(event.mark)}</span><span class="art-label">${escapeHtml(event.label)}</span>
        <button class="save-button ${saved.has(event.id) ? "saved" : ""}" data-save="${event.id}" aria-label="${saved.has(event.id) ? "Remove saved event" : "Save event"}">${saved.has(event.id) ? "♥" : "♡"}</button>
      </div>
      <div class="card-body">
        <div class="card-tags"><span class="event-topic">${escapeHtml(event.topic)}</span><span class="sample-tag">SAMPLE</span></div>
        <h4 class="card-title">${escapeHtml(event.title)}</h4><div class="card-organizer">${escapeHtml(event.organizer)}</div><div class="eligibility-quick">${event.student === "required" ? "Student status required" : event.student === "not-required" ? "Student status not required" : "Student status: needs confirmation"}</div>
        <div class="card-meta"><span class="meta-item"><span>▦</span>${formatDate(event.date, { month: "short", day: "numeric" })}</span><span class="meta-item"><span>⌖</span>${escapeHtml(event.location)}</span></div>
        <div class="card-bottom"><span class="format-badge">${escapeHtml(event.format)} · ${escapeHtml(event.cost)}</span><button class="card-detail" data-details="${event.id}">Event details <span>→</span></button></div>
      </div>
    </article>`).join("");
  $("#no-results").hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
  $("#load-more").hidden = filtered.length <= visibleCount;
  $("#results-title").innerHTML = `${savedOnly ? "Saved events" : "Upcoming hackathons"} <span id="result-count">(${filtered.length})</span>`;
  $("#results-description").textContent = savedOnly ? "Your saved events, all in one place." : "Fresh opportunities to learn, create, and meet your people.";
  const filterIds = ["format-filter", "when-filter", "cost-filter", "student-filter", "undergrad-filter", "outside-school-filter", "international-filter", "age-filter", "my-age-filter", "geography-filter", "invitation-filter", "team-size-filter", "participation-filter", "team-formation-filter", "members-register-filter"];
  const activeCount = filterIds.reduce((total, id) => total + Number(Boolean($(`#${id}`).value)), 0);
  $("#filter-count").textContent = activeCount ? `(${activeCount})` : "";
  $$(".save-button").forEach((button) => button.addEventListener("click", () => toggleSaved(button.dataset.save)));
  $$(".card-detail").forEach((button) => button.addEventListener("click", () => showEventDetails(button.dataset.details)));
  updateSavedCount();
}
function toggleSaved(id) {
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  renderEvents();
}
function showEventDetails(id) {
  const event = events.find((item) => item.id === id);
  if (!event) return;
  $("#modal-content").innerHTML = `
    <div class="modal-art ${event.art}"><span class="art-stamp">${escapeHtml(event.mark)}</span><span class="art-label">${escapeHtml(event.label)}</span></div>
    <div class="card-tags"><span class="event-topic">${escapeHtml(event.topic)}</span><span class="sample-tag">SAMPLE LISTING</span></div>
    <h2 class="modal-title" id="modal-title">${escapeHtml(event.title)}</h2><p class="modal-organizer">${escapeHtml(event.organizer)}</p>
    <div class="modal-facts"><div class="modal-fact"><small>Event date</small><strong>${formatDate(event.date, { month: "long", day: "numeric", year: "numeric" })}</strong></div><div class="modal-fact"><small>Location</small><strong>${escapeHtml(event.location)}</strong></div><div class="modal-fact"><small>Format</small><strong>${escapeHtml(event.format)}</strong></div><div class="modal-fact"><small>Registration cost</small><strong>${escapeHtml(event.cost)}</strong></div></div>
    <p class="modal-description">${escapeHtml(event.description)}</p>
    <h3 class="eligibility-heading">Eligibility & team rules <span>MOCK PREVIEW DATA</span></h3>
    <div class="eligibility-details">
      <div><small>Student status</small><strong>${event.student === "required" ? "Required" : event.student === "not-required" ? "Not required" : "Needs confirmation"}</strong></div>
      <div><small>Undergraduates</small><strong>${event.undergraduate === "yes" ? "Eligible" : event.undergraduate === "no" ? "Not eligible" : "Needs confirmation"}</strong></div>
      <div><small>Outside universities</small><strong>${event.outsideUniversity === "yes" ? "Participation allowed" : event.outsideUniversity === "no" ? "Not allowed" : "Needs confirmation"}</strong></div>
      <div><small>International students</small><strong>${event.international === "yes" ? "Explicitly allowed" : event.international === "no" ? "Not allowed" : "Needs confirmation"}</strong></div>
      <div><small>Age rule</small><strong>${event.age === null ? "Needs confirmation" : event.age.min === null && event.age.max === null ? "No age restriction stated" : `${event.age.min === null ? "" : `Minimum ${event.age.min}`}${event.age.min !== null && event.age.max !== null ? " · " : ""}${event.age.max === null ? "" : `Maximum ${event.age.max}`}`}</strong></div>
      <div><small>Geography</small><strong>${escapeHtml(event.geography)}</strong></div>
      <div><small>Invitation</small><strong>${event.invitation === "open" ? "Open registration" : event.invitation === "invite" ? "Invitation required" : "Needs confirmation"}</strong></div>
      <div><small>Team size</small><strong>${event.teamMin === null || event.teamMax === null ? "Needs confirmation" : event.teamMin === event.teamMax ? `${event.teamMin} member${event.teamMin === 1 ? "" : "s"}` : `${event.teamMin}–${event.teamMax} members`}</strong></div>
      <div><small>Solo participation</small><strong>${event.solo === "yes" ? "Allowed" : event.solo === "no" ? "Team required" : "Needs confirmation"}</strong></div>
      <div><small>Team formation</small><strong>${event.teamFormation === "bring-team" ? "Bring your own team" : event.teamFormation === "organizer-match" ? "Organizer team matching" : event.teamFormation === "either" ? "Bring a team or get matched" : "Needs confirmation"}</strong></div>
      <div><small>Every member registers</small><strong>${event.allMembersRegister === "yes" ? "Yes" : event.allMembersRegister === "no" ? "No" : "Needs confirmation"}</strong></div>
    </div>
    <div class="modal-disclaimer">Every eligibility value above is mock preview data, not a claim about a real event. Always verify the official rules before applying.</div>
    <div class="modal-actions"><button class="modal-save ${saved.has(event.id) ? "saved" : ""}" id="modal-save">${saved.has(event.id) ? "♥ Saved" : "♡ Save event"}</button><button class="modal-apply" disabled title="A verified registration link is not available in this preview">Registration link unavailable</button></div>`;
  $("#event-modal").classList.add("open");
  $("#event-modal").setAttribute("aria-hidden", "false");
  $("#modal-save").addEventListener("click", () => {
    toggleSaved(event.id);
    showEventDetails(event.id);
  });
}
function closeModal() {
  $("#event-modal").classList.remove("open");
  $("#event-modal").setAttribute("aria-hidden", "true");
}
function clearFilters() {
  $("#keyword-input").value = "";
  $("#location-input").value = "";
  $("#format-filter").value = "";
  $("#when-filter").value = "";
  $("#cost-filter").value = "";
  ["student-filter", "undergrad-filter", "outside-school-filter", "international-filter", "age-filter", "my-age-filter", "geography-filter", "invitation-filter", "team-size-filter", "participation-filter", "team-formation-filter", "members-register-filter"].forEach((id) => { $(`#${id}`).value = ""; });
  activeCategory = "All";
  savedOnly = false;
  $$(".category-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.category === "All"));
  renderEvents();
}
function setTopic(topic) {
  savedOnly = false;
  const knownCategory = [...$$(".category-chip")].some((chip) => chip.dataset.category.toLowerCase() === topic.toLowerCase());
  activeCategory = knownCategory ? [...$$(".category-chip")].find((chip) => chip.dataset.category.toLowerCase() === topic.toLowerCase()).dataset.category : "All";
  $("#keyword-input").value = knownCategory ? "" : topic;
  $$(".category-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.category === activeCategory));
  visibleCount = 6;
  renderEvents();
  $("#events").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  savedOnly = false;
  visibleCount = 6;
  renderEvents();
  $("#events").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#keyword-input").addEventListener("input", () => { savedOnly = false; visibleCount = 6; renderEvents(); });
$("#location-input").addEventListener("input", () => { savedOnly = false; visibleCount = 6; renderEvents(); });
$("#online-toggle").addEventListener("click", () => { $("#location-input").value = "Online"; savedOnly = false; renderEvents(); });
$("#sort-select").addEventListener("change", renderEvents);
["format-filter", "when-filter", "cost-filter", "student-filter", "undergrad-filter", "outside-school-filter", "international-filter", "age-filter", "my-age-filter", "geography-filter", "invitation-filter", "team-size-filter", "participation-filter", "team-formation-filter", "members-register-filter"].forEach((id) => {
  const control = $(`#${id}`);
  control.addEventListener(control.tagName === "INPUT" ? "input" : "change", renderEvents);
});
$("#filters-toggle").addEventListener("click", () => {
  const isOpen = $("#filter-panel").classList.toggle("open");
  $("#filters-toggle").setAttribute("aria-expanded", String(isOpen));
});
$("#clear-filters").addEventListener("click", clearFilters);
$("#reset-search").addEventListener("click", clearFilters);
$("#load-more").addEventListener("click", () => { visibleCount += 3; renderEvents(); });
$$(".category-chip").forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  savedOnly = false;
  visibleCount = 6;
  $$(".category-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderEvents();
}));
$$(".popular-tag").forEach((button) => button.addEventListener("click", () => setTopic(button.dataset.topic)));
$$("[data-quick-filter]").forEach((button) => button.addEventListener("click", (event) => {
  event.preventDefault();
  $("#format-filter").value = "Virtual";
  savedOnly = false;
  renderEvents();
  $("#events").scrollIntoView({ behavior: "smooth", block: "start" });
}));
$("#saved-nav").addEventListener("click", () => {
  savedOnly = !savedOnly;
  activeCategory = "All";
  $$(".category-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.category === "All"));
  renderEvents();
  $("#events").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#saved-link").addEventListener("click", (event) => {
  event.preventDefault();
  savedOnly = true;
  renderEvents();
  $("#events").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#more-categories").addEventListener("click", () => {
  if (!showMoreCategories) {
    const extraCategories = [["Cybersecurity", "⌑"], ["Education", "✎"], ["Fintech", "$"]];
    const more = $("#more-categories");
    extraCategories.forEach(([name, icon]) => {
      const button = document.createElement("button");
      button.className = "category-chip";
      button.dataset.category = name;
      button.innerHTML = `<span>${icon}</span> ${name}`;
      button.addEventListener("click", () => setTopic(name));
      more.before(button);
    });
    more.innerHTML = "Less <span>⌃</span>";
  } else {
    $$(".category-chip").forEach((chip) => {
      if (["Cybersecurity", "Education", "Fintech"].includes(chip.dataset.category)) chip.remove();
    });
    $("#more-categories").innerHTML = "More <span>⌄</span>";
  }
  showMoreCategories = !showMoreCategories;
});
$("#mobile-nav-toggle").addEventListener("click", () => $(".main-nav").classList.toggle("open"));
$("#modal-close").addEventListener("click", closeModal);
$("#event-modal").addEventListener("click", (event) => { if (event.target.id === "event-modal") closeModal(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
$("#suggest-event").addEventListener("click", () => {
  $("#modal-content").innerHTML = `<span class="eyebrow">COMMUNITY SUBMISSION</span><h2 class="modal-title" id="modal-title">Suggest an event</h2><p class="modal-organizer">Help builders discover a hackathon. This preview form does not send or publish submissions.</p><form id="suggest-form" class="suggest-form"><label>Event name<input required name="event" placeholder="Name of the hackathon" /></label><label>Official event website<input required type="url" name="website" placeholder="https://" /></label><button class="modal-apply" type="submit">Send suggestion</button><p class="suggest-feedback" id="suggest-feedback" aria-live="polite"></p></form>`;
  $("#event-modal").classList.add("open");
  $("#event-modal").setAttribute("aria-hidden", "false");
  $("#suggest-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#suggest-feedback").textContent = "Thanks! This preview is not connected to a submission service yet.";
    event.currentTarget.reset();
  });
});

renderEvents();
