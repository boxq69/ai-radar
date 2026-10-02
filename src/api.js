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

async function get(params) {
  const url = buildUrl(import.meta.env.DEV ? DEV_PROXY : API_URL, params);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not reach FreeSerp (${response.status}). Try again.`);
  }

  const data = await response.json();
  if (!data?.ok) {
    throw new Error(data?.error || 'FreeSerp request failed');
  }
  return data;
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
