// Простое ограничение запросов в памяти сервера. На Vercel каждый экземпляр функции
// считает отдельно, поэтому это защита «по минимуму». Главный предел расходов — лимит
// бюджета в аккаунте OpenAI (Settings → Limits).
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 20; // сообщений за 10 минут с одного адреса
const DAILY_TOTAL = 600; // сообщений в сутки на экземпляр

const hits = new Map<string, number[]>();
let day = new Date().toDateString();
let dayCount = 0;

export function checkRateLimit(ip: string): { ok: boolean } {
  const now = Date.now();
  const today = new Date().toDateString();
  if (today !== day) {
    day = today;
    dayCount = 0;
  }
  if (dayCount >= DAILY_TOTAL) return { ok: false };

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP) {
    hits.set(ip, recent);
    return { ok: false };
  }
  recent.push(now);
  hits.set(ip, recent);
  dayCount++;

  // Чтобы карта не росла бесконечно
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return { ok: true };
}
