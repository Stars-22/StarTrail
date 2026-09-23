import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'zh' | 'en';
export type ProjectEntry = CollectionEntry<'projects'>;

/** 去掉 `.zh` / `.en` 后缀，得到基名 slug */
export function baseSlug(id: string): string {
  return id.replace(/\.(zh|en)$/, '');
}

/** 返回条目自身语言；共用文件（无后缀）返回 null */
export function entryLang(id: string): Lang | null {
  const m = id.match(/\.(zh|en)$/);
  return m ? (m[1] as Lang) : null;
}

export interface LocalizedProject {
  base: string;
  entry: ProjectEntry;
}

/**
 * 按语言取项目列表：优先该语言文件，其次共用文件，最后另一语言兜底。
 * 排序：进行中置顶，其余按 start 倒序（§3.9）。
 */
export async function localizedProjects(lang: Lang): Promise<LocalizedProject[]> {
  const all = await getCollection('projects');
  const map = new Map<string, { zh?: ProjectEntry; en?: ProjectEntry; shared?: ProjectEntry }>();

  for (const entry of all) {
    const base = baseSlug(entry.id);
    const slot = map.get(base) ?? {};
    const l = entryLang(entry.id);
    if (l) slot[l] = entry;
    else slot.shared = entry;
    map.set(base, slot);
  }

  const list = [...map.entries()].map(([base, slot]) => {
    const entry = slot[lang] ?? slot.shared ?? slot[lang === 'zh' ? 'en' : 'zh'];
    if (!entry) throw new Error(`项目 ${base} 缺少可用内容`);
    return { base, entry };
  });

  list.sort((a, b) => {
    const aOngoing = !a.entry.data.end;
    const bOngoing = !b.entry.data.end;
    if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;
    return b.entry.data.start.localeCompare(a.entry.data.start);
  });

  return list;
}
