import { t, type Lang } from './i18n';

/** 年限计算（§3.11）：now 取构建时刻 */
export function yearsSince(started: string, now: Date = new Date()): number {
  const [year, month] = started.split('-').map(Number);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  if (months < 0) {
    console.warn(`[experience] started=${started} 晚于构建日期，按 0 展示`);
    return 0;
  }
  return Math.floor(months / 12);
}

/** years > 0 → about.years；years === 0 → about.yearsUnderOne */
export function formatYears(years: number, lang: Lang): string {
  return years > 0 ? t(lang, 'about.years', { count: years }) : t(lang, 'about.yearsUnderOne');
}
