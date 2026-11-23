import OpenAI from 'openai';
import { buildSystemPrompt } from '@/lib/chat/prompt';
import { retrieveContext, type Loc } from '@/lib/chat/knowledge';
import { checkRateLimit } from '@/lib/chat/rateLimit';
import { scrubPersonalData } from '@/lib/chat/scrub';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';
const MAX_MESSAGES = 10; // сколько последних реплик уходит в модель
const MAX_CHARS = 600; // длина одной реплики пользователя
const MAX_OUTPUT_TOKENS = 1200; // включает «размышления» модели

const MSG = {
  de: {
    busy: 'Gerade ist der Assistent stark ausgelastet. Bitte versuchen Sie es später erneut oder rufen Sie uns an: +49 179 9004902.',
    flagged: 'Dabei kann ich leider nicht helfen. Bei Fragen zu unseren Behandlungen und zur Terminbuchung bin ich gern für Sie da.',
    error: 'Der Assistent ist gerade nicht erreichbar. Bitte rufen Sie uns an oder schreiben Sie per WhatsApp: +49 179 9004902.',
    bad: 'Ungültige Anfrage.',
  },
  ru: {
    busy: 'Ассистент сейчас перегружен. Попробуйте позже или позвоните нам: +49 179 9004902.',
    flagged: 'С этим, к сожалению, не могу помочь. По вопросам процедур и записи я с радостью отвечу.',
    error: 'Ассистент сейчас недоступен. Позвоните нам или напишите в WhatsApp: +49 179 9004902.',
    bad: 'Некорректный запрос.',
  },
} as const;

type Incoming = { role: 'user' | 'assistant'; content: string };

function textResponse(text: string, status = 200) {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// Подсказка модели: язык последнего сообщения (кириллицу определяем точно, латиницу оставляем модели)
function detectLang(text: string): string | undefined {
  if (/[іїєґІЇЄҐ]/.test(text)) return 'Ukrainian';
  if (/[а-яё]/i.test(text)) return 'Russian';
  const de = /\b(ich|wie|was|kann|ist|nicht|und|der|die|das|ein|eine|bitte|sie|können|wann|wo|ob|für|mit|gibt|haben|möchte|welche)\b|[äöüß]/i.test(text);
  const en = /\b(can|the|is|are|do|does|how|what|when|where|my|your|you|i|pay|card|price|cost|much|book|appointment|hello|hi)\b/i.test(text);
  if (en && !de) return 'English';
  return undefined;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : req.headers.get('x-real-ip') || 'unknown').trim();
}

export async function POST(req: Request) {
  // Запросы только с нашего же сайта
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return textResponse('Forbidden', 403);
    } catch {
      return textResponse('Forbidden', 403);
    }
  }

  let body: { messages?: unknown; locale?: unknown };
  try {
    body = await req.json();
  } catch {
    return textResponse(MSG.de.bad, 400);
  }
  const loc: Loc = body.locale === 'ru' ? 'ru' : 'de';

  // Пробелы и переводы строк по краям (бывают при вставке в Vercel) ломают заголовок авторизации
  const apiKey = process.env.OPENAI_API_KEY?.replace(/\s+/g, '');
  if (!apiKey) return textResponse(MSG[loc].error, 503);

  // Проверка и обрезка входящих реплик
  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages: Incoming[] = raw
    .filter(
      (m): m is Incoming =>
        !!m && typeof m === 'object' &&
        ((m as Incoming).role === 'user' || (m as Incoming).role === 'assistant') &&
        typeof (m as Incoming).content === 'string' &&
        (m as Incoming).content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role,
      // Телефоны, e-mail, IBAN и т. п. не уходят в OpenAI
      content: scrubPersonalData(m.content.slice(0, MAX_CHARS)),
    }));

  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') return textResponse(MSG[loc].bad, 400);

  const limit = checkRateLimit(clientIp(req));
  if (!limit.ok) return textResponse(MSG[loc].busy, 429);

  const client = new OpenAI({ apiKey });

  // Модерация бесплатна. Если сервис недоступен, чат продолжает работать.
  try {
    const mod = await client.moderations.create({
      model: 'omni-moderation-latest',
      input: last.content,
    });
    if (mod.results.some((r) => r.flagged)) return textResponse(MSG[loc].flagged);
  } catch {
    /* пропускаем */
  }

  // Контекст сайта под последние вопросы пользователя
  const recentUserText = messages
    .filter((m) => m.role === 'user')
    .slice(-3)
    .map((m) => m.content)
    .join(' ');
  const context = retrieveContext(recentUserText, loc);
  const instructions =
    buildSystemPrompt(loc, detectLang(last.content)) +
    '\n\n# SITE CONTEXT (excerpts from the website for the current question)\n' +
    (context || '(no specific page matched; use the facts above)') +
    `\n\nFINAL REMINDER: the context above is in ${loc === 'de' ? 'German' : 'Russian'}, but you must write your reply in ${detectLang(last.content) ?? "the language of the user's last message"}. Translate the facts.`;

  try {
    const stream = await client.responses.create({
      model: MODEL,
      instructions,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      reasoning: { effort: 'minimal' },
      max_output_tokens: MAX_OUTPUT_TOKENS,
      store: false, // OpenAI не хранит ответ для своих целей
      stream: true,
    });

    const encoder = new TextEncoder();
    const out = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'response.output_text.delta') {
              controller.enqueue(encoder.encode(event.delta));
            }
          }
        } catch (err) {
          console.error('[chat] stream error', err instanceof Error ? err.message : err);
        } finally {
          controller.close();
        }
      },
    });
    return new Response(out, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[chat] openai error', err instanceof Error ? err.message : err);
    return textResponse(MSG[loc].error, 502);
  }
}
