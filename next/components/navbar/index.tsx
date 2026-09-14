'use client';

import { motion } from 'framer-motion';

import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';
import { type MarketingLink, filterMarketingLinks } from '@/lib/marketing';

export function Navbar({
  data,
  locale,
  hasBanner,
}: {
  data: any;
  locale: string;
  hasBanner?: boolean;
}) {
  const leftNavbarItems = filterMarketingLinks(
    data?.left_navbar_items as MarketingLink[] | undefined
  );
  const rightNavbarItems = filterMarketingLinks(
    data?.right_navbar_items as MarketingLink[] | undefined
  );

  return (
    <motion.nav
      className={`fixed ${hasBanner === true ? 'top-[3.25rem]' : 'top-0'} inset-x-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-neutral-200`}
    >
      <div className="hidden lg:block w-full max-w-7xl mx-auto">
        <DesktopNavbar
          locale={locale}
          leftNavbarItems={leftNavbarItems}
          rightNavbarItems={rightNavbarItems}
          logo={data?.logo}
        />
      </div>
      <div className="flex h-full w-full items-center lg:hidden">
        <MobileNavbar
          locale={locale}
          leftNavbarItems={leftNavbarItems}
          rightNavbarItems={rightNavbarItems}
          logo={data?.logo}
        />
      </div>
    </motion.nav>
  );
}
