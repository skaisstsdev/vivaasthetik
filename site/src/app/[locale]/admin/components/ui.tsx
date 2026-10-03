'use client';

import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Info, X, CheckCircle2, AlertCircle, Bell } from 'lucide-react';

// ---------------------------------------------------------
// Hint — "ⓘ" button with a popover. Click/tap to open, works on touch.
// ---------------------------------------------------------

export function Hint({ text, label = 'Подсказка' }: { text: string; label?: string }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const close = useCallback(() => setPos(null), []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pos) return close();
    const r = btnRef.current!.getBoundingClientRect();
    const width = Math.min(288, window.innerWidth - 32);
    const left = Math.max(16, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 16));
    const below = r.bottom + 8;
    setPos({ top: below + 140 > window.innerHeight ? Math.max(16, r.top - 8 - 140) : below, left });
  };

  useEffect(() => {
    if (!pos) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    window.addEventListener('click', close);
    const timer = setTimeout(close, 5000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('click', close);
    };
  }, [pos, close]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-expanded={!!pos}
        aria-describedby={pos ? id : undefined}
        className="inline-flex items-center justify-center w-6 h-6 -m-0.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors align-middle flex-shrink-0"
      >
        <Info className="w-4 h-4" />
      </button>
      {pos && typeof document !== 'undefined' && createPortal(
        <div
          id={id}
          role="tooltip"
          onClick={e => e.stopPropagation()}
          style={{ top: pos.top, left: pos.left, width: Math.min(288, window.innerWidth - 32) }}
          className="admin-ui fixed z-[100] bg-gray-900 text-white text-[13px] leading-relaxed p-3 rounded-lg shadow-2xl animate-in fade-in duration-150"
        >
          {text}
        </div>,
        document.body,
      )}
    </>
  );
}

// ---------------------------------------------------------
// Sheet — right drawer on desktop, bottom sheet on mobile.
// ---------------------------------------------------------

export function Sheet({ title, subtitle, onClose, children, footer, wide = false }: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end admin-ui text-gray-900" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={onClose} />
      <div className={`relative bg-white w-full ${wide ? 'md:w-[640px]' : 'md:w-[480px]'} max-h-[92vh] md:max-h-none md:h-full rounded-t-2xl md:rounded-none shadow-2xl flex flex-col animate-in slide-in-from-bottom md:slide-in-from-right duration-300`}>
        <div className="md:hidden flex justify-center pt-2"><div className="w-10 h-1 rounded-full bg-gray-300" /></div>
        <div className="flex items-start justify-between gap-4 px-5 md:px-6 pt-3 md:pt-6 pb-4 border-b border-gray-100">
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-medium leading-tight">{title}</h3>
            {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="p-2 -m-2 text-gray-400 hover:text-gray-900 rounded-full" aria-label="Закрыть">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5">{children}</div>
        {footer && <div className="border-t border-gray-100 px-5 md:px-6 py-4 bg-white pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------
// Toasts
// ---------------------------------------------------------

type ToastKind = 'success' | 'error' | 'info';
interface ToastItem { id: number; kind: ToastKind; text: string }
interface ToastApi { success: (t: string) => void; error: (t: string) => void; info: (t: string) => void }

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const push = useCallback((kind: ToastKind, text: string) => {
    const id = nextId.current++;
    setItems(prev => [...prev.slice(-3), { id, kind, text }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), kind === 'error' ? 7000 : 3500);
  }, []);

  const api = useMemo<ToastApi>(() => ({
    success: t => push('success', t),
    error: t => push('error', t),
    info: t => push('info', t),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="admin-ui fixed z-[90] top-4 left-4 right-4 md:left-auto md:right-6 md:top-6 flex flex-col gap-2 items-stretch md:items-end pointer-events-none" aria-live="polite">
        {items.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-2xl text-sm md:max-w-sm animate-in fade-in slide-in-from-top-2 ${
              t.kind === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
            }`}
          >
            {t.kind === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />}
            {t.kind === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {t.kind === 'info' && <Bell className="w-5 h-5 flex-shrink-0 text-amber-300" />}
            <span className="leading-snug">{t.text}</span>
            <button onClick={() => setItems(prev => prev.filter(x => x.id !== t.id))} className="ml-auto opacity-60 hover:opacity-100" aria-label="Закрыть">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ---------------------------------------------------------
// Small controls
// ---------------------------------------------------------

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-gray-900' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export function Segmented<T extends string>({ value, onChange, options, className = '' }: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
  className?: string;
}) {
  return (
    <div className={`inline-flex bg-gray-100 p-1 rounded-lg gap-1 ${className}`} role="tablist">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
            value === o.value ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function TimeSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border border-gray-200 rounded-lg px-3 py-2.5 text-base bg-white outline-none focus:border-gray-900 tabular-nums"
    >
      {!options.includes(value) && <option value={value}>{value}</option>}
      {options.map(t => <option key={t} value={t}>{t}</option>)}
    </select>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`bg-white border border-gray-200/70 rounded-xl shadow-sm ${className}`}>{children}</section>;
}

export function SectionTitle({ children, hint, right }: { children: React.ReactNode; hint?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
        {children}
        {hint && <Hint text={hint} />}
      </h2>
      {right}
    </div>
  );
}

export const btn = {
  primary: 'inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]',
  secondary: 'inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 transition-colors min-h-[44px]',
  danger: 'inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40 transition-colors min-h-[44px]',
  ghost: 'inline-flex items-center justify-center gap-1.5 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 transition-colors min-h-[40px]',
};

// ---------------------------------------------------------
// Per-viewer UI preference in localStorage (remembered tab, collapsed card).
// Falls back to memory when storage is unavailable (private mode).
// ---------------------------------------------------------

const memory = new Map<string, string>();
const storeListeners = new Set<() => void>();

function subscribeStore(cb: () => void) {
  storeListeners.add(cb);
  window.addEventListener('storage', cb);
  return () => {
    storeListeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
}

export function usePersistentState<T extends string>(key: string, fallback: T, allowed?: readonly T[]): [T, (v: T) => void] {
  const read = () => {
    let v: string | null | undefined;
    try { v = localStorage.getItem(key); } catch {}
    v ??= memory.get(key);
    return v && (!allowed || allowed.includes(v as T)) ? (v as T) : fallback;
  };
  const value = useSyncExternalStore(subscribeStore, read, () => fallback);
  const set = useCallback((v: T) => {
    memory.set(key, v);
    try { localStorage.setItem(key, v); } catch {}
    storeListeners.forEach(l => l());
  }, [key]);
  return [value, set];
}
