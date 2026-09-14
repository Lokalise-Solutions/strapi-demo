export type MarketingLink = {
  text: string;
  URL: string;
  target?: string;
};

const EXCLUDED_PATH_SEGMENTS = ['products', 'pricing'] as const;

export function isExcludedMarketingUrl(
  url: string | undefined | null
): boolean {
  if (url === undefined || url === null || url.length === 0) {
    return false;
  }

  const normalized = url.toLowerCase();

  return EXCLUDED_PATH_SEGMENTS.some((segment) => {
    return (
      normalized === segment ||
      normalized === `/${segment}` ||
      normalized.endsWith(`/${segment}`) ||
      normalized.includes(`/${segment}/`) ||
      normalized.includes(`/${segment}?`)
    );
  });
}

export function filterMarketingLinks(
  links: MarketingLink[] | undefined | null
): MarketingLink[] {
  if (links === undefined || links === null) {
    return [];
  }

  return links.filter((link) => isExcludedMarketingUrl(link.URL) === false);
}

export const HIDDEN_DYNAMIC_ZONES = new Set([
  'dynamic-zone.pricing',
  'dynamic-zone.related-products',
]);
