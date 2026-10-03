'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAdminSnapshot, ActionResult, AdminBooking, AdminSnapshot } from '@/app/actions/admin';
import { OverrideMap, WeekTemplate, normalizeTemplate, resolveDay, ResolvedDay } from '@/lib/availability';
import { useToast } from './components/ui';
import { fmtDate } from './lib';

const POLL_MS = 15000;

export interface AdminState {
  bookings: AdminBooking[];
  template: WeekTemplate;
  overrides: OverrideMap;
}

function toState(s: AdminSnapshot): AdminState {
  const overrides: OverrideMap = {};
  s.overrides.forEach(o => { overrides[o.date] = o; });
  return { bookings: s.bookings, template: normalizeTemplate(s.template), overrides };
}

export interface MutateOptions {
  /** Applied immediately so the UI reacts instantly; replaced by server truth afterwards. */
  optimistic?: (s: AdminState) => AdminState;
  success?: string;
}

/**
 * Admin data with race-free sync:
 * - mutations run strictly one after another (queue), so the server sees them in order;
 * - the server snapshot returned by a mutation is applied only when no other mutation
 *   is still queued (otherwise it would briefly undo the later optimistic change);
 * - background polling pauses while anything is saving or the tab is hidden, and a poll
 *   result is discarded if a mutation started after the poll was sent.
 */
export function useAdminData(initial: AdminSnapshot, onUnauthorized: () => void) {
  const toast = useToast();
  const [state, setState] = useState<AdminState>(() => toState(initial));
  const [pending, setPending] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState(() => Date.now());

  const seq = useRef(0);
  const pendingRef = useRef(0);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const knownPending = useRef(new Set(initial.bookings.filter(b => b.status === 'pending').map(b => b.id)));
  const onUnauthorizedRef = useRef(onUnauthorized);
  useEffect(() => { onUnauthorizedRef.current = onUnauthorized; }, [onUnauthorized]);

  const applySnapshot = useCallback((snap: AdminSnapshot, fromPoll = false) => {
    const fresh = snap.bookings.filter(b => b.status === 'pending' && !knownPending.current.has(b.id));
    snap.bookings.filter(b => b.status === 'pending').forEach(b => knownPending.current.add(b.id));
    if (fromPoll && fresh.length) {
      const b = fresh[0];
      toast.info(fresh.length === 1
        ? `Новая заявка: ${b.clientName}, ${fmtDate(b.date, 'd MMM')} в ${b.time}`
        : `Новых заявок: ${fresh.length}`);
      try { new Audio('/notification.mp3').play().catch(() => {}); } catch {}
    }
    setState(toState(snap));
    setLastSyncedAt(Date.now());
  }, [toast]);

  const refresh = useCallback(async (fromPoll = false) => {
    const startedAt = seq.current;
    try {
      const res = await getAdminSnapshot();
      if (!res.ok) {
        if (res.unauthorized) onUnauthorizedRef.current();
        return;
      }
      // A mutation started meanwhile — its own snapshot is newer than ours.
      if (seq.current !== startedAt || pendingRef.current > 0) return;
      applySnapshot(res.snapshot, fromPoll);
    } catch (e) {
      console.error('Admin sync failed', e);
    }
  }, [applySnapshot]);

  const mutate = useCallback((action: () => Promise<ActionResult>, opts: MutateOptions = {}): Promise<boolean> => {
    seq.current++;
    pendingRef.current++;
    setPending(p => p + 1);
    if (opts.optimistic) setState(opts.optimistic);

    const job = queue.current.then(async () => {
      let ok = false;
      try {
        const res = await action();
        if (res.ok) {
          ok = true;
          if (pendingRef.current === 1) applySnapshot(res.snapshot);
          if (opts.success) toast.success(opts.success);
        } else if (res.unauthorized) {
          onUnauthorizedRef.current();
        } else {
          toast.error(res.error);
        }
      } catch (e) {
        console.error('Admin action failed', e);
        toast.error('Нет связи с сервером — изменения не сохранены.');
      } finally {
        pendingRef.current--;
        setPending(p => p - 1);
      }
      // On failure (or if this was the last job but it failed), pull server truth to undo the optimistic change.
      if (!ok && pendingRef.current === 0) {
        seq.current++;
        await refresh();
      }
      return ok;
    });
    queue.current = job.catch(() => {});
    return job;
  }, [applySnapshot, refresh, toast]);

  // Background polling
  useEffect(() => {
    const tick = () => {
      if (pendingRef.current === 0 && !document.hidden) refresh(true);
    };
    const id = setInterval(tick, POLL_MS);
    const onVisible = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  const resolve = useCallback(
    (date: string): ResolvedDay => resolveDay(date, state.template, state.overrides),
    [state.template, state.overrides],
  );

  /** Active (non-cancelled) bookings grouped by date. */
  const activeByDate = useMemo(() => {
    const map: Record<string, AdminBooking[]> = {};
    state.bookings.forEach(b => {
      if (b.status !== 'cancelled') (map[b.date] ||= []).push(b);
    });
    Object.values(map).forEach(list => list.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [state.bookings]);

  return { ...state, pending, lastSyncedAt, mutate, refresh, resolve, activeByDate };
}

export type AdminData = ReturnType<typeof useAdminData>;
