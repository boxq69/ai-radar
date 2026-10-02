const API_URL = 'https://freeserp.ai/api.php';
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
  return `${base}?${search.toString()}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // No custom headers — keeps this a "simple" CORS request.
    // FreeSerp's preflight does not allow Access-Control-Allow-Headers.
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      const err = new Error(`HTTP ${response.status}`);
      err.status = response.status;
      throw err;
    }
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'FreeSerp request failed');
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function shouldRetry(error) {
  return error?.status === 502 || error?.status === 503 || error?.name === 'AbortError';
}

async function get(params) {
  const bases = import.meta.env.DEV ? [DEV_PROXY, API_URL] : [API_URL];
  let lastError;

  for (const base of bases) {
    try {
      return await fetchJson(buildUrl(base, params));
    } catch (error) {
      lastError = error;
      if (shouldRetry(error)) {
        await sleep(300);
        try {
          return await fetchJson(buildUrl(base, params));
        } catch (retryError) {
          lastError = retryError;
        }
      }
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
