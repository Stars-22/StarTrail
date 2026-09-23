// POST /api/update-stars 契约：x-cron-key 鉴权 → GitHub REST → 写 KV；句柄签名与 KV API 以 EdgeOne 官方文档为准。
import reposManifest from './_repos.gen.json';

const GITHUB = 'https://api.github.com';

async function gh(path: string, token: string) {
  const res = await fetch(GITHUB + path, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'startrail-updater',
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}

export async function onRequest(context: any) {
  const { request, env } = context;
  if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);
  if (request.headers.get('x-cron-key') !== env.CRON_KEY) return json({ error: 'unauthorized' }, 401);

  const errors: any[] = [];
  const repos: Record<string, any> = {};
  let totalStars = 0;

  for (const batch of chunk(reposManifest.repos, 8)) {
    await Promise.all(
      batch.map(async (repo) => {
        try {
          const data = await gh(`/repos/${repo}`, env.GITHUB_TOKEN);
          repos[repo] = {
            stars: data.stargazers_count,
            forks: data.forks_count,
            updatedAt: new Date().toISOString(),
          };
          totalStars += data.stargazers_count;
          await env.STARS_KV.put(`stars:${repo}`, JSON.stringify(repos[repo]));
        } catch (error) {
          errors.push({ repo, message: String(error) });
        }
      }),
    );
  }

  let user: any = null;
  try {
    const u = await gh(`/users/${reposManifest.user}`, env.GITHUB_TOKEN);
    user = {
      followers: u.followers,
      publicRepos: u.public_repos,
      totalStars,
      updatedAt: new Date().toISOString(),
    };
    await env.STARS_KV.put('user:stats', JSON.stringify(user));
  } catch (error) {
    errors.push({ repo: `user:${reposManifest.user}`, message: String(error) });
  }

  return json({ updated: reposManifest.repos.length, user, repos, errors }, 200);
}
