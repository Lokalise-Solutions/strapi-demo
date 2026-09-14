'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useSlugContext } from '@/app/context/SlugContext';
import { i18n } from '@/i18n.config';
import { cn } from '@/lib/utils';

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const { state } = useSlugContext();
  const { localizedSlugs } = state;

  const pathname = usePathname();

  const generateLocalizedPath = (locale: string): string => {
    if (!pathname) return `/${locale}`;

    const segments = pathname.split('/');

    if (segments.length <= 2) {
      return `/${locale}`;
    }

    if (localizedSlugs[locale]) {
      segments[1] = locale;
      segments[segments.length - 1] = localizedSlugs[locale];
      return segments.join('/');
    }

    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="flex gap-1 p-1 rounded-lg bg-neutral-100">
      {i18n.locales.map((locale) => (
        <Link key={locale} href={generateLocalizedPath(locale)}>
          <div
            className={cn(
              'flex cursor-pointer items-center justify-center text-sm leading-[110%] w-8 py-1 rounded-md text-muted transition duration-200',
              locale === currentLocale
                ? 'bg-white text-brand-black shadow-sm'
                : 'hover:text-brand-black'
            )}
          >
            {locale}
          </div>
        </Link>
      ))}
    </div>
  );
}
