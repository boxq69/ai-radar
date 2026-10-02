const API_URL = 'https://freeserp.ai/api.php';
// Cloudflare Worker with a single clean ACAO header.
const WORKER_URL = 'https://ai-radar-api.tarry-fold.workers.dev/';
const DEV_PROXY = '/api/freeserp';

const CLIENT = {
  project: 'AI Radar',
  agent: 'AIRadar/1.0',
};

export const AI_NICHES = [
  'AI Agents & Autonomous',
  'AI Automation & Workflows',
  'Code & Dev Tools',
  'AI Infrastructure & API',
  'AI Chatbot & Assistant',
  'LLM & Prompt Tools',
  'AI Search & Answers',
  'Image Generation',
  'Video Generation',
  'Voice & Text-to-Speech',
  'Data & Analytics',
  'Design & UI',
  'Research & Science',
  'AI Website Builder',
  'No-code / App Builder',
];

export const SORT_OPTIONS = [
  { value: 'went_live', label: 'Newest' },
  { value: 'dr', label: 'Authority' },
  { value: 'relevance', label: 'Relevance' },
  { value: 'first_seen', label: 'First seen' },
];

function buildUrl(base, params) {
  const search = new URLSearchParams();
  Object.entries({ ...CLIENT, ...params }).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });

  if (/^https?:\/\//i.test(base)) {
    const url = new URL(base);
    search.forEach((value, key) => url.searchParams.set(key, value));
    return url.toString();
  }

  return `${base}?${search.toString()}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
  });

  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  if (!data || data.ok === false) {
    throw new Error(data?.error || 'FreeSerp request failed');
  }
  return data;
}

async function get(params) {
  const candidates = import.meta.env.DEV
    ? [buildUrl(DEV_PROXY, params), buildUrl(WORKER_URL, params), buildUrl(API_URL, params)]
    : [buildUrl(WORKER_URL, params), buildUrl(API_URL, params)];

  let lastError;

  for (const url of candidates) {
    try {
      return await fetchJson(url);
    } catch (error) {
      lastError = error;
      await sleep(200);
    }
  }

  const status = lastError?.status ? ` (${lastError.status})` : '';
  throw new Error(`Could not reach FreeSerp${status}. Check your connection and try again.`);
}

export function searchSites({
  q = '',
  niche = '',
  sort = 'went_live',
  order = 'desc',
  drMin = '',
  fromDate = '',
  toDate = '',
  size = 12,
  from = 0,
} = {}) {
  return get({
    index: 'sites',
    ai_startups: 1,
    q: q || undefined,
    ai_categories: niche || undefined,
    sort,
    order: sort === 'relevance' ? undefined : order,
    dr_min: drMin || undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
    size,
    from,
  });
}

export function fetchStats() {
  return get({ stats: 1 });
}

export function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
