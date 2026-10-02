/**
 * CORS-clean proxy for FreeSerp.
 * FreeSerp sometimes returns duplicate Access-Control-Allow-Origin headers,
 * which Chrome rejects even when the HTTP status is 200.
 */
const UPSTREAM = 'https://freeserp.ai/api.php';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
        status: 405,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const incoming = new URL(request.url);
    const target = new URL(UPSTREAM);
    incoming.searchParams.forEach((value, key) => {
      target.searchParams.set(key, value);
    });

    try {
      const upstream = await fetch(target.toString(), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cf: { cacheTtl: 30, cacheEverything: true },
      });

      const body = await upstream.arrayBuffer();
      return new Response(body, {
        status: upstream.status,
        headers: {
          ...CORS,
          'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
          'Cache-Control': 'public, max-age=30',
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ ok: false, error: 'upstream', detail: String(error?.message || error) }),
        {
          status: 502,
          headers: { ...CORS, 'Content-Type': 'application/json' },
        },
      );
    }
  },
};
