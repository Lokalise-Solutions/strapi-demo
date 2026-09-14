import type { Viewport } from 'next';
import { Suspense } from 'react';

import { i18n } from '@/i18n.config';

import './globals.css';

import { SlugProvider } from '@/app/context/SlugContext';
import { Preview } from '@/components/preview';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F97362' },
    { media: '(prefers-color-scheme: dark)', color: '#131E29' },
  ],
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-salmon border-t-transparent" />
      <p className="text-sm text-neutral-500">Loading the site…</p>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Preview />
        <SlugProvider>
          <Suspense fallback={<RootLoading />}>{children}</Suspense>
        </SlugProvider>
      </body>
    </html>
  );
}
