'use client';

import React, { useCallback, useState } from 'react';
import { CalendarDays, Inbox, Settings, LogOut, Check, Loader2, RefreshCw } from 'lucide-react';
import { adminLogin, adminLogout, getAdminSnapshot, AdminSnapshot } from '@/app/actions/admin';
import { useAdminData } from './useAdminData';
import { HINTS } from './hints';
import { Hint, ToastProvider, useToast, usePersistentState, btn } from './components/ui';
import { JournalTab } from './components/JournalTab';
import { RequestsTab } from './components/RequestsTab';
import { ScheduleTab } from './components/ScheduleTab';

const TABS = ['journal', 'requests', 'schedule'] as const;
type Tab = (typeof TABS)[number];
const TAB_KEY = 'viva-admin-tab';

export default function AdminClient({ initialSnapshot }: { initialSnapshot: AdminSnapshot | null }) {
  return (
    <ToastProvider>
      <AdminGate initialSnapshot={initialSnapshot} />
    </ToastProvider>
  );
}

function AdminGate({ initialSnapshot }: { initialSnapshot: AdminSnapshot | null }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const toast = useToast();

  const onUnauthorized = useCallback(() => {
    setSnapshot(null);
    toast.error('Сессия истекла — войдите заново.');
  }, [toast]);

  if (!snapshot) return <LoginForm onLoggedIn={setSnapshot} />;
  return <AdminShell initial={snapshot} onLogout={() => setSnapshot(null)} onUnauthorized={onUnauthorized} />;
}

// ---------------------------------------------------------

function LoginForm({ onLoggedIn }: { onLoggedIn: (s: AdminSnapshot) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await adminLogin(password);
      if (!res.ok) return setError(res.error || 'Не удалось войти');
      const snap = await getAdminSnapshot();
      if (snap.ok) onLoggedIn(snap.snapshot);
      else setError(snap.error);
    } catch {
      setError('Нет связи с сервером');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 admin-ui text-gray-900">
      <form onSubmit={submit} className="bg-white p-8 md:p-10 shadow-xl border border-gray-100 rounded-2xl w-full max-w-sm flex flex-col gap-5">
        <div>
          <h1 className="text-2xl">VIVA Ästhetik</h1>
          <p className="text-sm text-gray-500 mt-1">Вход в панель управления</p>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Пароль</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-3 text-base outline-none focus:border-gray-900"
            autoComplete="current-password"
            autoFocus
          />
        </label>
        {error && <p className="text-sm text-red-600 -mt-2">{error}</p>}
        <button type="submit" className={btn.primary} disabled={!password || busy}>
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Войти
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------

function AdminShell({ initial, onLogout, onUnauthorized }: { initial: AdminSnapshot; onLogout: () => void; onUnauthorized: () => void }) {
  const data = useAdminData(initial, onUnauthorized);
  const [tab, setTab] = usePersistentState<Tab>(TAB_KEY, 'journal', TABS);
  const newCount = data.bookings.filter(b => b.status === 'pending').length;

  const go = (t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  const logout = async () => {
    await adminLogout();
    onLogout();
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; hint: string; badge?: number }[] = [
    { id: 'journal', label: 'Журнал', icon: <CalendarDays className="w-5 h-5" />, hint: HINTS.tabJournal },
    { id: 'requests', label: 'Заявки', icon: <Inbox className="w-5 h-5" />, hint: HINTS.tabRequests, badge: newCount },
    { id: 'schedule', label: 'Расписание', icon: <Settings className="w-5 h-5" />, hint: HINTS.tabSchedule },
  ];

  return (
    <div className="min-h-screen bg-gray-50 admin-ui text-gray-900 w-full overflow-x-clip pb-24 md:pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-medium text-base md:text-lg truncate">VIVA Ästhetik</span>
            <span className="hidden sm:inline text-xs text-gray-400">Панель управления</span>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1 h-full">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`relative h-full px-4 flex items-center gap-2 text-sm transition-colors ${tab === t.id ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {t.icon}{t.label}
                {!!t.badge && <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-gray-900 text-xs font-semibold leading-5 text-center">{t.badge}</span>}
                {tab === t.id && <span className="absolute left-2 right-2 bottom-0 h-0.5 bg-gray-900 rounded-full" />}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <SaveIndicator pending={data.pending} onRefresh={() => data.refresh()} />
            <button onClick={logout} className={btn.ghost} aria-label="Выйти">
              <LogOut className="w-4 h-4" /><span className="hidden lg:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <div className="flex items-center gap-2 mb-5">
          <h1 className="text-2xl md:text-3xl">{tabs.find(t => t.id === tab)!.label}</h1>
          <Hint text={tabs.find(t => t.id === tab)!.hint} />
        </div>
        {tab === 'journal' && <JournalTab data={data} />}
        {tab === 'requests' && <RequestsTab data={data} initialSegment={newCount ? 'new' : 'all'} />}
        {tab === 'schedule' && <ScheduleTab data={data} />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 grid grid-cols-3 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${tab === t.id ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
          >
            <span className="relative">
              {t.icon}
              {!!t.badge && <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-gray-900 text-[10px] font-semibold leading-[18px] text-center">{t.badge}</span>}
            </span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function SaveIndicator({ pending, onRefresh }: { pending: number; onRefresh: () => void }) {
  return (
    <span className="flex items-center gap-1">
      {pending > 0 ? (
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /><span className="hidden sm:inline">Сохраняю…</span></span>
      ) : (
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-gray-900 px-2 py-1.5 rounded-md hover:bg-gray-100" title="Обновить данные">
          <Check className="w-4 h-4" /><span className="hidden sm:inline">Сохранено</span><RefreshCw className="w-3 h-3 opacity-50" />
        </button>
      )}
      <Hint text={HINTS.saveStatus} />
    </span>
  );
}
