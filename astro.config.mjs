import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';

// site / defaultLocale 均读取自 src/data/site.json（单一数据源），无需两处同步维护。
const site = JSON.parse(
  readFileSync(new URL('./src/data/site.json', import.meta.url), 'utf8'),
);

export default defineConfig({
  site: site.url,
  output: 'static',
  i18n: {
    defaultLocale: site.defaultLang,
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
