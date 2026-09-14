import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (text: string | null | undefined, length: number) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

export const formatNumber = (
  number: number,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

const resolveApiUrl = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  if (fromEnv !== undefined && fromEnv.trim() !== '') {
    // Node 17+ prefers IPv6 for `localhost`. Strapi binds 0.0.0.0 (IPv4),
    // so server-side fetches to localhost:1337 can hang until TCP timeout
    // and leave the root Suspense spinner on screen.
    try {
      const parsed = new URL(fromEnv);
      if (parsed.hostname === 'localhost') {
        parsed.hostname = '127.0.0.1';
        return parsed.toString().replace(/\/$/, '');
      }
    } catch {
      return fromEnv;
    }
    return fromEnv;
  }

  return globalThis.document?.location.host.endsWith('.strapidemo.com')
    ? `https://${document.location.host.replace('client-', 'api-')}`
    : '';
};

export const API_URL = resolveApiUrl();

// Strapi's content source maps (sent in draft mode) append invisible stega
// markers to every string so the admin preview can locate fields in the DOM.
// They are only valid inside visible text nodes — in URLs or other attributes
// they get percent-encoded (breaking the URL) and cause hydration mismatches.
export const stripStegaMarkers = (value: string): string =>
  value.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');

// Blocks (rich text) content snapshots the media URL from the authoring
// environment (e.g. http://localhost:1337/uploads/...), so any /uploads/
// path must be rebuilt against the current Strapi host before rendering.
export const normalizeStrapiMediaUrl = (url: string): string => {
  const cleanUrl = stripStegaMarkers(url);
  try {
    const { pathname } = new URL(cleanUrl, API_URL || 'http://localhost');
    if (pathname.startsWith('/uploads/')) {
      return API_URL + pathname;
    }
  } catch {
    // not a parseable URL; render it unchanged
  }
  return cleanUrl;
};
