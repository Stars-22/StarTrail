import { defineConfig } from 'astro/config';

// site 与 defaultLocale 需与 src/data/site.json 的 url / defaultLang 同步维护。
export default defineConfig({
  site: 'https://startrail.example.com',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
