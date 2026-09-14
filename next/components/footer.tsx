import { Link } from 'next-view-transitions';
import React from 'react';

import { Logo } from '@/components/logo';
import { type MarketingLink, filterMarketingLinks } from '@/lib/marketing';

export const Footer = async ({
  data,
  locale,
}: {
  data: any;
  locale: string;
}) => {
  const internalLinks = filterMarketingLinks(
    data?.internal_links as MarketingLink[] | undefined
  );
  const policyLinks = filterMarketingLinks(
    data?.policy_links as MarketingLink[] | undefined
  );
  const socialLinks = filterMarketingLinks(
    data?.social_media_links as MarketingLink[] | undefined
  );

  return (
    <div className="relative">
      <div className="border-t border-neutral-800 px-8 pt-16 pb-12 relative bg-brand-black">
        <div className="max-w-7xl mx-auto text-sm text-neutral-400 flex sm:flex-row flex-col justify-between items-start">
          <div>
            <div className="mr-4 md:flex mb-4 [filter:brightness(0)_invert(1)]">
              {data?.logo?.image && (
                <Logo image={data?.logo?.image} locale={locale} />
              )}
            </div>
            <div className="max-w-xs text-neutral-400">{data?.description}</div>
            <div className="mt-4 text-neutral-500">{data?.copyright}</div>
          </div>
          <div className="grid grid-cols-3 gap-10 items-start mt-10 md:mt-0">
            <LinkSection links={internalLinks} locale={locale} />
            <LinkSection links={policyLinks} locale={locale} />
            <LinkSection links={socialLinks} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkSection = ({
  links,
  locale,
}: {
  links: MarketingLink[];
  locale: string;
}) => (
  <div className="flex justify-center space-y-4 flex-col mt-4">
    {links.map((link) => (
      <Link
        key={link.text}
        className="transition-colors hover:text-white text-neutral-400 text-xs sm:text-sm"
        href={`${link.URL.startsWith('http') ? '' : `/${locale}`}${link.URL}`}
      >
        {link.text}
      </Link>
    ))}
  </div>
);
