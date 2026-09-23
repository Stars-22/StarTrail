/**
 * 由 IANA 时区名生成展示标签，如 Asia/Shanghai -> "UTC+8" / "GMT+8"。
 * 分钟偏移非零时输出 "UTC+5:30" 形式。
 */
export function utcOffsetLabel(timeZone: string, prefix: 'UTC' | 'GMT' = 'UTC'): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    }).formatToParts(new Date());
    const name = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT+00:00';
    const match = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!match) return `${prefix}+0`;
    const [, sign, hours, minutes] = match;
    return minutes && minutes !== '00'
      ? `${prefix}${sign}${Number(hours)}:${minutes}`
      : `${prefix}${sign}${Number(hours)}`;
  } catch {
    return `${prefix}+0`;
  }
}
