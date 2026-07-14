import os

base_dir = '/Users/skaissts/Desktop/macbook/работа/antigravity/viva_asthetik/site/src/app/[locale]'

pages = [
    ('', 'Home'),
    ('services', 'Services'),
    ('about', 'About'),
    ('booking', 'Booking'),
    ('faq', 'FAQ'),
    ('tips', 'Tips'),
    ('contact', 'Contact'),
    ('admin', 'Admin'),
    ('impressum', 'Impressum'),
    ('datenschutz', 'Datenschutz'),
    ('agb', 'AGB')
]

for path, title in pages:
    dir_path = os.path.join(base_dir, path)
    os.makedirs(dir_path, exist_ok=True)
    with open(os.path.join(dir_path, 'page.tsx'), 'w') as f:
        f.write(f'''import {{useTranslations}} from 'next-intl';
import {{setRequestLocale}} from 'next-intl/server';

export default async function {title}Page({{params}}: {{params: Promise<{{locale: string}}>}}) {{
  const {{ locale }} = await params;
  setRequestLocale(locale);
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-heading">{title} Page</h1>
    </main>
  );
}}
''')

with open(os.path.join(base_dir, 'layout.tsx'), 'w') as f:
    f.write('''import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
''')

# Delete default next.js pages
os.remove('/Users/skaissts/Desktop/macbook/работа/antigravity/viva_asthetik/site/src/app/page.tsx')
os.remove('/Users/skaissts/Desktop/macbook/работа/antigravity/viva_asthetik/site/src/app/layout.tsx')

print("Scaffolded pages successfully")
