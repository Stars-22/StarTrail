import zh from '../i18n/zh.json';
import en from '../i18n/en.json';
import site from '../data/site.json';

export type Lang = 'zh' | 'en';

const dictionaries: Record<Lang, unknown> = { zh, en };
export const ALL_LANGS: Lang[] = ['zh', 'en'];

/** 可用语言：features.i18n = false 时仅默认语言（§5.10） */
export function langs(): Lang[] {
  return site.features.i18n ? ALL_LANGS : [site.defaultLang as Lang];
}

export function isLang(value: string | undefined | null): value is Lang {
  return value === 'zh' || value === 'en';
}

function collectKeys(obj: unknown, prefix = '', out: Set<string> = new Set()): Set<string> {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object') collectKeys(value, path, out);
      else out.add(path);
    }
  }
  return out;
}

// 构建时校验：zh/en 键集合必须完全一致（§3.10），否则构建失败。
const zhKeys = collectKeys(zh);
const enKeys = collectKeys(en);
const onlyZh = [...zhKeys].filter((key) => !enKeys.has(key));
const onlyEn = [...enKeys].filter((key) => !zhKeys.has(key));
if (onlyZh.length || onlyEn.length) {
  throw new Error(
    `i18n 键集合不一致：仅 zh 有 [${onlyZh.join(', ')}]，仅 en 有 [${onlyEn.join(', ')}]`,
  );
}

/** 取界面文案，`{xxx}` 由 params 填充（§4） */
export function t(lang: Lang, key: string, params: Record<string, string | number> = {}): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined),
      dictionaries[lang],
    );
  if (typeof value !== 'string') throw new Error(`i18n 缺少键：${lang}.${key}`);
  return value.replace(/\{(\w+)\}/g, (_, name: string) =>
    name in params ? String(params[name]) : `{${name}}`,
  );
}
