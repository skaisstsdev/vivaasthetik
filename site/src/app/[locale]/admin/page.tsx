import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAdminSnapshot } from '@/app/actions/admin';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Admin · VIVA Ästhetik',
  robots: { index: false, follow: false },
};

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Returns { ok: false } without a valid admin cookie, so no data reaches the browser.
  const res = await getAdminSnapshot();

  return <AdminClient initialSnapshot={res.ok ? res.snapshot : null} />;
}
