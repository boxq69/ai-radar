import './styles.css';
import {
  AI_NICHES,
  SORT_OPTIONS,
  daysAgo,
  fetchStats,
  searchSites,
} from './api.js';

const PAGE_SIZE = 10;
const COMPARE_LIMIT = 3;

const state = {
  query: '',
  niche: '',
  sort: 'went_live',
  drMin: '',
  window: '90',
  from: 0,
  total: 0,
  results: [],
  stats: null,
  loading: false,
  error: '',
  compare: [],
  booted: false,
};

const app = document.querySelector('#app');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function formatNumber(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('en').format(n);
}

function truncate(text, max = 180) {
  if (!text) return 'No summary available.';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

function dateWindow(days) {
  if (!days) return { fromDate: '', toDate: '' };
  return { fromDate: daysAgo(Number(days)), toDate: '' };
}

function isCompared(domain) {
  return state.compare.some((s) => s.domain === domain);
}

function searchIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
    <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;
}

function renderNav() {
  const hash = (location.hash || '#search').slice(1);
  const link = (id, label) =>
    `<a href="#${id}" class="${hash === id ? 'active' : ''}">${label}</a>`;

  return `
    <header class="nav" id="top-nav">
      <div class="shell nav-inner">
        <a class="logo" href="#search">
          <span class="logo-mark" aria-hidden="true"></span>
          AI Radar
        </a>
        <nav class="nav-links" aria-label="Primary">
          ${link('search', 'Search')}
          ${link('compare', 'Compare')}
          ${link('plan', 'Plan')}
          <a class="btn btn-primary btn-sm nav-cta" href="#search">Start searching <span class="btn-icon">→</span></a>
        </nav>
      </div>
    </header>
  `;
}

function renderHero() {
  return `
    <section class="hero shell" id="search">
      <div class="trust">Live FreeSerp index · AI startups</div>
      <h1>AI search, <em>clarified</em></h1>
      <p class="hero-lead">
        Discover newly live AI products with clean filters, domain authority,
        and side-by-side comparison.
      </p>

      <form class="search-wrap" id="search-form">
        <div class="search-box">
          ${searchIcon()}
          <input
            id="q"
            name="q"
            type="search"
            placeholder="Search AI sites — chatbots, tools, startups…"
            value="${escapeHtml(state.query)}"
            autocomplete="off"
          />
          <button class="btn btn-primary" type="submit">
            Search <span class="btn-icon">→</span>
          </button>
        </div>
      </form>

      <div class="stats-row" aria-live="polite">
        <span><strong>${escapeHtml(formatNumber(state.stats?.ai_startups?.total))}</strong> AI startups</span>
        <span><strong>${escapeHtml(formatNumber(state.stats?.new?.last_7d))}</strong> new sites / 7d</span>
        <span><strong>${escapeHtml(formatNumber(state.stats?.totals?.real_sites))}</strong> live sites indexed</span>
      </div>
    </section>
  `;
}

function renderToolbar() {
  const quick = ['', ...AI_NICHES.slice(0, 5)];
  return `
    <div class="shell">
      <div class="toolbar">
        <div class="chips" aria-label="Niches">
          ${quick
            .map((niche) => {
              const label = niche || 'All';
              const active = state.niche === niche;
              return `<button type="button" class="chip ${active ? 'active' : ''}" data-action="set-niche" data-niche="${escapeHtml(niche)}">${escapeHtml(label)}</button>`;
            })
            .join('')}
        </div>
        <div class="controls">
          <select id="niche" aria-label="All niches">
            <option value="">More niches</option>
            ${AI_NICHES.map(
              (n) =>
                `<option value="${escapeHtml(n)}" ${state.niche === n ? 'selected' : ''}>${escapeHtml(n)}</option>`,
            ).join('')}
          </select>
          <select id="sort" aria-label="Sort">
            ${SORT_OPTIONS.map(
              (o) =>
                `<option value="${o.value}" ${state.sort === o.value ? 'selected' : ''}>${o.label}</option>`,
            ).join('')}
          </select>
          <select id="drMin" aria-label="Min DR">
            <option value="" ${state.drMin === '' ? 'selected' : ''}>Any DR</option>
            <option value="5" ${state.drMin === '5' ? 'selected' : ''}>DR 5+</option>
            <option value="10" ${state.drMin === '10' ? 'selected' : ''}>DR 10+</option>
            <option value="20" ${state.drMin === '20' ? 'selected' : ''}>DR 20+</option>
          </select>
          <select id="window" aria-label="Went live">
            <option value="" ${state.window === '' ? 'selected' : ''}>Any time</option>
            <option value="30" ${state.window === '30' ? 'selected' : ''}>30 days</option>
            <option value="90" ${state.window === '90' ? 'selected' : ''}>90 days</option>
            <option value="180" ${state.window === '180' ? 'selected' : ''}>180 days</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

function renderResult(site) {
  const compared = isCompared(site.domain);
  const niches = (site.ai_categories || []).slice(0, 2);
  const title = site.title || site.domain;

  return `
    <article class="result">
      <div class="result-main">
        <h3>${escapeHtml(title)}</h3>
        <a class="domain" href="${escapeHtml(site.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.domain)}</a>
        <p>${escapeHtml(truncate(site.ai_summary))}</p>
        <div class="meta">
          ${niches.map((n) => `<span class="niche">${escapeHtml(n)}</span>`).join('')}
          <span>Live ${escapeHtml(site.went_live || '—')}</span>
          <span>${escapeHtml(site.ai_source || 'stack n/a')}</span>
        </div>
      </div>
      <div class="result-side">
        <div
          class="dr ${site.dr == null ? 'is-empty' : ''}"
          title="Domain Rating (0–100) from FreeSerp. New domains are often unscored yet."
        >
          <strong>${site.dr == null ? 'n/a' : escapeHtml(site.dr)}</strong>
          <small>DR</small>
        </div>
        <button
          class="btn btn-sm ${compared ? 'btn-primary' : 'btn-ghost'}"
          data-action="compare-toggle"
          data-domain="${escapeHtml(site.domain)}"
          ${!compared && state.compare.length >= COMPARE_LIMIT ? 'disabled' : ''}
        >
          ${compared ? 'Selected' : 'Compare'}
        </button>
      </div>
    </article>
  `;
}

function renderResults() {
  const page = Math.floor(state.from / PAGE_SIZE) + 1;
  const pages = Math.max(1, Math.ceil((state.total || 0) / PAGE_SIZE));

  let body = '';
  if (state.error) {
    body = `
      <div class="state error">
        ${escapeHtml(state.error)}
        <div style="margin-top:1rem">
          <button class="btn btn-ghost btn-sm" data-action="retry">Try again</button>
        </div>
      </div>`;
  } else if (state.loading) {
    body = `<div class="state"><div class="spinner"></div>Searching FreeSerp…</div>`;
  } else if (!state.results.length) {
    body = `<div class="state">No AI sites matched. Broaden the niche or date window.</div>`;
  } else {
    body = state.results.map(renderResult).join('');
  }

  return `
    <div class="shell" style="padding-bottom:1rem">
      <div class="panel">
        <div class="panel-head">
          <div>
            ${
              state.loading || state.error
                ? 'Results'
                : `<strong>${formatNumber(state.total)}</strong> matches`
            }
          </div>
          <div>${state.loading || state.error ? '' : `Page ${page} of ${formatNumber(Math.min(pages, 1000))}`}</div>
        </div>
        ${body}
        <div class="pager">
          <button class="btn btn-ghost btn-sm" data-action="page" data-dir="-1" ${state.from <= 0 || state.loading ? 'disabled' : ''}>Previous</button>
          <button class="btn btn-ghost btn-sm" data-action="page" data-dir="1" ${state.from + PAGE_SIZE >= state.total || state.loading ? 'disabled' : ''}>Next</button>
        </div>
      </div>
    </div>
  `;
}

function renderFeatures() {
  return `
    <section class="section shell">
      <h2 class="section-title">Search that stays <em>focused</em></h2>
      <p class="section-lead">Minimal surface, sharp controls — query first, then filter and compare.</p>
      <div class="feature-grid">
        <article class="feature">
          <h3>Precision niches</h3>
          <p>Uses FreeSerp <code>ai_startups=1</code> so you get real AI products, not AI-flavoured noise.</p>
        </article>
        <article class="feature">
          <h3>Authority signal</h3>
          <p>Every result shows Domain Rating, live date, and builder stack at a glance.</p>
        </article>
        <article class="feature">
          <h3>Fast compare</h3>
          <p>Pin up to three sites and review summaries side by side before you dig deeper.</p>
        </article>
      </div>
    </section>
  `;
}

function renderCompare() {
  const sites = state.compare;
  if (!sites.length) {
    return `
      <section class="section shell" id="compare">
        <h2 class="section-title">Compare <em>side by side</em></h2>
        <p class="section-lead">Select up to ${COMPARE_LIMIT} results from search to open a clean comparison table.</p>
        <div class="panel"><div class="state">Nothing selected yet.</div></div>
      </section>
    `;
  }

  const rows = [
    ['Site', (s) => `<strong>${escapeHtml(s.title || s.domain)}</strong><br><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue)">${escapeHtml(s.domain)}</a>`],
    ['Summary', (s) => escapeHtml(truncate(s.ai_summary, 260))],
    ['Niches', (s) => escapeHtml((s.ai_categories || []).join(', ') || '—')],
    ['DR', (s) => (s.dr == null ? '—' : String(s.dr))],
    ['Went live', (s) => escapeHtml(s.went_live || '—')],
    ['Stack', (s) => escapeHtml(s.ai_source || '—')],
    ['TLD', (s) => escapeHtml(s.tld || '—')],
  ];

  return `
    <section class="section shell" id="compare">
      <div style="display:flex;justify-content:space-between;gap:1rem;align-items:end;flex-wrap:wrap">
        <div>
          <h2 class="section-title">Compare <em>side by side</em></h2>
          <p class="section-lead" style="margin-bottom:0">Snapshot of your selected AI sites.</p>
        </div>
        <button class="btn btn-ghost btn-sm" data-action="clear-compare">Clear</button>
      </div>
      <div class="compare-table-wrap" style="margin-top:1.25rem">
        <table class="compare-table">
          <tbody>
            ${rows
              .map(
                ([label, render]) => `
                <tr>
                  <th>${escapeHtml(label)}</th>
                  ${sites.map((s) => `<td>${render(s)}</td>`).join('')}
                </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderPlan() {
  return `
    <section class="section shell" id="plan">
      <h2 class="section-title">Site <em>plan</em></h2>
      <p class="section-lead">Short product brief — goal, audience, and structure.</p>
      <div class="plan-grid">
        <div class="plan-card">
          <h3>Goal</h3>
          <p>Help founders and scouts discover newly live AI products quickly, using FreeSerp Main with genuine AI-startup filtering.</p>
          <h3 style="margin-top:1.1rem">Audience</h3>
          <ul>
            <li>Founders researching niche competitors</li>
            <li>Investors scanning fresh AI launches</li>
            <li>Builders looking for stack inspiration</li>
          </ul>
        </div>
        <div class="plan-card">
          <h3>Pages & structure</h3>
          <div class="structure">
            <div><strong>Search</strong><span>Hero query + filters + ranked result list</span></div>
            <div><strong>Compare</strong><span>Side-by-side table for up to 3 sites</span></div>
            <div><strong>Plan</strong><span>Goal, audience, information architecture</span></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCompareBar() {
  if (!state.compare.length) return '';
  return `
    <div class="compare-bar visible" role="status">
      <div class="picks">
        <strong>${state.compare.length}/${COMPARE_LIMIT}</strong>
        ${state.compare.map((s) => escapeHtml(s.domain)).join(' · ')}
      </div>
      <div style="display:flex;gap:0.45rem">
        <button class="btn btn-ghost btn-sm" data-action="clear-compare">Clear</button>
        <a class="btn btn-primary btn-sm" href="#compare">Open compare</a>
      </div>
    </div>
  `;
}

function renderFooter() {
  return `<footer class="footer" aria-hidden="true"></footer>`;
}

function render() {
  app.innerHTML = `
    ${renderNav()}
    <main>
      ${renderHero()}
      ${renderToolbar()}
      ${renderResults()}
      ${renderFeatures()}
      ${renderCompare()}
      ${renderPlan()}
    </main>
    ${renderFooter()}
    ${renderCompareBar()}
  `;
  bindEvents();
  syncNavScroll();
}

function findSite(domain) {
  return (
    state.compare.find((s) => s.domain === domain) ||
    state.results.find((s) => s.domain === domain)
  );
}

function toggleCompare(domain) {
  const idx = state.compare.findIndex((s) => s.domain === domain);
  if (idx >= 0) {
    state.compare.splice(idx, 1);
  } else if (state.compare.length < COMPARE_LIMIT) {
    const site = findSite(domain);
    if (site) state.compare.push(site);
  }
  render();
}

function readControls() {
  const nicheEl = document.querySelector('#niche');
  const sortEl = document.querySelector('#sort');
  const drEl = document.querySelector('#drMin');
  const windowEl = document.querySelector('#window');
  if (nicheEl) state.niche = nicheEl.value;
  if (sortEl) state.sort = sortEl.value;
  if (drEl) state.drMin = drEl.value;
  if (windowEl) state.window = windowEl.value;
}

async function loadStats() {
  try {
    state.stats = await fetchStats();
  } catch {
    state.stats = null;
  }
}

async function loadResults({ resetPage = false } = {}) {
  if (resetPage) state.from = 0;
  state.loading = true;
  state.error = '';
  render();

  const { fromDate, toDate } = dateWindow(state.window);

  try {
    const data = await searchSites({
      q: state.query,
      niche: state.niche,
      sort: state.sort,
      drMin: state.drMin,
      fromDate,
      toDate,
      size: PAGE_SIZE,
      from: state.from,
    });
    state.results = data.results || [];
    state.total = data.total || 0;
  } catch (err) {
    state.results = [];
    state.total = 0;
    state.error = err.message || 'Search failed.';
  } finally {
    state.loading = false;
    render();
  }
}

function bindEvents() {
  const form = document.querySelector('#search-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    state.query = String(new FormData(form).get('q') || '').trim();
    readControls();
    loadResults({ resetPage: true });
  });

  ['niche', 'sort', 'drMin', 'window'].forEach((id) => {
    document.querySelector(`#${id}`)?.addEventListener('change', () => {
      readControls();
      loadResults({ resetPage: true });
    });
  });

  app.querySelectorAll('[data-action="set-niche"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.niche = btn.dataset.niche || '';
      loadResults({ resetPage: true });
    });
  });

  app.querySelectorAll('[data-action="compare-toggle"]').forEach((btn) => {
    btn.addEventListener('click', () => toggleCompare(btn.dataset.domain));
  });

  app.querySelectorAll('[data-action="page"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.from = Math.max(0, state.from + Number(btn.dataset.dir) * PAGE_SIZE);
      loadResults().then(() => {
        document.querySelector('.panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });

  app.querySelectorAll('[data-action="clear-compare"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.compare = [];
      render();
    });
  });

  app.querySelectorAll('[data-action="retry"]').forEach((btn) => {
    btn.addEventListener('click', () => loadResults());
  });
}

function syncNavScroll() {
  const nav = document.querySelector('#top-nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

window.addEventListener('hashchange', () => {
  render();
  const el = document.querySelector(location.hash || '#search');
  el?.scrollIntoView({ behavior: 'smooth' });
});

async function boot() {
  render();
  await Promise.all([loadStats(), loadResults()]);
  state.booted = true;
}

boot();
