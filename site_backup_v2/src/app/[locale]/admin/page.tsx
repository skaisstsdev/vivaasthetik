import { setRequestLocale } from 'next-intl/server';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide">
            Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gray-50 border border-gray-100 p-12 text-center rounded">
          <p className="text-gray-500">Authentication Required. Admin interface coming soon.</p>
        </div>
      </div>
    </main>
  );
}
