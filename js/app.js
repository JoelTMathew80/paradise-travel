/**
 * Paradise Travel — Client Application
 * Handles destination filtering, daily trip planning, live weather integration (Open-Meteo),
 * Google Maps exploration, and asynchronous enquiry submissions.
 */

// --- Configuration & Constants ---
const GOOGLE_MAPS_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/placeholder_enquiry';
const ENABLE_PLACES_AUTOCOMPLETE = false;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// --- Application State ---
let DEST = [];
const state = { type: 'all', month: 'any' };
const plan = { id: 'andaman', day: 0, daysCount: 3 };
const mapState = {
  destId: 'andaman',
  placeType: 'tourist attractions',
  isIntersected: false,
  pendingQuery: null
};

const weatherCache = {};
let apiCallCount = 0;
let uid = 0;

// --- DOM & Formatting Utilities ---
const $ = (id) => document.getElementById(id);
const inr = (amount) => '₹' + Number(amount).toLocaleString('en-IN');
const find = (id) => DEST.find((item) => item.id === id);

// --- REST API & Network Inspector ---
function logApiCall(method, url, status, durationMs, note = '') {
  apiCallCount++;
  const badge = $('apiCallCountBadge');
  if (badge) badge.textContent = `${apiCallCount} call${apiCallCount === 1 ? '' : 's'}`;

  const list = $('apiLogList');
  if (!list) return;

  const item = document.createElement('div');
  const isError = status >= 400 || status === 'ERR';
  const isCached = status === 'CACHED';

  item.className = [
    'api-log-item',
    method === 'POST' ? 'method-POST' : '',
    method === 'EMBED' ? 'method-EMBED' : '',
    isError ? 'status-error' : '',
    isCached ? 'status-cached' : ''
  ].filter(Boolean).join(' ');

  const statusBadgeClass = isCached ? 'status-cached-badge' : (status >= 400 ? 'status-4xx' : 'status-2xx');
  const timeStr = new Date().toLocaleTimeString();
  const truncatedUrl = url.length > 55 ? `${url.substring(0, 52)}...` : url;

  item.innerHTML = `
    <div class="api-log-top-row">
      <div class="d-flex align-items-center gap-1">
        <span class="api-badge-method ${method}">${method}</span>
        <span class="api-badge-status ${statusBadgeClass}">${status}</span>
      </div>
      <span style="color:#6C9490; font-size:10px;">⚡ ${durationMs}ms</span>
    </div>
    <div class="api-log-url" title="${url}">${truncatedUrl}</div>
    <div class="api-log-meta">
      <span>${note}</span>
      <span>${timeStr}</span>
    </div>
  `;

  if (list.prepend) {
    list.prepend(item);
  } else {
    list.insertBefore(item, list.firstChild);
  }
}

// Collapsible API inspector drawer toggles
$('apiLogHeader').addEventListener('click', (e) => {
  if (e.target.closest('#clearApiLogBtn')) return;
  const drawer = $('apiLogDrawer');
  drawer.classList.toggle('collapsed');
  const toggleBtn = $('toggleApiLogBtn');
  toggleBtn.textContent = drawer.classList.contains('collapsed') ? '▲' : '▼';
});

$('clearApiLogBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  $('apiLogList').innerHTML = '<div style="color:#6C9490; padding:4px 0;"><small>Log cleared.</small></div>';
  apiCallCount = 0;
  $('apiCallCountBadge').textContent = '0 calls';
});

// --- Procedural SVG Scene Art ---
function scene(kind, c) {
  const gradId = `g${uid++}`;
  let s = `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
    `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs>` +
    `<rect width="400" height="240" fill="url(#${gradId})"/><circle cx="290" cy="90" r="34" fill="${c[2]}"/>`;

  if (kind === 'beach') {
    s += `<rect y="130" width="400" height="110" fill="${c[5]}"/>` +
      `<path d="M0 150 Q100 140 200 150 T400 146" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>` +
      `<path d="M0 172 Q100 150 200 172 T400 165 V240 H0Z" fill="${c[4]}"/>` +
      `<path d="M70 240 Q78 195 92 152" stroke="#5a3b22" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<g stroke="${c[3]}" stroke-width="6" fill="none" stroke-linecap="round">` +
      `<path d="M92 152 Q62 128 34 150"/><path d="M92 152 Q72 118 48 116"/><path d="M92 152 Q98 114 124 110"/><path d="M92 152 Q122 130 148 150"/></g>`;
  } else if (kind === 'hills') {
    s += `<path d="M0 150 L70 90 L140 140 L220 70 L310 145 L400 100 V240 H0Z" fill="${c[3]}"/>` +
      `<path d="M0 190 Q90 130 180 175 T400 160 V240 H0Z" fill="${c[4]}"/>` +
      `<g stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none"><path d="M0 205 Q100 165 200 195 T400 185"/><path d="M0 220 Q100 185 200 212 T400 204"/></g>`;
  } else if (kind === 'culture') {
    s += `<ellipse cx="60" cy="205" rx="72" ry="42" fill="${c[3]}"/><ellipse cx="190" cy="220" rx="92" ry="46" fill="${c[3]}"/><ellipse cx="335" cy="206" rx="80" ry="40" fill="${c[3]}"/>` +
      `<rect x="140" y="122" width="120" height="10" fill="${c[4]}"/><rect x="150" y="132" width="100" height="62" fill="${c[4]}"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${158 + i * 20}" y="136" width="8" height="58" fill="${c[3]}"/>`;
    s += `<rect y="196" width="400" height="44" fill="${c[4]}"/>`;
  } else if (kind === 'backwaters') {
    s += `<rect y="125" width="400" height="115" fill="${c[5]}"/>` +
      `<path d="M0 135 Q80 120 160 130 T320 125 T400 130 V145 H0Z" fill="${c[3]}"/>` +
      `<path d="M115 178 C135 186, 235 186, 265 178 L280 168 C255 169, 125 169, 100 168 Z" fill="${c[4]}"/>` +
      `<path d="M125 168 Q185 136 250 168 Z" fill="#6A4526"/>` +
      `<rect x="150" y="152" width="22" height="14" rx="2" fill="${c[2]}" opacity="0.9"/>` +
      `<rect x="185" y="152" width="22" height="14" rx="2" fill="${c[2]}" opacity="0.9"/>` +
      `<path d="M45 240 Q40 170 18 120" stroke="#4A3319" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<g stroke="${c[3]}" stroke-width="5" fill="none" stroke-linecap="round">` +
      `<path d="M18 120 Q-10 100 -30 115"/><path d="M18 120 Q-5 85 -20 70"/><path d="M18 120 Q20 85 45 75"/><path d="M18 120 Q45 100 65 115"/></g>` +
      `<g stroke="#fff" stroke-opacity=".4" stroke-width="1.5" fill="none">` +
      `<path d="M100 195 Q180 190 270 195"/><path d="M140 210 Q210 206 290 210"/><path d="M50 225 Q120 220 200 225"/></g>`;
  } else if (kind === 'wildlife') {
    s += `<path d="M0 135 Q60 95 140 120 T300 105 T400 125 V240 H0Z" fill="${c[3]}"/>` +
      `<path d="M0 165 Q110 145 220 160 T400 152 V240 H0Z" fill="${c[4]}"/>` +
      `<rect y="185" width="400" height="55" fill="${c[5] || '#176063'}"/>` +
      `<g fill="${c[3]}">` +
      `<ellipse cx="140" cy="155" rx="36" ry="24"/>` +
      `<circle cx="106" cy="148" r="16"/>` +
      `<path d="M96 150 Q85 160 88 174 Q92 178 95 174 Q92 165 100 158" stroke="${c[3]}" stroke-width="4" stroke-linecap="round" fill="none"/>` +
      `<path d="M100 158 Q95 166 90 165" stroke="#FFF" stroke-width="2" fill="none"/>` +
      `<rect x="114" y="165" width="8" height="24" rx="3"/>` +
      `<rect x="127" y="165" width="8" height="24" rx="3"/>` +
      `<rect x="152" y="165" width="8" height="24" rx="3"/>` +
      `<rect x="164" y="165" width="8" height="24" rx="3"/>` +
      `<path d="M174 150 Q180 162 178 170" stroke="${c[3]}" stroke-width="2" fill="none"/>` +
      `</g>` +
      `<g stroke="#fff" stroke-opacity=".3" stroke-width="1.5" fill="none">` +
      `<path d="M80 200 Q140 196 200 200"/><path d="M100 215 Q150 212 220 215"/></g>`;
  } else if (kind === 'waterfalls') {
    s += `<path d="M0 70 L90 90 L120 240 H0 Z" fill="${c[3]}"/>` +
      `<path d="M400 60 L300 85 L270 240 H400 Z" fill="${c[3]}"/>` +
      `<path d="M80 100 L140 110 L130 240 H60 Z" fill="${c[4]}"/>` +
      `<path d="M320 95 L260 105 L265 240 H340 Z" fill="${c[4]}"/>` +
      `<path d="M140 100 Q200 95 260 100 L260 210 Q200 215 140 210 Z" fill="#D8F3F1"/>` +
      `<path d="M155 100 L150 210 M175 100 L170 210 M195 98 L195 210 M215 98 L220 210 M235 100 L240 210 M250 100 L255 210" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>` +
      `<rect y="205" width="400" height="35" fill="${c[5] || '#157F83'}"/>` +
      `<ellipse cx="200" cy="210" rx="90" ry="16" fill="#FFFFFF" opacity="0.6"/>` +
      `<ellipse cx="200" cy="214" rx="70" ry="10" fill="#E8F9F8" opacity="0.8"/>` +
      `<g stroke="#fff" stroke-opacity=".4" stroke-width="1.5" fill="none">` +
      `<path d="M70 224 Q200 218 330 224"/><path d="M110 232 Q200 228 290 232"/></g>`;
  }
  return s + '</svg>';
}

// --- Dropdown Population ---
function fillMonths(el, includeAny = false) {
  const options = MONTHS.map((month, idx) => `<option value="${idx}">${month}</option>`).join('');
  el.innerHTML = (includeAny ? '<option value="any">Any month</option>' : '') + options;
}

['hMonth', 'fMonth'].forEach((id) => fillMonths($(id), true));
fillMonths($('eMonth'), true);

function populateDestDropdowns() {
  const destOptions = DEST.map((d) => `<option value="${d.id}">${d.name}</option>`).join('');
  $('planDest').innerHTML = destOptions;
  $('mapDestSelect').innerHTML = destOptions;
  $('eDest').innerHTML = '<option value="">Not sure yet</option>' + destOptions;
}

// Initial hero artwork
$('heroArt').innerHTML = scene('beach', ['#9FE3E0', '#FDE7C2', '#FFB347', '#0B7F86', '#F4D9A6', '#0E9AA0']);

// --- Google Maps Integration ---
function buildMapEmbedUrl(query) {
  if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
    return `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(query)}`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}

function updateGoogleMap(destId, placeType) {
  if (destId) mapState.destId = destId;
  if (placeType) mapState.placeType = placeType;

  const dest = find(mapState.destId);
  if (!dest) return;

  const query = `${mapState.placeType} in ${dest.name}`;

  if ($('mapDestSelect') && $('mapDestSelect').value !== dest.id) {
    $('mapDestSelect').value = dest.id;
  }
  if ($('mapTypeSelect') && $('mapTypeSelect').value !== mapState.placeType) {
    $('mapTypeSelect').value = mapState.placeType;
  }

  $('mapQueryText').textContent = query;

  const extUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const extBtn = $('openInGoogleMapsBtn');
  if (extBtn) {
    extBtn.href = extUrl;
    extBtn.setAttribute('title', `Open "${query}" on Google Maps in a new tab`);
  }

  if (!mapState.isIntersected) {
    mapState.pendingQuery = query;
    return;
  }

  const iframe = $('googleMapIframe');
  const overlay = $('mapLoadingOverlay');
  if (overlay) overlay.classList.remove('hidden');

  const embedUrl = buildMapEmbedUrl(query);
  const startTime = performance.now();

  iframe.onload = () => {
    const dur = Math.round(performance.now() - startTime);
    if (overlay) overlay.classList.add('hidden');
    logApiCall('EMBED', `maps.google.com/?q=${encodeURIComponent(query)}`, 200, dur, 'Google Maps Embed Search');
  };

  iframe.src = embedUrl;
}

// Lazy-load map iframe when it enters viewport
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !mapState.isIntersected) {
      mapState.isIntersected = true;
      mapObserver.disconnect();
      updateGoogleMap(mapState.destId, mapState.placeType);
    }
  });
}, { rootMargin: '100px' });

mapObserver.observe($('mapFrameContainer'));

$('mapDestSelect').addEventListener('change', (e) => updateGoogleMap(e.target.value, null));
$('mapTypeSelect').addEventListener('change', (e) => updateGoogleMap(null, e.target.value));

function initMapsAutocompleteUpgrade() {
  if (!ENABLE_PLACES_AUTOCOMPLETE || GOOGLE_MAPS_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') return;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&callback=onGoogleMapsSdkLoaded`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

window.onGoogleMapsSdkLoaded = () => {
  console.log('Google Maps Places SDK ready.');
};

// --- Weather Service (Open-Meteo Forecast API) ---
function getWeatherMeta(code) {
  if (code === 0) return { icon: '☀️', text: 'Clear' };
  if (code <= 3) return { icon: '🌤️', text: 'Partly Cloudy' };
  if (code <= 48) return { icon: '🌫️', text: 'Misty / Fog' };
  if (code <= 67) return { icon: '🌧️', text: 'Rain' };
  if (code <= 77) return { icon: '❄️', text: 'Flurries' };
  if (code <= 82) return { icon: '🌦️', text: 'Showers' };
  if (code <= 99) return { icon: '⛈️', text: 'Thunderstorm' };
  return { icon: '🌡️', text: 'Fair' };
}

async function fetchWeatherForDest(dest) {
  if (!dest?.coords) return null;
  const key = dest.id;

  if (weatherCache[key]) {
    logApiCall('GET', `open-meteo.com/v1/forecast?id=${key}`, 'CACHED', 0, 'In-Memory Cache Hit');
    return weatherCache[key];
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${dest.coords.lat}&longitude=${dest.coords.lon}&current_weather=true`;
  const startTime = performance.now();

  try {
    const res = await fetch(url);
    const duration = Math.round(performance.now() - startTime);

    if (!res.ok) {
      logApiCall('GET', url, res.status, duration, 'Open-Meteo HTTP Error');
      return null;
    }

    const data = await res.json();
    logApiCall('GET', url, res.status, duration, 'Open-Meteo Live Forecast');

    const cw = data.current_weather;
    const meta = getWeatherMeta(cw.weathercode);
    const weatherResult = {
      temp: Math.round(cw.temperature),
      wind: cw.windspeed,
      icon: meta.icon,
      text: meta.text,
      time: cw.time
    };

    weatherCache[key] = weatherResult;
    return weatherResult;
  } catch {
    const failDuration = Math.round(performance.now() - startTime);
    logApiCall('GET', url, 'ERR', failDuration, 'Network / CORS Error');
    return null;
  }
}

async function updateCardWeather(dest) {
  const badgeEl = $(`wb-${dest.id}`);
  if (!badgeEl) return;

  const w = await fetchWeatherForDest(dest);
  if (w && badgeEl) {
    badgeEl.innerHTML = `<span class="live-dot"></span><span>${w.icon}</span> ${w.temp}°C · ${w.text}`;
    badgeEl.setAttribute('title', `Live Open-Meteo weather: ${w.text} (${w.temp}°C, Wind: ${w.wind} km/h)`);
  } else if (badgeEl) {
    badgeEl.innerHTML = `<span>🌡️</span> Season ${dest.seasonText}`;
  }
}

// --- Destination Filtering & Catalog Rendering ---
function matches(d) {
  return (state.type === 'all' || d.type === state.type) &&
    (state.month === 'any' || d.season.includes(+state.month));
}

function renderGrid() {
  const list = DEST.filter(matches);
  $('hType').value = state.type;
  $('hMonth').value = state.month;
  $('fMonth').value = state.month;

  document.querySelectorAll('.chip').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.type === state.type));
  });

  const when = state.month === 'any' ? '' : ` in ${MONTHS[+state.month]}`;
  $('count').textContent = `Showing ${list.length} ${list.length === 1 ? 'destination' : 'destinations'}${when}`;

  if (!list.length) {
    $('grid').innerHTML = `
      <div class="empty-state">
        <p>Nothing fits that combination. Try another month or category.</p>
        <button class="btn-custom" id="clear">Clear filters</button>
      </div>
    `;
    $('clear').onclick = () => {
      state.type = 'all';
      state.month = 'any';
      renderGrid();
    };
    return;
  }

  $('grid').innerHTML = list.map((d) => `
    <article class="card-custom">
      <div class="pic">
        ${scene(d.sc[0], d.sc[1])}
        <div class="weather-badge" id="wb-${d.id}">
          <span class="spinner-border spinner-border-sm" style="width:10px;height:10px;" role="status"></span> Live weather
        </div>
      </div>
      <div class="body">
        <div>
          <div class="card-title-row"><h3>${d.name}</h3></div>
          <p class="where">📍 ${d.where}</p>
        </div>
        <p class="card-blurb">${d.blurb}</p>
        <ul class="meta">
          <li>🗓️ ${d.seasonText}</li>
          <li>🌙 ${d.nights} nights</li>
          <li>${d.type.charAt(0).toUpperCase() + d.type.slice(1)}</li>
        </ul>
        <div class="foot">
          <div class="price">${inr(d.price)}<small>sample / person (${d.nights}N)</small></div>
          <div class="card-actions">
            <button class="link-btn" data-plan="${d.id}">View plan →</button>
            <button class="quick-enquire" data-enquire="${d.id}" title="Pre-fill enquiry">Plan</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  list.forEach((d) => updateCardWeather(d));
}

// --- Itinerary Planner ---
function updateDurationButtons() {
  document.querySelectorAll('.duration-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(+btn.dataset.len === plan.daysCount));
  });
}

async function renderPlan() {
  const d = find(plan.id);
  if (!d) return;

  $('planDest').value = plan.id;
  updateDurationButtons();

  const visibleDays = Math.min(plan.daysCount, d.days.length);
  if (plan.day >= visibleDays) {
    plan.day = 0;
  }

  // Generate day navigation tabs
  $('tabs').innerHTML = '';
  for (let i = 0; i < visibleDays; i++) {
    const tabBtn = document.createElement('button');
    tabBtn.className = 'tab-custom';
    tabBtn.setAttribute('role', 'tab');
    tabBtn.setAttribute('data-day', i);
    tabBtn.setAttribute('aria-selected', String(i === plan.day));
    tabBtn.textContent = `Day ${i + 1}`;
    $('tabs').appendChild(tabBtn);
  }

  const dayObj = d.days[plan.day];

  // Daily time slots & side preview
  $('panel').innerHTML = `
    <div class="panel-main">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <span class="eyebrow">${d.name} · Day ${plan.day + 1} of ${visibleDays}</span>
          <h3 style="font-size:25px; margin-block:6px 6px;">${dayObj.title}</h3>
          <p style="font-size:13.5px; color:var(--muted); font-weight:600;">Recommended Season: ${d.seasonText} · 📍 ${d.where}</p>
        </div>
        <div class="plan-weather-pill" id="planWeatherLivePill">
          <span class="spinner-border spinner-border-sm" role="status"></span> Live weather...
        </div>
      </div>
      <div class="slots-grid">
        <div class="slot morning">
          <span class="slot-tag">🌅 Morning</span>
          <p>${dayObj.morning}</p>
        </div>
        <div class="slot afternoon">
          <span class="slot-tag">☀️ Afternoon</span>
          <p>${dayObj.afternoon}</p>
        </div>
        <div class="slot evening">
          <span class="slot-tag">🌙 Evening</span>
          <p>${dayObj.evening}</p>
        </div>
      </div>
    </div>
    <div class="panel-side">
      <div class="art">${scene(d.sc[0], d.sc[1])}</div>
      <button class="btn-custom" style="width:100%;" id="planThisTripBtn">✈️ Plan this trip (Enquire now)</button>
    </div>
  `;

  $('planThisTripBtn').onclick = () => prefillEnquiry(d.id);

  renderRichDetails(d);

  const w = await fetchWeatherForDest(d);
  const pill = $('planWeatherLivePill');
  if (pill && w) {
    pill.innerHTML = `<span>${w.icon}</span> <strong>${w.temp}°C</strong> (${w.text})`;
    pill.setAttribute('title', `Live weather at ${d.name} via Open-Meteo API`);
  } else if (pill) {
    pill.innerHTML = `<span>🌡️</span> Season: ${d.seasonText}`;
  }
}

function renderRichDetails(d) {
  const b = d.budget;
  const totalB = b.stay + b.food + b.transport + b.activities;
  const pStay = ((b.stay / totalB) * 100).toFixed(1);
  const pFood = ((b.food / totalB) * 100).toFixed(1);
  const pTrans = ((b.transport / totalB) * 100).toFixed(1);
  const pAct = ((b.activities / totalB) * 100).toFixed(1);

  $('richDetails').innerHTML = `
    <!-- Transit Guidelines -->
    <div class="info-card">
      <h4>🧭 How to reach</h4>
      <div class="reach-list">
        <div class="reach-item"><span class="reach-label">✈️ Nearest Airport</span><span>${d.reach.airport}</span></div>
        <div class="reach-item"><span class="reach-label">🚆 Nearest Railway</span><span>${d.reach.railway}</span></div>
        <div class="reach-item"><span class="reach-label">🚕 Local Transport</span><span>${d.reach.local}</span></div>
      </div>
    </div>

    <!-- Indicative Budget Breakdown -->
    <div class="info-card">
      <h4>📊 Sample Budget (${d.nights} Nights)</h4>
      <div class="budget-bar" title="Stay ${pStay}%, Food ${pFood}%, Transport ${pTrans}%, Activities ${pAct}%">
        <div class="budget-seg seg-stay" style="width:${pStay}%"></div>
        <div class="budget-seg seg-food" style="width:${pFood}%"></div>
        <div class="budget-seg seg-trans" style="width:${pTrans}%"></div>
        <div class="budget-seg seg-act" style="width:${pAct}%"></div>
      </div>
      <div class="budget-list">
        <div class="budget-item"><span class="dot seg-stay"></span> Stay: ${inr(b.stay)}</div>
        <div class="budget-item"><span class="dot seg-food"></span> Food: ${inr(b.food)}</div>
        <div class="budget-item"><span class="dot seg-trans"></span> Transit: ${inr(b.transport)}</div>
        <div class="budget-item"><span class="dot seg-act"></span> Activities: ${inr(b.activities)}</div>
      </div>
      <div class="budget-total"><span>Total / Person:</span><span>${inr(totalB)}</span></div>
    </div>

    <!-- Group Cost Estimator -->
    <div class="info-card calc-card">
      <h4>🧮 Cost Calculator</h4>
      <div class="calc-fields">
        <div class="field">
          <label for="calcTravellers">Travellers</label>
          <input type="number" id="calcTravellers" min="1" max="20" value="2">
        </div>
        <div class="field">
          <label for="calcNights">Nights</label>
          <input type="number" id="calcNights" min="1" max="14" value="${d.nights}">
        </div>
      </div>
      <div class="calc-result">
        <span class="calc-note">Estimated Total for Group</span>
        <div class="calc-total" id="calcTotalOutput">₹0</div>
        <span class="calc-note" id="calcPerPersonOutput">₹0 per person</span>
      </div>
    </div>

    <!-- Travel Tips & Advisories -->
    <div class="info-card">
      <h4>⚠️ Travel Tips & Advice</h4>
      <ul class="tips-list">
        ${d.tips.map((tip) => `<li>${tip}</li>`).join('')}
      </ul>
    </div>
  `;

  const updateCalculator = () => {
    const travellers = Math.max(1, parseInt($('calcTravellers').value, 10) || 1);
    const nights = Math.max(1, parseInt($('calcNights').value, 10) || 1);
    const ratePerNight = d.price / d.nights;
    const perPersonTotal = Math.round(ratePerNight * nights);
    const grandTotal = perPersonTotal * travellers;
    $('calcTotalOutput').textContent = inr(grandTotal);
    $('calcPerPersonOutput').textContent = `${inr(perPersonTotal)} per person (${nights} nights)`;
  };

  $('calcTravellers').oninput = updateCalculator;
  $('calcNights').oninput = updateCalculator;
  updateCalculator();
}

function prefillEnquiry(destId) {
  const d = find(destId);
  if (!d) return;

  $('eDest').value = d.id;
  if (state.month !== 'any') {
    $('eMonth').value = state.month;
  } else if (d.season.length > 0) {
    $('eMonth').value = d.season[0];
  }

  $('contact').scrollIntoView({ behavior: 'smooth' });
  $('name').focus();

  const seasonName = MONTHS[$('eMonth').value] || d.seasonText;
  $('status').textContent = `Selected ${d.name} for ${seasonName}. Complete your details below to enquire.`;
}

// --- Data Fetching (destinations.json) ---
async function loadDestinations() {
  const spinner = $('destSpinner');
  const errorAlert = $('destErrorAlert');

  if (spinner) spinner.classList.remove('d-none');
  if (errorAlert) errorAlert.classList.add('d-none');

  const startTime = performance.now();
  const url = 'destinations.json';

  try {
    const res = await fetch(url);
    const duration = Math.round(performance.now() - startTime);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    DEST = await res.json();
    logApiCall('GET', url, res.status, duration, `Loaded ${DEST.length} destinations`);

    if (spinner) spinner.classList.add('d-none');

    $('heroCount').textContent = DEST.length;
    $('placesCount').textContent = DEST.length;
    populateDestDropdowns();

    renderGrid();
    renderPlan();
    updateGoogleMap(plan.id, 'tourist attractions');
  } catch (err) {
    const failDuration = Math.round(performance.now() - startTime);
    logApiCall('GET', url, 'ERR', failDuration, err.message || 'Fetch Failed');

    if (spinner) spinner.classList.add('d-none');
    if (errorAlert) {
      errorAlert.classList.remove('d-none');
      errorAlert.classList.add('d-flex');
      $('errorMsgText').textContent = err.message || 'Network error';
    }
  }
}

$('retryFetchBtn').addEventListener('click', () => loadDestinations());

// --- Enquiry Form Submission (POST) ---
$('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = $('submitEnquiryBtn');
  const originalBtnText = submitBtn.innerHTML;
  const statusEl = $('status');

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
  statusEl.textContent = 'Submitting your enquiry...';

  const nameVal = $('name').value.trim();
  const emailVal = $('email').value.trim();
  const destIdVal = $('eDest').value;
  const destName = destIdVal ? find(destIdVal).name : 'Unspecified';
  const monthVal = $('eMonth').value;
  const monthName = monthVal !== 'any' && MONTHS[+monthVal] ? MONTHS[+monthVal] : 'Flexible';
  const msgVal = $('msg').value.trim();

  const payload = {
    name: nameVal,
    email: emailVal,
    destination: destName,
    month: monthName,
    notes: msgVal,
    submittedAt: new Date().toISOString()
  };

  const startTime = performance.now();
  const toastEl = $('enquiryToast');
  const toastMsg = $('toastMessage');

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const duration = Math.round(performance.now() - startTime);
    logApiCall('POST', FORMSPREE_ENDPOINT, res.status, duration, 'Enquiry Form Submission');

    if (res.ok) {
      statusEl.textContent = `Thanks, ${nameVal}! Your enquiry for ${destName} has been received.`;
      toastEl.classList.remove('text-bg-danger', 'text-bg-warning');
      toastEl.classList.add('text-bg-success');
      toastMsg.innerHTML = `<strong>🎉 Enquiry Sent!</strong> Thank you ${nameVal}, your trip request for ${destName} has been submitted.`;
      $('form').reset();
    } else {
      statusEl.textContent = `Formspree endpoint responded with HTTP ${res.status}. Request logged in API console.`;
      toastEl.classList.remove('text-bg-success', 'text-bg-danger');
      toastEl.classList.add('text-bg-warning');
      toastMsg.innerHTML = `<strong>ℹ️ HTTP ${res.status}:</strong> Request was sent via POST to Formspree endpoint. Details recorded in API Log.`;
    }
  } catch (err) {
    const failDuration = Math.round(performance.now() - startTime);
    logApiCall('POST', FORMSPREE_ENDPOINT, 'ERR', failDuration, 'Network error / endpoint unavailable');

    statusEl.textContent = `Submission error: ${err.message || 'Network failure'}. See API Log for details.`;
    toastEl.classList.remove('text-bg-success', 'text-bg-warning');
    toastEl.classList.add('text-bg-danger');
    toastMsg.innerHTML = `<strong>⚠️ Submission Error:</strong> Could not connect to Formspree endpoint (${err.message}).`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      const toast = new bootstrap.Toast(toastEl, { delay: 6000 });
      toast.show();
    }
  }
});

// --- UI Event Listeners ---
$('finder').addEventListener('submit', (e) => {
  e.preventDefault();
  state.type = $('hType').value;
  state.month = $('hMonth').value;
  renderGrid();
  $('places').scrollIntoView({ behavior: 'smooth' });
});

$('fMonth').addEventListener('change', (e) => {
  state.month = e.target.value;
  renderGrid();
  const list = DEST.filter(matches);
  if (list.length) updateGoogleMap(list[0].id, null);
});

document.querySelectorAll('.chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.type = btn.dataset.type;
    renderGrid();
    const list = DEST.filter(matches);
    if (list.length) updateGoogleMap(list[0].id, null);
  });
});

$('grid').addEventListener('click', (e) => {
  const planBtn = e.target.closest('[data-plan]');
  if (planBtn) {
    plan.id = planBtn.dataset.plan;
    plan.day = 0;
    renderPlan();
    updateGoogleMap(plan.id, null);
    $('plan').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const enqBtn = e.target.closest('[data-enquire]');
  if (enqBtn) {
    prefillEnquiry(enqBtn.dataset.enquire);
    updateGoogleMap(enqBtn.dataset.enquire, null);
  }
});

$('planDest').addEventListener('change', (e) => {
  plan.id = e.target.value;
  plan.day = 0;
  renderPlan();
  updateGoogleMap(plan.id, null);
});

document.querySelectorAll('.duration-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    plan.daysCount = +btn.dataset.len;
    plan.day = 0;
    renderPlan();
  });
});

$('tabs').addEventListener('click', (e) => {
  const tabBtn = e.target.closest('[data-day]');
  if (!tabBtn) return;
  plan.day = +tabBtn.dataset.day;
  renderPlan();
});

$('menuBtn').addEventListener('click', function () {
  const isOpen = $('links').classList.toggle('open');
  this.setAttribute('aria-expanded', String(isOpen));
});

$('links').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    $('links').classList.remove('open');
    $('menuBtn').setAttribute('aria-expanded', 'false');
  }
});

$('themeBtn').addEventListener('click', () => {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
});

// Initialize application
loadDestinations();
initMapsAutocompleteUpgrade();
