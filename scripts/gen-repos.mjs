// prebuild：读取 src/content/projects/*.md 的 frontmatter，
// 生成 functions/api/_repos.gen.json 供边缘函数静态打包。
// 仅提取 openSource === true 且 repo 形如 owner/repo 的条目，自动去重。
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = join(root, 'src', 'content', 'projects');
const site = JSON.parse(readFileSync(join(root, 'src', 'data', 'site.json'), 'utf8'));

const repos = new Set();

if (existsSync(projectsDir)) {
  for (const file of readdirSync(projectsDir)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(join(projectsDir, file), 'utf8');
    const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!block) continue;

    const fm = {};
    for (const line of block[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (!kv) continue;
      fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
    }

    if (fm.openSource === 'true' && /^[^/\s]+\/[^/\s]+$/.test(fm.repo || '')) {
      repos.add(fm.repo);
    }
  }
}

const out = { user: site.githubUser, repos: [...repos] };
const dest = join(root, 'functions', 'api', '_repos.gen.json');
writeFileSync(dest, `${JSON.stringify(out, null, 2)}\n`);
console.log(`[gen-repos] user=${out.user} repos=${out.repos.length} -> functions/api/_repos.gen.json`);
