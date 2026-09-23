// GET /api/stars 契约：读 KV 返回 { user, repos }；句柄签名与 KV API 以 EdgeOne 官方文档为准。
import reposManifest from './_repos.gen.json';

function json(body: unknown, status: number, cache = true) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json; charset=utf-8' };
  if (cache) {
    headers['Cache-Control'] = 'public, max-age=300, s-maxage=21600, stale-while-revalidate=86400';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export async function onRequest(context: any) {
  const { request, env } = context;
  if (request.method !== 'GET') return json({ error: 'method not allowed' }, 405, false);

  const kv = env.STARS_KV;
  const result: { user: any; repos: Record<string, any> } = { user: null, repos: {} };

  const userRaw = await kv.get('user:stats');
  if (userRaw) result.user = JSON.parse(userRaw);

  const only = new URL(request.url).searchParams.get('repos');
  const repoList = only
    ? only.split(',').map((item) => item.trim()).filter(Boolean)
    : reposManifest.repos;

  for (const repo of repoList) {
    const raw = await kv.get(`stars:${repo}`);
    if (raw) result.repos[repo] = JSON.parse(raw);
  }

  if (!result.user && Object.keys(result.repos).length === 0) {
    return json({ error: 'no data' }, 503, false);
  }
  return json(result, 200);
}
