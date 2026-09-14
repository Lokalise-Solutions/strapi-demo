import { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Outfit, Source_Serif_4 } from 'next/font/google';
import { draftMode } from 'next/headers';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { Banner } from '@/components/banner';
import { DraftModeBanner } from '@/components/draft-mode-banner';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { AIToast } from '@/components/toast';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchSingleType } from '@/lib/strapi';
import { cn } from '@/lib/utils';
import type { LocaleParamsProps } from '@/types/types';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700'],
  variable: '--font-display',
});

// The Strapi client intentionally bypasses `'use cache'` when
// ENVIRONMENT=development so content edits show up immediately, which makes
// these routes blocking rather than prerenderable.
export const instant = false;

// Default Global SEO for pages without them
export async function generateMetadata({
  params,
}: PropsWithChildren<LocaleParamsProps>): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await fetchSingleType('global', { locale });

  const seo = pageData.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function LocaleLayout({
  children,
  params,
}: PropsWithChildren<LocaleParamsProps>) {
  const { isEnabled: isDraftMode } = await draftMode();
  const { locale } = await params;
  const pageData = await fetchSingleType('global', { locale });
  const isDemo = process.env.NEXT_IS_DEMO === 'true';

  return (
    <ViewTransitions>
      <div
        className={cn(
          outfit.variable,
          sourceSerif.variable,
          outfit.className,
          'bg-white text-brand-black antialiased min-h-full w-full'
        )}
      >
        {isDemo && <Banner />}
        <Navbar data={pageData.navbar} locale={locale} hasBanner={isDemo} />
        {children}
        <Footer data={pageData.footer} locale={locale} />
        <AIToast />
        {isDraftMode && <DraftModeBanner />}
      </div>
    </ViewTransitions>
  );
}
