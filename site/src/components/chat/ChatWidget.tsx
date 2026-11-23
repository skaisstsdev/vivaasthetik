'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { X, Send, RotateCcw } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { useBooking } from '@/context/BookingContext';
import { serviceGroups } from '@/data/serviceGroups';

type Loc = 'de' | 'ru';
type Msg = { role: 'user' | 'assistant'; content: string };

const SLUGS = serviceGroups.flatMap((g) => g.slugs);

const T = {
  de: {
    open: 'Assistent öffnen',
    close: 'Schließen',
    title: 'VIVA Assistent',
    sub: 'KI-Assistent',
    introTitle: 'Hallo, ich bin der VIVA Assistent.',
    introText:
      'Ich bin ein KI-Assistent (keine Person und kein Arzt) und beantworte Fragen zu Behandlungen, Preisen und zur Terminbuchung. Ich gebe keine medizinische Beratung.',
    introData:
      'Ihre Nachrichten werden zur Beantwortung an OpenAI übermittelt. Bitte geben Sie keine Gesundheitsdaten oder persönlichen Daten ein.',
    privacy: 'Datenschutzerklärung',
    start: 'Chat starten',
    placeholder: 'Ihre Frage …',
    send: 'Senden',
    footer: 'KI-Antworten können Fehler enthalten. Keine medizinische Beratung.',
    reset: 'Neuer Chat',
    greeting: 'Wie kann ich Ihnen helfen?',
    chips: ['Wie buche ich einen Termin?', 'Was kosten die Behandlungen?', 'Wie läuft die Beratung ab?', 'Wie kann ich einen Termin absagen?'],
    book: 'Termin buchen',
    links: { '/services': 'Leistungen', '/prices': 'Preise', '/faq': 'FAQ', '/about': 'Über mich', '/tips': 'Empfehlungen', '/contact': 'Kontakt', '/impressum': 'Impressum', '/datenschutz': 'Datenschutz', '/agb': 'AGB' } as Record<string, string>,
    service: 'Zur Behandlung',
    error: 'Der Assistent ist gerade nicht erreichbar. Bitte rufen Sie uns an: +49 179 9004902.',
  },
  ru: {
    open: 'Открыть ассистента',
    close: 'Закрыть',
    title: 'VIVA Assistent',
    sub: 'ИИ-ассистент',
    introTitle: 'Здравствуйте, я VIVA Assistent.',
    introText:
      'Я ИИ-ассистент (не человек и не врач) и отвечаю на вопросы о процедурах, ценах и записи. Медицинских консультаций я не даю.',
    introData:
      'Ваши сообщения передаются в OpenAI для подготовки ответа. Пожалуйста, не пишите здесь медицинские и личные данные.',
    privacy: 'Политика конфиденциальности',
    start: 'Начать чат',
    placeholder: 'Ваш вопрос …',
    send: 'Отправить',
    footer: 'Ответы ИИ могут содержать ошибки. Это не медицинская консультация.',
    reset: 'Новый чат',
    greeting: 'Чем могу помочь?',
    chips: ['Как записаться на приём?', 'Сколько стоят процедуры?', 'Как проходит консультация?', 'Как отменить запись?'],
    book: 'Записаться',
    links: { '/services': 'Услуги', '/prices': 'Цены', '/faq': 'Вопросы и ответы', '/about': 'Обо мне', '/tips': 'Рекомендации', '/contact': 'Контакты', '/impressum': 'Impressum', '/datenschutz': 'Datenschutz', '/agb': 'AGB' } as Record<string, string>,
    service: 'К процедуре',
    error: 'Ассистент сейчас недоступен. Позвоните нам: +49 179 9004902.',
  },
} as const;

type Action = { type: 'book'; slug: string } | { type: 'link'; path: string };

// Достаёт из ответа служебные метки [[BOOK:slug]] / [[LINK:/path]] и оставляет чистый текст.
function parseReply(raw: string): { text: string; actions: Action[] } {
  const actions: Action[] = [];
  const text = raw
    .replace(/\[\[(BOOK|LINK):([^\]]*)\]\]/g, (_, kind: string, val: string) => {
      const v = val.trim();
      if (kind === 'BOOK' && (v === '' || SLUGS.includes(v))) {
        actions.push({ type: 'book', slug: v });
      } else if (kind === 'LINK') {
        const m = v.match(/^\/services\/([a-z-]+)$/);
        if (m ? SLUGS.includes(m[1]) : /^\/(services|prices|faq|about|tips|contact|impressum|datenschutz|agb)$/.test(v)) {
          actions.push({ type: 'link', path: v });
        }
      }
      return '';
    })
    // Метка ещё стримится: не показываем её обрывок
    .replace(/\[\[[^\]]*$/, '')
    .replace(/\[$/, '')
    .trim();
  return { text, actions: actions.slice(0, 2) };
}

function renderInline(s: string) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

function RichText({ text }: { text: string }) {
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`ul${out.length}`} className="list-disc pl-5 space-y-1 my-1">
          {list.map((li, i) => (
            <li key={i}>{renderInline(li)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  lines.forEach((line) => {
    const m = line.match(/^\s*(?:[-•*]|\d+\.)\s+(.*)$/);
    if (m) {
      list.push(m[1]);
    } else {
      flush();
      if (line.trim()) out.push(<p key={`p${out.length}`} className="my-1">{renderInline(line)}</p>);
    }
  });
  flush();
  return <>{out}</>;
}

export default function ChatWidget() {
  const loc = useLocale() as Loc;
  const t = T[loc] ?? T.de;
  const pathname = usePathname();
  const { openBooking } = useBooking();

  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  // Значок скрыт над хиро главной и белый над тёмно-синими блоками (помечены data-chat-dark)
  const [iconState, setIconState] = useState<'hidden' | 'dark' | 'light'>('light');
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.innerHeight - (window.innerWidth < 768 ? 92 : 48);
      let next: 'hidden' | 'dark' | 'light' = 'light';
      document.querySelectorAll<HTMLElement>('[data-chat-dark]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          next = el.dataset.chatDark === 'hero' ? 'hidden' : next === 'hidden' ? next : 'dark';
        }
      });
      setIconState(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    const timer = window.setTimeout(update, 400); // после смены страницы
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open, started]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open && started) inputRef.current?.focus();
  }, [open, started]);

  const send = useCallback(
    async (textRaw: string) => {
      const text = textRaw.trim().slice(0, 600);
      if (!text || busy) return;
      const history: Msg[] = [...messages, { role: 'user', content: text }];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setInput('');
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, locale: loc }),
          signal: ctrl.signal,
        });
        if (!res.body) throw new Error('no body');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages([...history, { role: 'assistant', content: acc }]);
        }
        if (!acc.trim()) setMessages([...history, { role: 'assistant', content: t.error }]);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setMessages([...history, { role: 'assistant', content: t.error }]);
        }
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages, loc, t.error],
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
  };

  if (pathname.startsWith('/admin')) return null;

  const btn = 'inline-flex items-center justify-center px-4 py-2 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors';

  return (
    <>
      {/* Кнопка: квадратная, прозрачная, только контур с тёмно-синим градиентом.
          На телефоне стоит выше нижней панели быстрых действий. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.open}
          tabIndex={iconState === 'hidden' ? -1 : 0}
          className={`fixed z-40 right-4 md:right-6 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] md:bottom-6 h-12 w-12 bg-transparent flex items-center justify-center touch-manipulation hover:scale-105 transition-[transform,opacity] duration-300 ${
            iconState === 'hidden' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="square" aria-hidden="true">
            <defs>
              <linearGradient id="chatIconGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2f5fd6" />
                <stop offset="0.6" stopColor="#0d2a6e" />
                <stop offset="1" stopColor="#061220" />
              </linearGradient>
            </defs>
            <path d="M3.5 4.5h17v11h-9l-5 4.5v-4.5h-3z" stroke={iconState === 'dark' ? '#ffffff' : 'url(#chatIconGrad)'} style={{ transition: 'stroke 0.3s' }} />
          </svg>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={t.title}
          className="fixed z-[45] inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] h-[min(60dvh,430px)] md:inset-x-auto md:right-6 md:bottom-6 md:w-[400px] md:h-[620px] md:max-h-[calc(100vh-3rem)] bg-white flex flex-col shadow-[0_20px_60px_rgba(6,18,32,0.3)] border border-gray-200"
        >
          <div className="flex items-center justify-between px-5 py-4 bg-[#061220] text-white">
            <div>
              <div className="font-[family-name:var(--font-bodoni)] text-xl leading-none">{t.title}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mt-1.5">{t.sub}</div>
            </div>
            <div className="flex items-center gap-1">
              {started && messages.length > 0 && (
                <button type="button" onClick={reset} aria-label={t.reset} title={t.reset} className="p-2 text-gray-300 hover:text-white">
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="p-2 text-gray-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!started ? (
            <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 leading-relaxed flex flex-col">
              <div className="my-auto">
              <h2 className="font-[family-name:var(--font-bodoni)] text-2xl text-gray-900 mb-3">{t.introTitle}</h2>
              <p className="mb-3">{t.introText}</p>
              <p className="mb-5 text-gray-500">
                {t.introData}{' '}
                <Link href="/datenschutz" className="underline underline-offset-2" onClick={() => setOpen(false)}>
                  {t.privacy}
                </Link>
              </p>
              <button type="button" onClick={() => setStarted(true)} className={`${btn} bg-[#061220] text-white hover:bg-[#0d2a6e] w-full py-3`}>
                {t.start}
              </button>
              </div>
            </div>
          ) : (
            <>
              <div ref={listRef} aria-live="polite" className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm leading-relaxed bg-[#f7f6f3]">
                <div className="max-w-[88%] bg-white border border-gray-200 px-3.5 py-2.5 text-gray-800">{t.greeting}</div>
                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {t.chips.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => send(c)}
                        className="text-left text-[13px] px-3 py-2 border border-gray-300 bg-white text-gray-800 hover:border-gray-900 transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((m, i) => {
                  if (m.role === 'user') {
                    return (
                      <div key={i} className="flex justify-end">
                        <div className="max-w-[88%] bg-[#061220] text-white px-3.5 py-2.5 whitespace-pre-wrap break-words">{m.content}</div>
                      </div>
                    );
                  }
                  const { text, actions } = parseReply(m.content);
                  const isLast = i === messages.length - 1;
                  return (
                    <div key={i} className="max-w-[88%]">
                      <div className="bg-white border border-gray-200 px-3.5 py-2.5 text-gray-800 break-words">
                        {text ? <RichText text={text} /> : <span className="text-gray-400">…</span>}
                      </div>
                      {actions.length > 0 && !(busy && isLast) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {actions.map((a, k) =>
                            a.type === 'book' ? (
                              <button
                                key={k}
                                type="button"
                                onClick={() => {
                                  setOpen(false);
                                  openBooking(a.slug || undefined);
                                }}
                                className={`${btn} bg-[#061220] text-white hover:bg-[#0d2a6e]`}
                              >
                                {t.book}
                              </button>
                            ) : (
                              <Link
                                key={k}
                                href={a.path as never}
                                onClick={() => setOpen(false)}
                                className={`${btn} border border-gray-400 text-gray-800 hover:border-gray-900 bg-white`}
                              >
                                {a.path.startsWith('/services/') ? t.service : t.links[a.path] ?? a.path}
                              </Link>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="border-t border-gray-200 bg-white p-3"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    rows={1}
                    maxLength={600}
                    placeholder={t.placeholder}
                    aria-label={t.placeholder}
                    style={{ fontSize: 16 }} className="flex-1 resize-none border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-900 max-h-28 touch-manipulation"
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    aria-label={t.send}
                    className="h-10 w-10 shrink-0 bg-[#061220] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#0d2a6e] transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-gray-500 leading-snug">{t.footer}</p>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
